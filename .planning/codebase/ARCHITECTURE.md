# Architecture

**Analysis Date:** 2026-04-02

## Pattern Overview

**Overall:** Single-page React app with a context-driven shell and three top-level modes: builder, player, and analytics.

**Key Characteristics:**

- `src/main.tsx` mounts `src/modules/Root.tsx`, which owns global providers, theming, error handling, and API bootstrap.
- `src/modules/main/App.tsx` routes runtime behavior from the Graasp local context into `src/modules/main/BuilderView.tsx`, `src/modules/main/PlayerView.tsx`, or `src/modules/main/AnalyticsView.tsx`.
- Shared configuration and persistence flow through Graasp query-client hooks in `src/config/queryClient.tsx`, then into domain-specific contexts in `src/modules/context/SettingsContext.tsx` and `src/modules/context/ExperimentContext.tsx`.

## Layers

**Bootstrap and Shell:**

- Purpose: initialize theming, i18n, toast notifications, Sentry, query client, local context, and token context.
- Location: `src/main.tsx`, `src/modules/Root.tsx`
- Contains: app mount, theme setup, environment gating for mocked APIs, error boundary, devtools.
- Depends on: `src/config/env.ts`, `src/config/i18n.ts`, `src/config/queryClient.tsx`, `src/mocks/db.ts`, `src/modules/common/Loader.tsx`.
- Used by: all runtime views.

**Mode Router:**

- Purpose: select the active experience from the Graasp local context and keep the app language in sync with the host context.
- Location: `src/modules/main/App.tsx`
- Contains: context-based switch for builder, player, and analytics.
- Depends on: `@graasp/apps-query-client`, `@graasp/sdk`, `src/config/i18n.ts`, `src/modules/context/SettingsContext.tsx`, `src/modules/context/ExperimentContext.tsx`.
- Used by: `src/modules/Root.tsx`.

**Builder Layer:**

- Purpose: edit survey settings and inspect stored results.
- Location: `src/modules/main/BuilderView.tsx`, `src/modules/builderview/**`
- Contains: admin shell, results table, settings editor, question-specific editors.
- Depends on: settings context, experiment-results context, translation resources, MUI components.
- Used by: builder context only.

**Player Layer:**

- Purpose: turn saved settings into a jsPsych survey timeline and persist participant progress.
- Location: `src/modules/main/PlayerView.tsx`, `src/modules/playerview/**`
- Contains: jsPsych loader, timeline builder, completion logic, player styles.
- Depends on: settings context, experiment-results context, `jspsych`, jsPsych plugins.
- Used by: player context only.

**Analytics Layer:**

- Purpose: expose app actions through the query client in the analytics context.
- Location: `src/modules/main/AnalyticsView.tsx`
- Contains: app-action refetch and post controls.
- Depends on: `src/config/queryClient.tsx`, Graasp local context.
- Used by: analytics context only.

**Shared Domain State:**

- Purpose: hold persisted app settings and experiment results independently from the visible view.
- Location: `src/modules/context/SettingsContext.tsx`, `src/modules/context/ExperimentContext.tsx`
- Contains: default values, load-and-save logic, current-member filtering, admin-only exposure of all experiment results.
- Depends on: `src/config/queryClient.tsx`, `src/modules/config/AppSettings.ts`, `src/modules/config/AppResults.ts`, `src/config/appData.ts`, `src/modules/common/Loader.tsx`.
- Used by: builder and player code.

## Data Flow

**Runtime Selection Flow:**

1. `src/main.tsx` renders `src/modules/Root.tsx`.
2. `src/modules/Root.tsx` provides theme, i18n, query client, local context, and token context.
3. `src/modules/main/App.tsx` reads the Graasp local context and selects builder, analytics, or player rendering.
4. The selected mode renders its own module tree while still sharing the same providers.

**Settings Flow:**

1. `src/modules/context/SettingsContext.tsx` loads app settings with `hooks.useAppSettings()`.
2. Missing settings fall back to local defaults defined in the provider.
3. `saveSettings()` posts a new setting when no existing record is found and patches the existing record otherwise.
4. `src/modules/builderview/settings/SettingView.tsx` copies the context values into local component state, edits them in the UI, and saves all settings back through the context.
5. `src/modules/playerview/ExperimentLoader.tsx` reads the saved settings and uses them to build the jsPsych run.

**Experiment Result Flow:**

1. `src/modules/context/ExperimentContext.tsx` loads app data of type `experiment-results` with `hooks.useAppData()`.
2. The provider filters experiment results to the current member and exposes the member-specific record to the player.
3. `src/modules/playerview/ExperimentLoader.tsx` initializes an empty record when no result exists and writes updated jsPsych data on progress changes and finish.
4. `setExperimentResult()` posts the first result for a member, then patches the existing app data record after that.
5. `src/modules/builderview/results/ResultsView.tsx` reads the full admin-visible list and can export or delete individual records.

