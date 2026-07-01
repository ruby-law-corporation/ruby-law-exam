import { Router } from 'express';
import { healthRouter } from './modules/common/health.routes';
import { contractsRouter } from './modules/contracts/contracts.routes';

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(contractsRouter);
