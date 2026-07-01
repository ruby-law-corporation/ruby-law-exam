import { v4 as uuidv4 } from 'uuid';
import type { ContractAnalysis } from '@app/core';
import { analyseText } from './contracts.ai-service';
import { extractText } from './contracts.extractor-service';
import { findContractById, saveContract } from './contracts.store';

export async function analyseContract(
  buffer: Buffer,
  mimetype: string,
  filename: string,
): Promise<ContractAnalysis> {
  const fullText = await extractText(buffer, mimetype);
  const analysis = await analyseText(fullText);

  const record: ContractAnalysis = {
    id: uuidv4(),
    filename,
    fullText,
    ...analysis,
    createdAt: new Date().toISOString(),
  };

  return saveContract(record);
}

export function getContractById(id: string): Promise<ContractAnalysis | null> {
  return findContractById(id);
}
