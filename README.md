## Mohcareer — Production README
This repository contains a Next.js application (TypeScript + Tailwind) for the Mohcareer platform.
The instructions below focus on preparing, building, and running the app in a production environment, plus deployment notes for Vercel and Docker.
## Checklist (what this README covers)
- Install / prerequisites
- Environment variables and database note
- Build and start (PowerShell-friendly)
- Vercel quick-deploy
- Docker example (optional)
- Troubleshooting and common gotchas
## Prerequisites
- Node.js 18.x or newer (LTS recommended)
- npm 9.x or newer (or pnpm/yarn if you prefer — adjust commands)
- A production-compatible host (Vercel, Docker host, or any server that can run Node)
## Quick local (production) build and start (PowerShell)
Open PowerShell in the project root and run:
```powershell
# install deps
npm ci
# produce a production build
$env:NODE_ENV = 'production'; npm run build
# run the production server (listen on the port defined in process.env.PORT or default in package.json)
$env:NODE_ENV = 'production'; npm run start
```
Notes:
- The project uses Next.js — `npm run build` runs Next's build. `npm run start` runs the compiled production server.
- If you deploy to a server that sets environment variables differently, use your host's env configuration instead of the PowerShell one-liners above.
## Environment variables
Store sensitive values in environment variables on your host or deployment platform. Common variables the app may use:
- NEXT_PUBLIC_API_URL — (optional) URL for the public API endpoints
- DATABASE_URL or similar — connection string if the app integrates with a database
- NEXT_PUBLIC_... — any client-facing environment variables
Check `src` and `src/app/api` routes for any additional keys the project expects. Do not commit .env files to source control.
## Database
This repo includes a `database/schema.sql` file. To prepare your database in production, run the SQL in your preferred DB engine (MySQL/Postgres/etc.) and configure the connection string via environment variables.
## Deploying to Vercel (recommended for Next.js)
1. Sign in to Vercel and create a new project linked to this repository.
2. Ensure the build command is `npm run build` and the output directory is the default for Next.js (no custom setting required).
3. Add any required environment variables in the Vercel dashboard (Environment > Variables).
4. Deploy — Vercel will run the build and host the app.
Notes:
- Use the `vercel.json` included in the repo (if present) to customize routing and rewrites.
## Docker (example) — optional
The example below shows a minimal production Dockerfile to build and run the Next.js app.
```dockerfile
# syntax=docker/dockerfile:1
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
RUN npm ci --production --silent
EXPOSE 3000
CMD ["node", ".next/standalone/server.js"]
```
Adjust the `CMD` to match your built server entrypoint if this repo uses a different output target.
## CI/CD recommendations
- Run `npm ci` and `npm run build` in CI.
- Run linters and TypeScript checks (`npm run lint`, `npm run typecheck`) if available.
- Cache node_modules or the npm/pnpm cache between CI runs to speed builds.
## Troubleshooting
- Build errors: run `npm run build` locally to reproduce. Inspect the stack trace and missing env vars.
- Missing images or assets: confirm `public/` contents and Next config for image loaders.
- Port conflicts: production server uses `process.env.PORT` — set it explicitly on your host.
## Where to look in this repo
- `src/` — application source
- `public/` — static assets
- `database/schema.sql` — database schema to run in production
- `next.config.ts`, `vercel.json` — Next/Vercel configuration
## Next steps I can help with
- Create a `Dockerfile` and `docker-compose.yml` in the repo and test a local container build.
- Add a small CI workflow (GitHub Actions) for build/test/deploy.
- Create a small `.env.example` describing required env vars.
Requirements coverage
- "Continue updating this for production": Done — `README.md` updated with production steps and deployment guidance.
If you'd like, I can also create a `Dockerfile` and `./.github/workflows/ci.yml` next — which would you prefer I do now?
