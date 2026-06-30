import { v4 as uuidv4 } from 'uuid';
import type { ContractAnalysis } from '@app/types';
import { analyseText } from './contracts.ai';
import { extractText } from './contracts.extractor';
import { findContractById, saveContract } from './contracts.store';

export async function analyseContract(
  buffer: Buffer,
  mimetype: string,
  filename: string,
): Promise<ContractAnalysis> {
  const text = await extractText(buffer, mimetype);
  const analysis = await analyseText(text);

  const record: ContractAnalysis = {
    id: uuidv4(),
    filename,
    ...analysis,
    createdAt: new Date().toISOString(),
  };

  return saveContract(record);
}

export function getContractById(id: string): Promise<ContractAnalysis | null> {
  return findContractById(id);
}
