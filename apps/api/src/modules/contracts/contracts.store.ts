import { type ContractAnalysis } from '@app/core';
import { InMemoryStore, type Store } from '../../platform/db/store';

const store: Store<ContractAnalysis> = new InMemoryStore<ContractAnalysis>();

export async function saveContract(
  record: ContractAnalysis,
): Promise<ContractAnalysis> {
  return store.set(record.id, record);
}

export async function findContractById(
  id: string,
): Promise<ContractAnalysis | null> {
  return store.get(id);
}
