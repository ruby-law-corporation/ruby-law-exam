# Contract Upload & AI Analysis

A self-contained feature that lets a user upload a `.pdf` / `.docx` contract, extracts its
text, classifies it, and runs an AI analysis returning a risk score, missing standard
clauses, and plain-English recommendations. Results stream to the UI as the analysis runs.

Built for the Ruby Law senior full-stack exam — the full brief and grading criteria are in
**[EXAM.md](./EXAM.md)**. This README is the guided tour for whoever reviews the code.

---

## Stack

| Layer     | Choice                                                          |
| --------- | --------------------------------------------------------------- |
| Runtime   | Node.js 22, pnpm 10                                             |
| Monorepo  | pnpm workspaces + Turborepo                                     |
| Backend   | Express 5 + TypeScript (`strict`), Zod validation               |
| AI        | Vercel AI SDK (`generateObject`) + OpenAI, output Zod-validated |
| Parsing   | `pdf-parse` (PDF), `mammoth` (DOCX)                             |
| Frontend  | React 19 + Vite, Tailwind v4, feature-sliced design             |
| Streaming | Server-Sent Events for live analysis progress                   |
| Tests     | Vitest (service layer, AI mocked)                               |
| Deploy    | Multi-stage Docker images → Azure Container Apps                |

---

## Architecture

### Monorepo

pnpm + Turborepo. Two apps (`apps/api`, `apps/web`) and shared packages (`packages/*`)
published under the `@app/*` scope. Turbo orchestrates `dev` / `build` / `lint` /
`typecheck` / `test` across every workspace from the repo root.

`@app/core` is the shared kernel between backend and frontend. **Zod schemas are the source
of truth; TypeScript types are inferred from them** — the API validates AI output against a
schema and the web app consumes the same inferred types, so the contract shape can't drift
between the two. It also owns shared constants (file-size limits) and risk-severity
thresholds, so the API report and the UI colour-coding agree on one definition.

### Backend — strict layering

```
routes → controller → service → { extractor, ai, store }
```

Each layer only talks to the next. Controllers translate HTTP ↔ service calls and throw a
typed `ApiError`; **services never touch `req`/`res`**. Cross-cutting HTTP concerns live in
`platform/http` (typed errors, async handler, a single error handler, SSE, validation), and
persistence sits behind a generic `Store<T>` interface in `platform/db` — today an
in-memory `Map`, swappable for a real datastore with no changes to feature code.

The contracts feature module uses a `contracts.<layer>.ts` naming convention:
`contracts.controller`, `contracts.service` (orchestrator), `contracts.ai-service`,
`contracts.extractor-service`, `contracts.report-service`, and `contracts.store`.

Every endpoint returns a consistent envelope: `{ "data": ... }` on success or
`{ "error": { "code", "message" } }` on failure.

**Endpoints**

| Method | Path                          | Purpose                              |
| ------ | ----------------------------- | ------------------------------------ |
| `POST` | `/api/contracts/upload`       | Upload + validate, kick off analysis |
| `GET`  | `/api/contracts/:id/progress` | SSE stream of analysis progress      |
| `GET`  | `/api/contracts/:id`          | Fetch the stored analysis result     |
| `GET`  | `/api/contracts/:id/report`   | Download a PDF report                |
| `GET`  | `/api/health`                 | Health check                         |

### Frontend — Feature-Sliced Design

`apps/web/src` is organised by FSD layers rather than by file type:

- **`app/`** — app shell, global styles, providers.
- **`pages/`** — route-level composition (`contract-upload`).
- **`features/`** — self-contained slices: `upload`, `analysis`, `highlighting`.
- **`shared/`** — reusable `api` client, `lib` helpers, and `ui` primitives.

Dependencies flow downward (pages → features → shared); features don't import each other.
The app calls relative `/api/*` paths, proxied to the API in dev and by nginx in the Docker
image — so it stays same-origin with no CORS.

---

## Running it

Requires **Node.js 22+** and **pnpm 10+** (`corepack enable` provisions pnpm). Set up env
once:

```bash
cp .env.example .env      # add your OPENAI_API_KEY
```

### Option A — direct (local dev)

```bash
pnpm install
pnpm dev                  # API on :3001, web on :5173 (Vite proxies /api → API)
```

Hot-reload on both apps. Run a single app with `pnpm dev:api` / `pnpm dev:web`.

### Option B — Docker Compose (production-shaped)

```bash
pnpm docker:up            # builds images, runs both; prints URLs once healthy
pnpm docker:down          # stop
```

Web on **http://localhost:5173**, API on **http://localhost:3001**. The images are
multi-stage production builds: the API runs as a bundled `node dist/server.js`; the web app
is static assets served by **nginx**, which reverse-proxies `/api/*` to the API container.
A one-shot `banner` service prints the URLs after both report healthy.

Either way, contracts are stored in memory — no database to set up; data resets on restart.

---

## Commands

Run from the repo root:

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `pnpm dev`         | Run API + web in parallel                |
| `pnpm build`       | Build all apps                           |
| `pnpm typecheck`   | Type-check every package                 |
| `pnpm lint`        | ESLint across the workspace              |
| `pnpm test`        | Run unit tests (Vitest)                  |
| `pnpm format`      | Prettier write                           |
| `pnpm docker:up`   | Build & run API + web via Docker Compose |
| `pnpm docker:down` | Stop the Docker Compose stack            |

---

## Tests

Service-layer unit tests with the AI and extractor mocked at the module boundary — covering
both the happy path and graceful AI-failure. See
`apps/api/src/modules/contracts/contracts.service.test.ts`.

```bash
pnpm test                                          # everything
pnpm --filter @app/api exec vitest run contracts   # one package / file pattern
```

---

## Layout

```
apps/
  api/   # Express API — routes → controller → service → { extractor, ai, store }
  web/   # React + Vite — feature-sliced (app / pages / features / shared)
packages/
  core/            # @app/core — Zod schemas (source of truth), types, constants, risk logic
  eslint-config/   # @app/eslint-config — shared flat ESLint config
docker/            # api + web Dockerfiles, nginx config
DEPLOYMENT.md      # Azure Container Apps deployment guide
EXAM.md            # full brief + grading criteria
```

Deployment: **[DEPLOYMENT.md](./DEPLOYMENT.md)**.
