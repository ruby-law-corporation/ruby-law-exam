FROM node:22-alpine
RUN corepack enable
WORKDIR /repo

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @app/api exec prisma generate

EXPOSE 3001
CMD ["sh", "-c", "pnpm --filter @app/api exec prisma db push && pnpm --filter @app/api exec tsx src/server.ts"]
