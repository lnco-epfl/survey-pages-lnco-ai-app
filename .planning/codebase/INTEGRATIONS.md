# External Integrations

**Analysis Date:** 2026-04-02

## APIs & External Services

**Graasp platform:**
- Graasp app context and app data APIs are handled through `@graasp/apps-query-client` and `@graasp/sdk`
  - SDK/client: `@graasp/apps-query-client`, `@graasp/sdk`
  - Auth/config: `VITE_API_HOST`, `VITE_GRAASP_APP_KEY` in `src/config/env.ts`
- App settings and experiment results are stored as Graasp app data in `src/config/appData.ts` and `src/modules/context/ExperimentContext.tsx`
- The app reads local context and authentication token through `WithLocalContext` and `WithTokenContext` in `src/modules/Root.tsx`

**Error tracking:**
- Sentry browser tracing and replay are initialized in `src/main.tsx`
  - SDK/client: `@sentry/react`
  - Auth/config: `VITE_SENTRY_DSN`, `VITE_SENTRY_ENV`, `VITE_VERSION`
- `src/config/sentry.ts` disables the DSN when `window.Cypress` is present

**Survey runtime:**
- jsPsych powers the player view survey flow in `src/modules/playerview/jspsych/experiment.ts`
  - SDK/client: `jspsych` and `@jspsych/plugin-*` packages
  - Purpose: render fullscreen entry, HTML prompts, and survey question timelines
- Survey editing uses `react-quill` for rich-text content in builder settings views

**UI library:**
- MUI provides the component system and icons across `src/modules/**`
  - SDK/client: `@mui/material`, `@mui/lab`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`
  - Purpose: layout, form controls, theming, icons, and CSS baseline

## Data Storage

**Databases:**
- Graasp-backed app data/settings storage through `@graasp/apps-query-client`
- No standalone database client is detected in the repository

**File Storage:**
- Not detected as a separate service
- Mock API assets are served from the local app `public/` directory, including `public/mockServiceWorker.js`

**Caching:**
- Client-side request/result caching is handled by TanStack Query in `src/modules/config/queryClient.tsx`
- Mocked API responses are available through Graasp query-client mocking and `src/mocks/db.ts`

## Authentication & Identity

**Auth Provider:**
- Graasp authentication/context is provided by `WithTokenContext` and `WithLocalContext` from `@graasp/apps-query-client`
- Permission checks use `@graasp/sdk` types and enums in `src/modules/context/ExperimentContext.tsx`

## Monitoring & Observability

**Error Tracking:**
- Sentry is the only explicit error-monitoring integration detected
- `src/modules/ErrorBoundary.tsx` wires Sentry error capture into the UI fallback flow

**Logs:**
- Application logging is primarily `console.error`, `console.warn`, and `console.debug`
- ESLint allows `console.error`, `console.warn`, `console.debug`, and `console.info` in `eslint.config.mjs`

## CI/CD & Deployment

**Hosting:**
- GitHub Pages deployment is defined in `.github/workflows/deploy-github.yml`
- Graasp S3/CloudFront deployment is defined in `.github/workflows/deploy-dev.yml`, `.github/workflows/deploy-stage.yml`, and `.github/workflows/deploy-prod.yml`

**CI Pipeline:**
- GitHub Actions build checks run in `.github/workflows/build.yml`
- Cypress runs are defined in `.github/workflows/cypress.yml`
- Release automation uses `.github/workflows/release-please.yml` and `.github/workflows/auto-tag.yml`

## Environment Configuration

**Required env vars:**
- `VITE_API_HOST` - Graasp API host
- `VITE_GRAASP_APP_KEY` - App key passed into the Graasp query client
- `VITE_ENABLE_MOCK_API` - Enables mock API mode in `src/config/env.ts`
- `VITE_VERSION` - Build version shown in Sentry config and app env
- `VITE_SENTRY_ENV` - Sentry environment name
- `VITE_SENTRY_DSN` - Sentry DSN
- `VITE_PORT` - Dev/preview/test server port
- `VITE_GA_MEASUREMENT_ID` - Exposed from `src/config/env.ts`; no analytics client usage was detected in the inspected code
- `VITE_DEBUG` - Enables extra notifier output in `src/modules/config/queryClient.tsx`

**Secrets location:**
- GitHub Actions secrets and variables supply deployment and Sentry values in `.github/workflows/*.yml`
- Local development/test values are described in `README.md` and loaded with `env-cmd` for Cypress commands

## Webhooks & Callbacks

**Incoming:**
- `repository_dispatch` triggers are used for staging and production deployment workflows in `.github/workflows/deploy-stage.yml` and `.github/workflows/deploy-prod.yml`
- `workflow_dispatch` triggers the GitHub Pages deployment workflow in `.github/workflows/deploy-github.yml`

**Outgoing:**
- Graasp deployment actions publish built assets to S3 and invalidate CloudFront in the deployment workflows
- Sentry receives browser telemetry from `src/main.tsx` via `@sentry/react`

## Localization

**Supported locales:**
- English (`en`) and French (`fr`) are loaded in `src/config/i18n.ts`
- `DEFAULT_LANGUAGE` is `en`
- The active language follows `context.lang` in `src/modules/main/App.tsx`

**Translation resources:**
- Translation JSON files live in `src/langs/en.json` and `src/langs/fr.json`
- The i18next namespace is `translations`
- Type augmentation for translations is defined in `src/@types/i18next.d.ts`

---

*Integration audit: 2026-04-02*
