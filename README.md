# Contract Analysis Feature — Senior Developer Exam

> This repository is used for the **Ruby Law** senior full-stack developer hiring exam.  
> If you found this as a candidate: welcome. Read everything below carefully before writing any code.

---

## Your task in one sentence

Build a small, well-engineered **Contract Upload & AI Analysis** feature in Node.js + React using TypeScript.

Read the full exam specification here: **[EXAM.md](./EXAM.md)**

---

## How to submit

1. **Fork this repository** (button top-right on GitHub) — do NOT clone and create a new repo
2. Create your working branch:
   ```bash
   git checkout -b candidate/<your-github-username>
   ```
   Example: `candidate/jane-smith`
3. Do all your work on that branch
4. When you are done, open a **Pull Request** from `candidate/<your-github-username>` → `main`
5. Fill in the PR template that appears automatically

> **Deadline:** 48 hours from when you receive this link. The PR timestamp is your submission time.

---

## Project structure

A pnpm + Turborepo monorepo. Apps live under `apps/`, shared packages under `packages/`.

```
/
├── apps/
│   ├── api/                # Express + TypeScript API (@app/api)
│   │   └── src/
│   │       ├── config/         # env loading
│   │       ├── platform/http/  # ApiError, async handler, error handler
│   │       └── modules/
│   │           └── contracts/  # routes → controller → service → ai/extractor/store
│   └── web/                # React + Vite + TypeScript (@app/web), feature-sliced
│       └── src/
│           ├── app/             # app shell, global styles
│           ├── pages/           # route-level pages
│           ├── features/        # feature slices (contract-analysis)
│           └── shared/          # shared api, lib, ui
├── packages/
│   ├── core/               # @app/core — shared Zod schemas, types, constants, domain logic
│   └── eslint-config/      # @app/eslint-config — shared flat ESLint config (base + react)
├── docker/                 # Dockerfiles for the api + web images
├── docker-compose.yml      # Run API + web together
├── tsconfig.base.json      # Shared TS compiler options
├── turbo.json              # Turborepo task pipeline
├── pnpm-workspace.yaml
├── .env.example            # Copy to .env at the repo root
├── EXAM.md                 # Full specification (read this first)
└── README.md               # This file
```

---

## Local setup

Requires **Node.js 22+** and **pnpm 10+** (`corepack enable` will provision pnpm).

```bash
# 1. Fork this repo on GitHub, then clone YOUR fork
git clone https://github.com/<your-username>/ruby-law-exam.git
cd ruby-law-exam

# 2. Create your branch
git checkout -b candidate/<your-github-username>

# 3. Install all workspace dependencies from the repo root
pnpm install

# 4. Set up environment variables (single .env at the repo root)
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# 5. Run everything: API + web
pnpm dev                  # API on :3001, web on :5173
# …or a single app:
pnpm dev:api
pnpm dev:web
```

> Contracts are stored in memory (a `Map` inside the API process) — no database to set
> up. Data resets when the API restarts, which is fine for this exercise.

### Workspace commands (run from the repo root)

| Command          | Description                              |
| ---------------- | ---------------------------------------- |
| `pnpm dev`       | Run API + web in parallel                |
| `pnpm build`     | Build all apps                           |
| `pnpm typecheck` | Type-check every package                 |
| `pnpm lint`      | ESLint across the workspace              |
| `pnpm test`      | Run unit tests (Vitest)                  |
| `pnpm format`    | Prettier write                           |
| `pnpm docker:up` | Build & run API + web via Docker Compose |

### Docker

`pnpm docker:up` builds both images and runs them with Docker Compose: the API on
**http://localhost:3001** and the web app on **http://localhost:5173** (served by Vite's
preview server). Pass your `OPENAI_API_KEY` via the root `.env` or the environment when
running compose.

---

## Questions?

Open a GitHub Issue in this repo with the label **`question`**.  
We check during business hours (Mon–Fri, 9am–6pm AEST).

Do not email. All communication goes through GitHub Issues so every candidate has the same information.

---

## Notes for candidates

- You are **expected and encouraged** to use AI coding assistants (Copilot, Cursor, Claude, etc.)
- You **will be asked to explain your code** in the 45-minute review call — know what you submitted
- We value a **small, clean, working slice** over a large, incomplete mess
- Read the full evaluation criteria in [EXAM.md](./EXAM.md) before you start so you know what we weight

---

_Good luck._
