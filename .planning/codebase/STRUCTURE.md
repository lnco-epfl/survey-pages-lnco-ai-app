# Codebase Structure

**Analysis Date:** 2026-04-02

## Directory Layout

```text
survey-pages-lnco-ai-app/
├── src/                  # Application source code
│   ├── config/           # Runtime configuration, query client, env, i18n, selectors
│   ├── langs/            # Translation resource JSON files
│   ├── mocks/            # Standalone/Cypress mock Graasp data and local context
│   ├── modules/          # Feature modules, views, contexts, and shared UI
│   ├── utils/            # Shared React hooks and helpers
│   ├── @types/           # Local ambient type declarations
│   ├── main.tsx          # React bootstrap entry point
│   ├── index.css         # Global app styles
│   ├── env.d.ts          # Vite environment typings
│   ├── vite-env.d.ts     # Vite environment typings
│   └── window.d.ts       # Window augmentation for test/runtime globals
├── cypress/              # Cypress end-to-end tests and TypeScript config
├── public/               # Static assets, including the MSW worker directory
├── build/                # Vite build output
├── package.json          # Scripts, dependencies, package manager, and NYC config
├── tsconfig.json         # TypeScript compiler settings and path aliasing
├── vite.config.ts        # Vite build/dev config and alias setup
└── .planning/codebase/   # Generated codebase documentation
```

## Directory Purposes

**`src/config`:**
- Purpose: centralize process/environment configuration, query-client wiring, selectors, and translation initialization.
- Contains: `src/config/env.ts`, `src/config/queryClient.tsx`, `src/config/i18n.ts`, `src/config/selectors.ts`, `src/config/appData.ts`, `src/config/messages.ts`, `src/config/sentry.ts`.
- Key files: `src/config/env.ts`, `src/config/queryClient.tsx`, `src/config/i18n.ts`.

**`src/langs`:**
- Purpose: store locale resource bundles consumed by i18n.
- Contains: `en.json`, `fr.json`.
- Key files: `src/langs/en.json`, `src/langs/fr.json`.

**`src/mocks`:**
- Purpose: provide standalone and Cypress mock data for Graasp context, members, items, settings, and app data.
- Contains: `src/mocks/db.ts`.
- Key files: `src/mocks/db.ts`.

**`src/modules`:**
- Purpose: house the feature-oriented app code, including shell, mode switching, contexts, and builder/player implementations.
- Contains: `src/modules/main`, `src/modules/context`, `src/modules/builderview`, `src/modules/playerview`, `src/modules/common`, `src/modules/config`, `src/modules/ErrorBoundary.tsx`, `src/modules/Root.tsx`.
- Key files: `src/modules/Root.tsx`, `src/modules/main/App.tsx`, `src/modules/context/SettingsContext.tsx`, `src/modules/context/ExperimentContext.tsx`.

**`src/modules/main`:**
- Purpose: provide the top-level mode dispatcher and the thin wrappers for builder, player, and analytics.
- Contains: `App.tsx`, `BuilderView.tsx`, `PlayerView.tsx`, `AnalyticsView.tsx`.
- Key files: `src/modules/main/App.tsx`, `src/modules/main/BuilderView.tsx`, `src/modules/main/PlayerView.tsx`, `src/modules/main/AnalyticsView.tsx`.

**`src/modules/context`:**
- Purpose: expose persisted application state through React contexts.
- Contains: `SettingsContext.tsx`, `ExperimentContext.tsx`.
- Key files: `src/modules/context/SettingsContext.tsx`, `src/modules/context/ExperimentContext.tsx`.

**`src/modules/builderview`:**
- Purpose: contain the survey authoring UI and result management UI.
- Contains: `AdminView.tsx`, `results/`, `settings/`.
- Key files: `src/modules/builderview/AdminView.tsx`, `src/modules/builderview/results/ResultsView.tsx`, `src/modules/builderview/settings/SettingView.tsx`.

**`src/modules/builderview/settings`:**
- Purpose: edit survey structure and app settings one section or question at a time.
- Contains: `SettingView.tsx`, `SectionSettingsView.tsx`, `FullScreenSettingsView.tsx`, `NextStepSettingsView.tsx`, `PageButtonSettingsView.tsx`, `ExclusionSettingsView.tsx`, and `questionviews/`.
- Key files: `src/modules/builderview/settings/SettingView.tsx`, `src/modules/builderview/settings/SectionSettingsView.tsx`.

**`src/modules/builderview/settings/questionviews`:**
- Purpose: edit each question subtype with a dedicated form component.
- Contains: `ShortAnswerSettingsView.tsx`, `LongAnswerSettingsView.tsx`, `MultipleChoiceSettingsView.tsx`, `MultiAnswerSettingsView.tsx`, `LikertScaleSettingsView.tsx`, `LikertBlockSettingsView.tsx`, `TableInputSettingsView.tsx`, `TextElementSettingsView.tsx`.
- Key files: `src/modules/builderview/settings/questionviews/*.tsx`.

