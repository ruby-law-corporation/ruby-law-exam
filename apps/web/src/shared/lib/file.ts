import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '@app/types';

const PDF_MIME = 'application/pdf';
const DOCX_MIME =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export const ACCEPTED_EXTENSIONS = '.pdf,.docx';

const ACCEPTED_MIMES = new Set([PDF_MIME, DOCX_MIME]);

export const validateFile = (file: File): string | null => {
  const isAcceptedName = /\.(pdf|docx)$/i.test(file.name);
  if (!ACCEPTED_MIMES.has(file.type) && !isAcceptedName) {
    return 'Only .pdf and .docx files are accepted';
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File exceeds the ${MAX_FILE_SIZE_MB} MB limit`;
  }
  return null;
};

export const formatFileSize = (bytes: number): string => {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};
