# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is the **Ruby Law senior full-stack hiring exam**: build a Contract Upload & AI Analysis feature. `EXAM.md` is the spec (with weighted evaluation criteria); `README.md` is the candidate-facing intro. The starter ships a complete monorepo skeleton with several deliberately **unimplemented stubs** marked `TODO` that the candidate fills in:

- `apps/api/src/modules/contracts/contracts.ai.ts` — `analyseText()` throws; needs Vercel AI SDK `generateObject` + `openai`, validated against `contractAIResultSchema`.
- `apps/api/src/modules/contracts/contracts.extractor.ts` — `extractText()` throws; needs `pdf-parse` / `mammoth` wiring.
- `apps/web/src/pages/ContractUploadPage.tsx` — renders placeholder; needs `UploadForm` + `AnalysisResults` wiring with loading/error states.

When implementing, honor the existing seams (don't move `req`/`res` into services, keep AI output Zod-validated) — separation of concerns is explicitly graded.

## Commands

All commands run from the **repo root** (Turborepo orchestrates the workspaces). Requires Node 22+ and pnpm 10+ (`corepack enable`).

| Command                               | Purpose                                           |
| ------------------------------------- | ------------------------------------------------- |
| `pnpm dev`                            | Run API (port 3001) + web (port 5173) in parallel |
| `pnpm dev:api` / `pnpm dev:web`       | Run one app                                       |
| `pnpm build`                          | Build all apps                                    |
| `pnpm typecheck`                      | `tsc --noEmit` across every package               |
| `pnpm lint`                           | ESLint across the workspace                       |
| `pnpm test`                           | Vitest (`run` mode) across packages               |
| `pnpm format`                         | Prettier write                                    |
| `pnpm docker:up` / `pnpm docker:down` | API + web via Docker Compose                      |

**Single test / single package:** Turbo has no per-test filter, so target the workspace directly:

```bash
pnpm --filter @app/api test                          # one package's tests
pnpm --filter @app/api exec vitest run contracts.service   # one test file by name pattern
pnpm --filter @app/api exec vitest -t "AI service is unavailable"  # one test by title
```

Env lives in a **single `.env` at the repo root** (copy from `.env.example`). The API loads an app-local `apps/api/.env` first, then falls back to the root `.env` (`config/load-env.ts`). `VITE_`-prefixed vars are consumed by the web app at build time.

## Architecture

pnpm + Turborepo monorepo. Workspaces are `apps/*` and `packages/*`, published under the `@app/*` scope (`@app/types`, `@app/eslint-config`). `@app/types` is also a TS path alias in `tsconfig.base.json`; `@app/eslint-config` is consumed by importing its flat config in each `eslint.config.js`.

### API request flow (`apps/api/src`)

Strict layering — each layer only talks to the next:

```
routes → controller → service → { extractor, ai, store }
```

- **`server.ts`** imports `./config/load-env` _first_ (side-effect dotenv load) before anything reads `env`, then starts `createApp()`. `app.ts` holds the Express wiring (CORS locked to `env.WEB_ORIGIN`, `/api/health`, the contracts router, and the error handler **last**).
- **`modules/contracts/`** is the feature module. The naming convention is `contracts.<layer>.ts` (`.routes`, `.controller`, `.service`, `.ai`, `.extractor`, `.store`, `.upload`). Controllers translate HTTP ↔ service calls and throw `ApiError`; **services never touch `req`/`res`**.
- **`platform/http/`** is shared HTTP infrastructure: `ApiError` (status + stable code + message), `asyncHandler` (wraps async handlers so rejections reach Express's error pipeline — note `GET /:id` is sync and doesn't use it), and `errorHandler` which maps `ApiError`, `MulterError` (→ 413 on `LIMIT_FILE_SIZE`), and unknown errors into the standard envelope.

### Response envelope (a hard convention)

Every endpoint returns either `{ "data": ... }` (success) or `{ "error": { "code", "message" } }` (failure), typed as `ApiSuccess<T>` / `ApiError` in `@app/types`. Keep new endpoints consistent with this shape.

### Upload + validation

`contracts.upload.ts` configures Multer with `memoryStorage` (files arrive as `req.file.buffer` — no disk), a 10 MB limit, and a `fileFilter` accepting only `PDF_MIME` / `DOCX_MIME` (415 otherwise). These MIME constants live in `contracts.extractor.ts` and are the single source of truth for accepted types.

### Shared types (`packages/types`)

**Zod schemas are the source of truth; TS types are inferred from them**, never hand-written separately. `validation.ts` defines `contractAIResultSchema` (what the AI must return) and `contractAnalysisSchema` (= AI result extended with `id`/`filename`/`createdAt`, the stored/returned record). `types.ts` infers `ContractType`, `ContractAIResult`, `ContractAnalysis` from those. When changing the contract shape, edit the Zod schema and let the types flow.

### Storage

In-memory `Map` in `contracts.store.ts` — intentional, no database. Data is lost on restart.

## Conventions

- **TypeScript `strict: true`, no `any`.** `tsconfig.base.json` also enforces `noUnusedLocals`/`noUnusedParameters` — prefix intentionally-unused params with `_` (e.g. `_req`), as the existing code does.
- **ESLint** comes from `@app/eslint-config` (flat config: `base` for all, `react` adds React rules for the web app). Run `pnpm lint` before considering work done — it's a graded gate.
- **Service-layer tests** (Vitest) mock the AI and extractor at the module boundary with `vi.mock` and assert both the happy path and graceful AI-failure (see `contracts.service.test.ts` for the pattern).
- The build for the API is an esbuild bundle (`--packages=external`), not `tsc` emit; `tsc` is typecheck-only.
- Husky `pre-commit` runs `lint-staged` (eslint --fix on TS/JS, prettier on json/md/yaml/css); `pre-push` runs `pnpm test` across the workspace.
