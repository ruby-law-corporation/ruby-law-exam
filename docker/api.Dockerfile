FROM node:22-alpine
RUN corepack enable
WORKDIR /repo

COPY . .
RUN pnpm install --frozen-lockfile

EXPOSE 3001
CMD ["pnpm", "--filter", "@app/api", "exec", "tsx", "src/server.ts"]
