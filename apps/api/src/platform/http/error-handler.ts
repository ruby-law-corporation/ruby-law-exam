import { MAX_FILE_SIZE_MB } from '@app/core';
import type { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';
import { ZodError } from 'zod';
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

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: err.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
    });
    return;
  }

  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({
        error: {
          code: 'FILE_TOO_LARGE',
          message: `File exceeds the ${MAX_FILE_SIZE_MB} MB limit`,
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
