import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getTextMock, destroyMock, extractRawTextMock } = vi.hoisted(() => ({
  getTextMock: vi.fn(),
  destroyMock: vi.fn(),
  extractRawTextMock: vi.fn(),
}));

vi.mock('pdf-parse', () => ({
  PDFParse: vi.fn(function () {
    return { getText: getTextMock, destroy: destroyMock };
  }),
}));
vi.mock('mammoth', () => ({
  default: { extractRawText: extractRawTextMock },
}));

import { DOCX_MIME, PDF_MIME, extractText } from './contracts.extractor';

describe('extractText', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('extracts and trims text from a PDF', async () => {
    getTextMock.mockResolvedValue({ text: '  hello pdf  ' });
    const text = await extractText(Buffer.from('x'), PDF_MIME);
    expect(text).toBe('hello pdf');
    expect(destroyMock).toHaveBeenCalled();
  });

  it('extracts text from a DOCX', async () => {
    extractRawTextMock.mockResolvedValue({ value: 'hello docx' });
    const text = await extractText(Buffer.from('x'), DOCX_MIME);
    expect(text).toBe('hello docx');
  });

  it('throws 415 for an unsupported mime type', async () => {
    await expect(
      extractText(Buffer.from('x'), 'image/png'),
    ).rejects.toMatchObject({ statusCode: 415, code: 'UNSUPPORTED_FILE_TYPE' });
  });

  it('throws 422 when parsing fails', async () => {
    getTextMock.mockRejectedValue(new Error('corrupt'));
    await expect(extractText(Buffer.from('x'), PDF_MIME)).rejects.toMatchObject(
      { statusCode: 422, code: 'PARSE_FAILED' },
    );
  });

  it('throws 422 when no readable text is extracted', async () => {
    extractRawTextMock.mockResolvedValue({ value: '   ' });
    await expect(
      extractText(Buffer.from('x'), DOCX_MIME),
    ).rejects.toMatchObject({ statusCode: 422, code: 'EMPTY_CONTRACT' });
  });
});
