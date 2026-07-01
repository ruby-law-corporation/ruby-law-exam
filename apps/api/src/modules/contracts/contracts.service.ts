import { v4 as uuidv4 } from 'uuid';
import type { ContractAnalysis, ContractProgressEvent } from '@app/core';
import { createJob, deleteJob, emitEvent, type Job } from '../jobs/jobs.store';
import { analyseText } from './contracts.ai-service';
import { extractText } from './contracts.extractor-service';
import { findContractById, saveContract } from './contracts.store';

type ProgressJob = Job<ContractProgressEvent>;

const JOB_RETENTION_MS = 30_000;

export async function analyseContract(
  buffer: Buffer,
  mimetype: string,
  filename: string,
  id: string = uuidv4(),
  onStage: (stage: 'extracting' | 'analysing') => void = () => {},
): Promise<ContractAnalysis> {
  onStage('extracting');
  const fullText = await extractText(buffer, mimetype);

  onStage('analysing');
  const analysis = await analyseText(fullText);

  return saveContract({
    id,
    filename,
    fullText,
    ...analysis,
    createdAt: new Date().toISOString(),
  });
}

export function startAnalysis(
  buffer: Buffer,
  mimetype: string,
  filename: string,
): string {
  const id = uuidv4();
  const job = createJob<ContractProgressEvent>(id, { stage: 'uploading' });
  void runAnalysis(id, job, buffer, mimetype, filename);
  return id;
}

async function runAnalysis(
  id: string,
  job: ProgressJob,
  buffer: Buffer,
  mimetype: string,
  filename: string,
): Promise<void> {
  try {
    await analyseContract(buffer, mimetype, filename, id, (stage) =>
      emitEvent(job, { stage }),
    );
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
