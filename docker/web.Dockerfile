FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /repo

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @app/web build

FROM nginx:1.27-alpine AS runtime
COPY docker/web.nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html

ENV API_HOST=api
ENV API_PORT=3001
EXPOSE 8080
