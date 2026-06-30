// TODO: extract text from PDF and DOCX buffers (e.g. pdf-parse, mammoth).

export const PDF_MIME = 'application/pdf';
export const DOCX_MIME =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export async function extractText(
  _buffer: Buffer,
  mimetype: string,
): Promise<string> {
  if (mimetype === PDF_MIME) {
    // TODO: use pdf-parse to extract text
    throw new Error('PDF extraction not implemented yet');
  }

  if (mimetype === DOCX_MIME) {
    // TODO: use mammoth to extract text
    throw new Error('DOCX extraction not implemented yet');
  }

  throw new Error(`Unsupported file type: ${mimetype}`);
}
