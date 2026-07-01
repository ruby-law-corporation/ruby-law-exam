import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { errorHandler } from './platform/http/error-handler';
import { apiRouter } from './router';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.WEB_ORIGIN }));
  app.use(express.json());
  app.use('/api', apiRouter);
  app.use(errorHandler);

  return app;
}