**`src/modules/playerview`:**
- Purpose: run the survey experience and translate settings into a jsPsych timeline.
- Contains: `ExperimentLoader.tsx`, `jspsych/`, `styles/`.
- Key files: `src/modules/playerview/ExperimentLoader.tsx`, `src/modules/playerview/jspsych/experiment.ts`.

**`src/modules/common`:**
- Purpose: share small UI primitives across modes.
- Contains: `Loader.tsx`, `CustomToasts.tsx`.
- Key files: `src/modules/common/Loader.tsx`, `src/modules/common/CustomToasts.tsx`.

**`src/utils`:**
- Purpose: host reusable hooks and helpers.
- Contains: `hooks.ts`.
- Key files: `src/utils/hooks.ts`.

## Key File Locations

**Entry Points:**
- `src/main.tsx`: React root bootstrap and mock API initialization.
- `src/modules/Root.tsx`: provider composition and global shell.
- `src/modules/main/App.tsx`: context-based mode selection.

**Configuration:**
- `package.json`: scripts, dependencies, package manager, and NYC configuration.
- `vite.config.ts`: dev/build settings, alias `@ -> src`, checker plugin, and Istanbul instrumentation.
- `tsconfig.json`: strict TypeScript config and `@/*` path mapping.
- `src/config/env.ts`: Vite environment variable access.
- `src/config/queryClient.tsx`: Graasp query-client configuration.
- `src/config/i18n.ts`: i18n setup and language resources.

**Core Logic:**
- `src/modules/context/SettingsContext.tsx`: persisted settings state and save API.
- `src/modules/context/ExperimentContext.tsx`: persisted experiment results and member scoping.
- `src/modules/playerview/jspsych/experiment.ts`: survey timeline construction and completion logic.
- `src/modules/builderview/settings/SectionSettingsView.tsx`: section and question authoring.
- `src/modules/builderview/results/ResultsView.tsx`: admin results export and deletion.

**Testing:**
- `cypress/`: browser end-to-end tests and Cypress TypeScript config.
- `src/mocks/db.ts`: mock database used by standalone mode and Cypress.
- `package.json` scripts: `test`, `test:ci`, `cypress:open`, `start:test`, and `build:test`.

## Naming Conventions

**Files:**
- React views and providers use PascalCase filenames such as `Root.tsx`, `App.tsx`, `SettingsContext.tsx`, and `ExperimentLoader.tsx`.
- Utility and configuration files use lower camel or lower-case names such as `queryClient.tsx`, `env.ts`, and `hooks.ts`.
- Test and support files are grouped by feature area rather than by a separate global `components` or `services` directory.

**Directories:**
- Feature folders are lower-case and domain-oriented, for example `builderview`, `playerview`, `common`, and `config`.
- Nested editor folders separate shared settings from question-specific settings under `src/modules/builderview/settings/questionviews`.

## Where to Add New Code

**New Builder Screen:**
- Primary code: `src/modules/builderview/`
- Tests: `cypress/` for end-to-end coverage, plus local mock updates in `src/mocks/db.ts` if the screen depends on Graasp data.

**New Player Behavior:**
- Primary code: `src/modules/playerview/`
- Tests: `cypress/` and mock updates in `src/mocks/db.ts` when the behavior depends on settings or app data.

**New Survey Question Editor:**
- Implementation: `src/modules/builderview/settings/questionviews/`
- Wiring: `src/modules/builderview/settings/SectionSettingsView.tsx`
- Shared settings shape: `src/modules/config/AppSettings.ts`

**New Shared Context or Persisted State:**
- Implementation: `src/modules/context/`
- Supporting query wiring: `src/config/queryClient.tsx`
- Supporting data shape: `src/modules/config/AppSettings.ts` or `src/modules/config/AppResults.ts` depending on whether the state is settings or app data.

**New Configuration or Environment Hookup:**
- Implementation: `src/config/`
- Vite exposure or alias changes: `vite.config.ts` and `tsconfig.json`.

**New Shared UI Primitive:**
- Implementation: `src/modules/common/`
- Use it from `src/modules/Root.tsx` or the relevant feature area.

## Special Directories

**`.planning/codebase`:**
- Purpose: generated codebase maps used by GSD planning workflows.
- Generated: Yes
- Committed: Yes, as part of the repository planning artifacts.

**`public`:**
- Purpose: static assets and the MSW worker directory referenced by `package.json`.
- Generated: No
- Committed: Yes

**`build`:**
- Purpose: Vite output directory configured in `vite.config.ts`.
- Generated: Yes
- Committed: No

---

*Structure analysis: 2026-04-02*
