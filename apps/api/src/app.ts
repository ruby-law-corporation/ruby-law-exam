import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { contractsRouter } from './modules/contracts/contracts.routes';
import { errorHandler } from './platform/http/error-handler';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.WEB_ORIGIN }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ data: { status: 'ok' } });
  });

  app.use('/api', contractsRouter);

  app.use(errorHandler);

  return app;
}
