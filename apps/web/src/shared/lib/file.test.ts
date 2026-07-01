import { MAX_FILE_SIZE_BYTES } from '@app/types';
import { describe, expect, it } from 'vitest';
import { formatFileSize, validateFile } from './file';

const makeFile = (name: string, type: string, size: number): File => {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('validateFile', () => {
  it('accepts a valid PDF within the size limit', () => {
    const file = makeFile('contract.pdf', 'application/pdf', 1024);
    expect(validateFile(file)).toBeNull();
  });

  it('rejects an unsupported file type', () => {
    const file = makeFile('image.png', 'image/png', 1024);
    expect(validateFile(file)).toBe('Only .pdf and .docx files are accepted');
  });

  it('rejects a file that exceeds the size limit', () => {
    const file = makeFile(
      'big.pdf',
      'application/pdf',
      MAX_FILE_SIZE_BYTES + 1,
    );
    expect(validateFile(file)).toMatch(/exceeds/);
  });
});

describe('formatFileSize', () => {
  it('formats megabytes with one decimal', () => {
    expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
  });

  it('formats sub-megabyte sizes as kilobytes', () => {
    expect(formatFileSize(500 * 1024)).toBe('500 KB');
  });
});
