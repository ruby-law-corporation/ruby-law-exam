import type { ContractAnalysis } from '@app/types';
import { requestData } from '@/shared/api';

export async function uploadContract(file: File): Promise<ContractAnalysis> {
  const formData = new FormData();
  formData.append('file', file);

  return requestData<ContractAnalysis>('/api/contracts/upload', {
    method: 'POST',
    body: formData,
  });
}
