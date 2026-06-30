import type { Request, Response } from 'express';
import { ApiError } from '../../platform/http/api-error';
import { analyseContract, getContractById } from './contracts.service';

export async function uploadContract(
  req: Request,
  res: Response,
): Promise<void> {
  if (!req.file) {
    throw new ApiError(400, 'NO_FILE', 'No file uploaded');
  }

  const result = await analyseContract(
    req.file.buffer,
    req.file.mimetype,
    req.file.originalname,
  );
  res.status(201).json({ data: result });
}

export function getContract(req: Request, res: Response): void {
  const record = getContractById(req.params.id ?? '');
  if (!record) {
    throw new ApiError(404, 'NOT_FOUND', 'Contract not found');
  }
  res.json({ data: record });
}
