# Technology Stack

**Analysis Date:** 2026-04-02

## Languages

**Primary:**

- TypeScript 5.6.2 - Source code in `src/**/*.ts` and `src/**/*.tsx`, plus tool configs such as `vite.config.ts` and `eslint.config.mjs`
- TSX - React components in `src/**/*.tsx`

**Secondary:**

- JSON - Translation resources in `src/langs/en.json` and `src/langs/fr.json`
- CSS - Global and component styling in `src/index.css` and imported library styles such as `react-toastify/dist/ReactToastify.min.css`

## Runtime

**Environment:**

- Browser-based React application built with Vite
- Node.js runtime is required for local tooling, but no Node version is pinned in the repository

**Package Manager:**

- Yarn 4.5.0 - Declared in `package.json`
- Lockfile: present (`yarn.lock`)
- Yarn linker: `node-modules` from `.yarnrc.yml`

## Frameworks

**Core:**

- React 18.3.1 - UI runtime in `src/main.tsx` and `src/modules/Root.tsx`
- Vite 5.x - Dev server, build, and preview via `vite.config.ts`
- TypeScript 5.6.2 - Type checking and typed React code
- MUI 5.16.x - Main component library and theming in `src/modules/Root.tsx`
- jsPsych 8.0.2 - Survey playback engine in `src/modules/playerview/jspsych/experiment.ts`

**Testing:**

- Cypress 13.15.0 - End-to-end and component testing via `cypress.config.ts`
- nyc 17.1.0 - Coverage reporting for Cypress runs
- `@cypress/code-coverage` 3.13.2 - Coverage hooks in Cypress

**Build/Dev:**

- `@vitejs/plugin-react` - React transforms for Vite
- `vite-plugin-checker` - TypeScript and ESLint checks during dev builds
- `vite-plugin-istanbul` - Coverage instrumentation, forced in test mode
- ESLint 8.57.1 with flat config - Static analysis in `eslint.config.mjs`
- Prettier 3.3.3 - Formatting via `prettier:write` and `prettier:check`
- Husky 9.1.6 - Git hooks installed in `postinstall`
- commitlint 19.5.0 - Conventional commit enforcement
- concurrently 8.2.2 - Parallel test runner orchestration
- env-cmd 10.1.0 - Loads `.env.test` for Cypress commands

## Key Dependencies

**Critical:**

- `@graasp/apps-query-client` 3.4.15 - Graasp context, API client, query client, and mock API support in `src/main.tsx` and `src/modules/config/queryClient.tsx`
- `@graasp/sdk` 4.9.0 - Graasp data models and permission types in `src/config/appData.ts`, `src/modules/context/ExperimentContext.tsx`, and `src/modules/main/App.tsx`
- `@sentry/react` 7.119.0 - Error boundary and browser tracing/replay setup in `src/main.tsx` and `src/modules/ErrorBoundary.tsx`
- `react-i18next` 14.1.3 and `i18next` 23.9.0 - Runtime localization in `src/config/i18n.ts` and `src/modules/main/App.tsx`
- `@tanstack/react-query` 4.36.x - Data fetching and mutation layer configured through `src/modules/config/queryClient.tsx`

**Infrastructure:**

- `react-toastify` 10.0.5 - Toast notifications in `src/modules/Root.tsx`, `src/modules/common/CustomToasts.tsx`, and `src/modules/config/queryClient.tsx`
- `date-fns` 4.1.0 - Date formatting in `src/modules/builderview/results/ResultsView.tsx`
- `lodash` 4.17.21 - Utility usage such as `sortBy` in `src/modules/context/ExperimentContext.tsx`
- `react-quill` 2.x - Rich text editing in builder settings views
- `@jspsych/*` plugins - Survey/question widgets in `src/modules/playerview/jspsych/experiment.ts`
- `miragejs` 0.1.48 and `nock` 13.5.3 - Mocking/test support in the repository dependencies
- `sass-embedded` 1.80.3 - Sass support in the Vite toolchain

## Configuration

**Environment:**

- Runtime configuration is read from Vite env variables in `src/config/env.ts` and `src/env.d.ts`
- Cypress can inject the same values through `window.Cypress` and `Cypress.env()` in `src/config/env.ts`
- Local development and test commands depend on `.env.development` and `.env.test` files described in `README.md`

**Build:**

- `vite.config.ts` sets the dev server port, preview port, build output directory (`build`), alias `@` to `src`, and test-mode instrumentation
- `eslint.config.mjs` defines the flat ESLint config and parser project `tsconfig.eslint.json`
- `tsconfig.json`, `tsconfig.node.json`, and `tsconfig.eslint.json` split app, tool, and lint TypeScript settings
- `.github/workflows/*.yml` defines build and deploy jobs for CI/CD

## Platform Requirements

**Development:**

- Modern browser support is implied by the Vite/React setup and the browserslist targets in `package.json`
- Local dev requires environment variables for the Graasp API host, app key, and optional mock API mode
- Cypress tests assume Chrome in headless CI and a running Vite test server

**Production:**

- Production deployment uses GitHub Actions and Graasp deployment workflows
- One deployment path publishes to GitHub Pages via `.github/workflows/deploy-github.yml`
- Graasp deployment workflows publish built assets to S3/CloudFront via `graasp/graasp-deploy` actions

---

_Stack analysis: 2026-04-02_
