import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';
import { ApiError } from '../../platform/http/api-error';

export const PDF_MIME = 'application/pdf';
export const DOCX_MIME =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const PARSERS: Record<string, (buffer: Buffer) => Promise<string>> = {
  [PDF_MIME]: async (buffer) => {
    const parser = new PDFParse({ data: buffer });
    return parser
      .getText()
      .then((result) => result.text)
      .finally(() => parser.destroy());
  },
  [DOCX_MIME]: async (buffer) =>
    (await mammoth.extractRawText({ buffer })).value,
};

export async function extractText(
  buffer: Buffer,
  mimetype: string,
): Promise<string> {
  const parse = PARSERS[mimetype];
  if (!parse) {
    throw new ApiError(
      415,
      'UNSUPPORTED_FILE_TYPE',
      `Unsupported file type: ${mimetype}`,
    );
  }

  const text = await parse(buffer).catch(() => {
    throw new ApiError(422, 'PARSE_FAILED', 'The document could not be parsed');
  });

  const trimmed = text.trim();
  if (!trimmed) {
    throw new ApiError(
      422,
      'EMPTY_CONTRACT',
      'No readable text could be extracted from the document',
    );
  }

  return trimmed;
}
