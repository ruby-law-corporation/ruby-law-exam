import {
  isContractProgressComplete,
  type ContractProgressEvent,
} from '@app/core';
import type { Request, Response } from 'express';
import { streamJob } from '../jobs/jobs.sse';
import { getJob } from '../jobs/jobs.store';
import { ApiError } from '../../platform/http/api-error';
import { openSseStream } from '../../platform/http/sse';
import { sendFile } from '../../platform/http/send-file';
import {
  generateReportName,
  generateReportPdf,
} from './contracts.report-service';
import { getContractById, startAnalysis } from './contracts.service';

export function uploadContract(req: Request, res: Response): void {
  if (!req.file) {
    throw new ApiError(400, 'NO_FILE', 'No file uploaded');
  }

  const id = startAnalysis(
    req.file.buffer,
    req.file.mimetype,
    req.file.originalname,
  );
  res.status(202).json({ data: { id } });
}

export function streamProgress(
  req: Request<{ id: string }>,
  res: Response,
): void {
  const job = getJob<ContractProgressEvent>(req.params.id);
  if (!job) {
    throw new ApiError(404, 'NOT_FOUND', 'No analysis in progress for this id');
  }
  streamJob(job, openSseStream(req, res), isContractProgressComplete);
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
  sendFile(res, pdf, 'application/pdf', `${generateReportName(record)}.pdf`);
}
