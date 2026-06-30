import { Router } from 'express';
import { asyncHandler } from '../../platform/http/async-handler';
import { getContract, uploadContract } from './contracts.controller';
import { uploadMiddleware } from './contracts.upload';

export const contractsRouter = Router();

contractsRouter.post(
  '/contracts/upload',
  uploadMiddleware,
  asyncHandler(uploadContract),
);
contractsRouter.get('/contracts/:id', asyncHandler(getContract));