**Survey Timeline Flow:**

1. `src/modules/playerview/jspsych/experiment.ts` receives `AppSettings` and optional previous `ExperimentResult` input.
2. It converts `sectionSettings.sections` into jsPsych survey pages, preserving previous responses as defaults where possible.
3. It appends a fullscreen trial when `fullScreenSettings.fullScreen` is enabled.
4. It appends a completion page that resolves to exclusion copy, next-step navigation, or a thank-you message.
5. `src/modules/playerview/ExperimentLoader.tsx` runs the generated timeline once per page session.

**State Management:**

- App settings are persisted as Graasp app settings and are normalized through `src/modules/context/SettingsContext.tsx` before consumption.
- Experiment responses are persisted as Graasp app data and are scoped to the current member in `src/modules/context/ExperimentContext.tsx`.
- Builder UI state is intentionally local inside `src/modules/builderview/settings/SettingView.tsx` until the user saves.
- Player state is split between `jsPsych` internal state and React state used to guard completion messaging.

## Key Abstractions

**Settings Context:**

- Purpose: expose persisted settings plus a uniform `saveSettings()` API.
- Examples: `src/modules/context/SettingsContext.tsx`, `src/modules/builderview/settings/SettingView.tsx`
- Pattern: load app settings once, fill in defaults, then post or patch on save.

**Experiment Results Context:**

- Purpose: expose the current member's experiment result and admin-only access to all results.
- Examples: `src/modules/context/ExperimentContext.tsx`, `src/modules/builderview/results/ResultsView.tsx`, `src/modules/playerview/ExperimentLoader.tsx`
- Pattern: filter the app data collection by type and member, then hide the full list unless the permission level is admin or above.

**Survey Settings Model:**

- Purpose: define the editable survey structure used by the builder and player.
- Examples: `src/modules/config/AppSettings.ts`, `src/modules/builderview/settings/SectionSettingsView.tsx`, `src/modules/playerview/jspsych/experiment.ts`
- Pattern: section-based survey composition with per-question editor components.

**JsPsych Timeline Builder:**

- Purpose: translate survey configuration into runnable jsPsych pages.
- Examples: `src/modules/playerview/jspsych/experiment.ts`
- Pattern: map each survey element type to a jsPsych element and append a completion step at the end.

## Entry Points

**Application Entry:**

- Location: `src/main.tsx`
- Triggers: Vite bootstraps the React root into the DOM.
- Responsibilities: initialize Sentry, mocked API state, and React rendering.

**Root Shell:**

- Location: `src/modules/Root.tsx`
- Triggers: rendered by the React root.
- Responsibilities: provide theme, i18n, query client, toast handling, local context, and token context.

**Mode Switch:**

- Location: `src/modules/main/App.tsx`
- Triggers: rendered after Graasp local context is available.
- Responsibilities: choose builder, analytics, or player behavior and update language from the host context.

**Survey Runner:**

- Location: `src/modules/playerview/ExperimentLoader.tsx`, `src/modules/playerview/jspsych/experiment.ts`
- Triggers: player context and successful app-data load.
- Responsibilities: build the survey, run jsPsych, and persist response updates.

## Error Handling

**Strategy:**

- App-level errors go through `src/modules/Root.tsx` and `src/modules/ErrorBoundary.tsx`.
- Query-client failures are surfaced through notifier-driven toasts in `src/config/queryClient.tsx`.
- Host context and token-loading failures use the `onError` callbacks in `src/modules/Root.tsx`.

**Patterns:**

- Loader components are shown while Graasp context or app-settings data are still loading.
- jsPsych completion logic and builder save logic guard against missing state before writing.
- The player timeline falls back to a thank-you page when exclusion and next-step branches are not enabled.

## Cross-Cutting Concerns

**Logging:** `console.error` is used for context/token loading failures in `src/modules/Root.tsx`; query-client notifications are surfaced as toasts in `src/config/queryClient.tsx`.

**Validation:** Builder-side form state is validated mainly through controlled inputs and disabled actions; player-side validation is handled by jsPsych question requirements and completion checks in `src/modules/playerview/ExperimentLoader.tsx`.

**Authentication:** `WithTokenContext` in `src/modules/Root.tsx` wraps the app shell, while permissions come from the Graasp local context in `src/modules/main/App.tsx` and `src/modules/context/ExperimentContext.tsx`.

**Configuration Propagation:** Environment values in `src/config/env.ts` feed query client setup, Sentry setup, and the mock API bootstrap; language resources in `src/config/i18n.ts` feed both the shell and the settings editor; survey settings flow from Graasp app settings into builder UI state and then into jsPsych timeline generation.

---

_Architecture analysis: 2026-04-02_
