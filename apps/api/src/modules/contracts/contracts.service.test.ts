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

import type { ContractProgressEvent } from '@app/core';
import { getJob } from '../jobs/jobs.store';
import { analyseText } from './contracts.ai-service';
import { extractText } from './contracts.extractor-service';
import {
  analyseContract,
  getContractById,
  startAnalysis,
} from './contracts.service';
import { findContractById, saveContract } from './contracts.store';

const extractTextMock = vi.mocked(extractText);
const analyseTextMock = vi.mocked(analyseText);
const saveContractMock = vi.mocked(saveContract);
const findContractByIdMock = vi.mocked(findContractById);

const collectStages = (id: string): ContractProgressEvent[] => {
  const job = getJob<ContractProgressEvent>(id);
  if (!job) throw new Error(`no job for ${id}`);
  const events: ContractProgressEvent[] = [job.lastEvent];
  job.emitter.on('event', (event: ContractProgressEvent) => events.push(event));
  return events;
};

const flush = () => new Promise((resolve) => setImmediate(resolve));

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
      riskyClauses: [
        {
          text: 'unlimited liability',
          severity: 'high',
          reason: 'Exposes the party to uncapped damages',
        },
      ],
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
      fullText: 'Some contract text',
      riskyClauses: [
        {
          text: 'unlimited liability',
          severity: 'high',
          reason: 'Exposes the party to uncapped damages',
        },
      ],
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

  it('emits extracting → analysing → done stages for a successful job', async () => {
    let releaseExtract!: (text: string) => void;
    extractTextMock.mockReturnValue(
      new Promise((resolve) => {
        releaseExtract = resolve;
      }),
    );
    analyseTextMock.mockResolvedValue({
      isContract: true,
      type: 'NDA',
      riskScore: 10,
      missingClauses: [],
      recommendations: [],
      riskyClauses: [],
    });

    const id = startAnalysis(Buffer.from('x'), 'application/pdf', 'nda.pdf');
    const stages = collectStages(id);
    releaseExtract('contract text');
    await flush();

    expect(stages.map((event) => event.stage)).toEqual([
      'extracting',
      'analysing',
      'done',
    ]);
    expect(saveContractMock).toHaveBeenCalledWith(
      expect.objectContaining({ id, filename: 'nda.pdf' }),
    );
  });

  it('emits an error stage when the AI service is unavailable', async () => {
    let releaseExtract!: (text: string) => void;
    extractTextMock.mockReturnValue(
      new Promise((resolve) => {
        releaseExtract = resolve;
      }),
    );
    analyseTextMock.mockRejectedValue(new Error('AI service is down'));

    const id = startAnalysis(Buffer.from('x'), 'application/pdf', 'nda.pdf');
    const stages = collectStages(id);
    releaseExtract('contract text');
    await flush();

    expect(stages.at(-1)).toEqual({
      stage: 'error',
      message: 'AI service is down',
    });
  });
});
