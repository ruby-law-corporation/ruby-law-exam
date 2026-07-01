import { Router } from 'express';
import { asyncHandler } from '../../platform/http/async-handler';
import { validate } from '../../platform/http/validate';
import {
  downloadReport,
  getContract,
  streamProgress,
  uploadContract,
} from './contracts.controller';
import { contractIdParamsSchema } from './contracts.schema';
import { uploadMiddleware } from './contracts.upload';

export const contractsRouter = Router();

contractsRouter.post('/contracts/upload', uploadMiddleware, uploadContract);
contractsRouter.get(
  '/contracts/:id/progress',
  validate({ params: contractIdParamsSchema }),
  streamProgress,
);
contractsRouter.get(
  '/contracts/:id',
  validate({ params: contractIdParamsSchema }),
  asyncHandler(getContract),
);
contractsRouter.get(
  '/contracts/:id/report',
  validate({ params: contractIdParamsSchema }),
  asyncHandler(downloadReport),
);
