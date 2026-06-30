import type { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';
import { ApiError } from './api-error';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ApiError) {
    res
      .status(err.statusCode)
      .json({ error: { code: err.code, message: err.message } });
    return;
  }

  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({
        error: {
          code: 'FILE_TOO_LARGE',
          message: 'File exceeds the 10 MB limit',
        },
      });
      return;
    }
    res
      .status(400)
      .json({ error: { code: 'UPLOAD_ERROR', message: err.message } });
    return;
  }

  const message =
    err instanceof Error ? err.message : 'Unexpected server error';
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message } });
}
