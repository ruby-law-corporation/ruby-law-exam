# Deploying to Azure

The two Docker images (`docker/api.Dockerfile`, `docker/web.Dockerfile`) deploy to
**Azure Container Apps** via **Azure Container Registry**. The same images that run under
Compose run on Azure — nothing in the code is Azure-specific.

## Shape

- **api** — Node bundle, internal ingress, port 3001.
- **web** — nginx serving the static Vite build, public ingress, port 8080. It
  reverse-proxies `/api/*` to the api app, so web and API stay same-origin (no CORS).

## Flow

1. Push both images to ACR (`az acr build ...`).
2. Deploy the **api** as a Container App with `internal` ingress; pass `OPENAI_API_KEY`
   as a secret.
3. Deploy the **web** as a Container App with `external` (public) ingress, pointed at the
   api app's name.

## Gotchas

- Azure injects `PORT`; the API already reads it.
- Keep the OpenAI key a Container Apps **secret** — never bake it into an image.
- Storage is in-memory, so run the API as a **single replica** (or swap in a real store
  before scaling out).
