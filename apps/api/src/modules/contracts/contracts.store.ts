import { contractAnalysisSchema, type ContractAnalysis } from '@app/core';
import { prisma } from '../../platform/db/prisma';

export async function saveContract(
  record: ContractAnalysis,
): Promise<ContractAnalysis> {
  const row = await prisma.contract.create({ data: record });
  return contractAnalysisSchema.parse(row);
}

export async function findContractById(
  id: string,
): Promise<ContractAnalysis | null> {
  const row = await prisma.contract.findUnique({ where: { id } });
  return row && contractAnalysisSchema.parse(row);
}
