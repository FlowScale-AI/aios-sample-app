# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server on port 5174
npm run build     # Type-check + build for production (tsc && vite build)
npm run preview   # Preview the production build locally
```

No test or lint scripts are configured.

## Architecture

This is a minimal React + TypeScript app demonstrating integration with **FlowScale AIOS** — an AI workflow automation platform. It shows authentication, tool listing, and tool execution against a local FlowScale instance.

### API Layer (`src/api/client.ts`)

Two patterns are used:
- **Auth endpoints** (login, me, logout): Custom `authFetch()` with `credentials: 'include'` so the browser manages the `fs_session` cookie automatically.
- **Tool endpoints** (list, get, run): `@flowscale/sdk`'s `createClient()`, which abstracts polling, error handling, and URL resolution. Initialized with `baseUrl: ''` so Vite's dev proxy forwards `/api/*` to `localhost:14173`.

### Auth Flow

`useAuth` hook calls `apiClient.me()` on mount. If authenticated, the main app renders; otherwise `LoginForm` appears. Session state lives only in the `fs_session` cookie — no localStorage or React context for tokens.

### Dev Proxy

`vite.config.ts` proxies `/api/*` → `http://localhost:14173` (the local FlowScale server) with a 360-second timeout to handle long-running tool executions.

### FlowScale SDK Usage

```typescript
const sdkClient = createClient({ baseUrl: '', sessionToken: 'browser-session' })

sdkClient.tools.list()                          // List production tools
sdkClient.tools.get(id)                         // Get tool definition
sdkClient.tools.run(id, inputs, { onProgress }) // Execute with built-in polling
sdkClient.resolveUrl(path)                      // Resolve output paths to absolute URLs
```

The SDK handles async polling internally — `tools.run()` resolves when execution completes.
