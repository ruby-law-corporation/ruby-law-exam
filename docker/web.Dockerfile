FROM node:22-alpine
RUN corepack enable
WORKDIR /repo

COPY . .
RUN pnpm install --frozen-lockfile

# Vite inlines VITE_* at build time, so it comes in as a build arg (from .env via compose).
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm --filter @app/web build

EXPOSE 5173
CMD ["pnpm", "--filter", "@app/web", "preview"]
