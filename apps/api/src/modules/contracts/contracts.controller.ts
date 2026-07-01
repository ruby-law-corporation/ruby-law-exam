import type { Request, Response } from 'express';
import { ApiError } from '../../platform/http/api-error';
import { sendPdf } from '../../platform/http/send-pdf';
import {
  generateReportName,
  generateReportPdf,
} from './contracts.report-service';
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

export async function getContract(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const record = await getContractById(req.params.id);
  if (!record) {
    throw new ApiError(404, 'NOT_FOUND', 'Contract not found');
  }
  res.json({ data: record });
}

export async function downloadReport(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const record = await getContractById(req.params.id);
  if (!record) {
    throw new ApiError(404, 'NOT_FOUND', 'Contract not found');
  }

  const pdf = await generateReportPdf(record);
  sendPdf(res, pdf, generateReportName(record));
}
