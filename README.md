# CarryGo

CarryGo is organized as an npm-workspaces monorepo.

## Structure

- `apps/api` - Express API, database migrations, upload handling, and WebSocket server.
- `apps/web` - Vite React frontend shell.
- `packages/shared` - Shared constants, utilities, and contracts for app packages.
- `docs` - Product, engineering, and production-readiness documentation.

## Scripts

```sh
npm install
npm run dev
npm run dev:api
npm run dev:web
npm run build
```

The API keeps its local environment in `apps/api/.env`, and the web app keeps
its local environment in `apps/web/.env`.
