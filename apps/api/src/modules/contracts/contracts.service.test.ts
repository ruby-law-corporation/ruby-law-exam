import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./contracts.extractor-service', () => ({
  extractText: vi.fn(),
  PDF_MIME: 'application/pdf',
  DOCX_MIME:
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}));
vi.mock('./contracts.ai-service', () => ({
  analyseText: vi.fn(),
}));
vi.mock('./contracts.store', () => ({
  saveContract: vi.fn((record) => Promise.resolve(record)),
  findContractById: vi.fn(),
}));

import { analyseText } from './contracts.ai-service';
import { extractText } from './contracts.extractor-service';
import { analyseContract, getContractById } from './contracts.service';
import { findContractById, saveContract } from './contracts.store';

const extractTextMock = vi.mocked(extractText);
const analyseTextMock = vi.mocked(analyseText);
const saveContractMock = vi.mocked(saveContract);
const findContractByIdMock = vi.mocked(findContractById);

describe('contracts.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a stored ContractAnalysis when extraction and AI succeed', async () => {
    extractTextMock.mockResolvedValue('Some contract text');
    analyseTextMock.mockResolvedValue({
      isContract: true,
      type: 'NDA',
      riskScore: 42,
      missingClauses: ['Confidentiality term'],
      recommendations: ['Add a defined term length'],
    });

    const result = await analyseContract(
      Buffer.from('x'),
      'application/pdf',
      'nda.pdf',
    );
    expect(result).toMatchObject({
      type: 'NDA',
      riskScore: 42,
      filename: 'nda.pdf',
    });
    expect(result.id).toBeTruthy();
    expect(saveContractMock).toHaveBeenCalledWith(result);
    findContractByIdMock.mockResolvedValue(result);
    expect(await getContractById(result.id)).toEqual(result);
  });

  it('propagates the error when the AI service is unavailable', async () => {
    extractTextMock.mockResolvedValue('Some contract text');
    analyseTextMock.mockRejectedValue(
      new Error('AI service not implemented yet'),
    );
    await expect(
      analyseContract(Buffer.from('x'), 'application/pdf', 'nda.pdf'),
    ).rejects.toThrow('AI service not implemented yet');
  });
});
