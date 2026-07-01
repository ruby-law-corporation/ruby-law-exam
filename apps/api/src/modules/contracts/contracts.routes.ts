import { Router } from 'express';
import { asyncHandler } from '../../platform/http/async-handler';
import { validate } from '../../platform/http/validate';
import { getContract, uploadContract } from './contracts.controller';
import { contractIdParamsSchema } from './contracts.schema';
import { uploadMiddleware } from './contracts.upload';

export const contractsRouter = Router();

contractsRouter.post(
  '/contracts/upload',
  uploadMiddleware,
  asyncHandler(uploadContract),
);
contractsRouter.get(
  '/contracts/:id',
  validate({ params: contractIdParamsSchema }),
  asyncHandler(getContract),
);
