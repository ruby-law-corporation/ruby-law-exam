import type { ContractAnalysis } from '@app/types';
import { prisma } from '../../platform/db/prisma';

export async function saveContract(
  record: ContractAnalysis,
): Promise<ContractAnalysis> {
  const row = await prisma.contract.create({ data: record });
  return row as ContractAnalysis;
}

export async function findContractById(
  id: string,
): Promise<ContractAnalysis | null> {
  const row = await prisma.contract.findUnique({ where: { id } });
  return row as ContractAnalysis | null;
}
