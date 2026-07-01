FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /repo

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @app/api build
RUN pnpm --filter @app/api deploy --prod --legacy /out

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /out ./
USER node

EXPOSE 3001
CMD ["node", "dist/server.js"]
