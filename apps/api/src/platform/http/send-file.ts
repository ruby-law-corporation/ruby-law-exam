import type { Response } from 'express';

export function sendFile(
  res: Response,
  file: Buffer,
  contentType: string,
  filename: string,
): void {
  const safeName = filename.replace(/[^\w.-]/g, '_');

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
  res.send(file);
}
