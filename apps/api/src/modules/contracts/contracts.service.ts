import { v4 as uuidv4 } from 'uuid';
import type { ContractAnalysis, ContractProgressEvent } from '@app/core';
import { createJob, deleteJob, emitEvent, type Job } from '../jobs/jobs.store';
import { analyseText } from './contracts.ai-service';
import { extractText } from './contracts.extractor-service';
import { findContractById, saveContract } from './contracts.store';

type ProgressJob = Job<ContractProgressEvent>;

const JOB_RETENTION_MS = 30_000;

export async function analyseContract(
  file: Express.Multer.File,
  id: string = uuidv4(),
  onStage: (stage: 'extracting' | 'analysing') => void = () => {},
): Promise<ContractAnalysis> {
  onStage('extracting');
  const fullText = await extractText(file.buffer, file.mimetype);

  onStage('analysing');
  const analysis = await analyseText(fullText);

  return saveContract({
    id,
    filename: file.originalname,
    fullText,
    ...analysis,
    createdAt: new Date().toISOString(),
  });
}

export function startAnalysis(file: Express.Multer.File): string {
  const id = uuidv4();
  const job = createJob<ContractProgressEvent>(id, { stage: 'uploading' });
  void runAnalysis(id, job, file);
  return id;
}

async function runAnalysis(
  id: string,
  job: ProgressJob,
  file: Express.Multer.File,
): Promise<void> {
  try {
    await analyseContract(file, id, (stage) => emitEvent(job, { stage }));
    emitEvent(job, { stage: 'done' });
  } catch (error) {
    emitEvent(job, {
      stage: 'error',
      message: error instanceof Error ? error.message : 'Analysis failed',
    });
  } finally {
    setTimeout(() => deleteJob(id), JOB_RETENTION_MS).unref();
  }
}

export function getContractById(id: string): Promise<ContractAnalysis | null> {
  return findContractById(id);
}
