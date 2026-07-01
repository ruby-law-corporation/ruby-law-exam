import type { Response } from 'express';

export function sendPdf(res: Response, pdf: Buffer, filename: string): void {
  const safeName = filename.replace(/[^\w.-]/g, '_');

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${safeName}.pdf"`,
  );
  res.send(pdf);
}
