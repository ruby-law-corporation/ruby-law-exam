export interface Env {
  PORT: number;
  WEB_ORIGIN: string;
  OPENAI_API_KEY: string | undefined;
  OPENAI_MODEL: string;
  DATABASE_URL: string;
}

export const env: Env = {
  PORT: Number(process.env.PORT) || 3001,
  WEB_ORIGIN: process.env.WEB_ORIGIN ?? 'http://localhost:5173',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
  DATABASE_URL: process.env.DATABASE_URL ?? '',
};
