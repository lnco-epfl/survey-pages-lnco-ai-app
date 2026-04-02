# Codebase Concerns

**Analysis Date:** 2026-04-02

## Tech Debt

**Section editor complexity:**

- Issue: `src/modules/builderview/settings/SectionSettingsView.tsx` is 637 lines and combines element creation, element rendering, page reordering, deletion, and move-between-section logic in one component.
- Files: `src/modules/builderview/settings/SectionSettingsView.tsx`
- Impact: adding or changing a survey element requires edits in several switch branches and helper paths, which increases the chance of inconsistent behavior.
- Fix approach: split creation, ordering, and rendering into smaller focused helpers or hooks, and centralize the per-element factory logic.

**Survey timeline assembly:**

- Issue: `src/modules/playerview/jspsych/experiment.ts` is 406 lines and mixes response replay, exclusion checks, final confirmation page generation, and timeline construction.
- Files: `src/modules/playerview/jspsych/experiment.ts`, `src/modules/config/AppSettings.ts`, `src/modules/config/AppResults.ts`
- Impact: schema changes or jsPsych plugin changes can affect unrelated branches because the file owns several responsibilities at once.
- Fix approach: extract criteria evaluation, confirmation-page generation, and timeline building into separate modules.

**Context state mutation patterns:**

- Issue: `src/modules/context/ExperimentContext.tsx` and `src/modules/context/SettingsContext.tsx` rely on mutable refs and conditional writes after async query state loads.
- Files: `src/modules/context/ExperimentContext.tsx`, `src/modules/context/SettingsContext.tsx`
- Impact: behavior depends on the order and timing of fetch success, ref updates, and memoized callbacks, which makes state transitions harder to reason about.
- Fix approach: narrow the mutable surface area and make post/patch decisions from explicit derived state instead of ref-driven control flow.

## Known Bugs

**Not detected from the current scan:**

- The repository scan did not surface a reproducible bug with enough evidence to document here.

## Security Considerations

**No direct issue identified in the current scan:**

- The checked files did not expose secret material or an obvious auth bypass path.

## Performance Bottlenecks

**Runtime checks in the dev/build path:**

- Problem: `vite.config.ts` enables `vite-plugin-checker` in non-test modes and `vite-plugin-istanbul` instrumentation in test mode.
- Files: `vite.config.ts`
- Cause: both TypeScript/ESLint validation and coverage instrumentation add work to startup and build steps.
- Improvement path: keep the checks, but be aware they make the Vite pipeline heavier than a plain build.

**Browser-only test feedback loop:**

- Problem: the repo test workflow runs Cypress end-to-end tests rather than fast unit tests.
- Files: `package.json`, `.github/workflows/cypress.yml`, `cypress/e2e/builder/main.cy.ts`, `cypress/e2e/player/main.cy.ts`, `cypress/e2e/analytics/main.cy.ts`
- Cause: UI verification is concentrated in browser runs, so failures are discovered later than with local unit coverage.
- Improvement path: add small focused tests for survey-building and data-shaping logic outside the browser.

## Fragile Areas

**Test bootstrap depends on globals:**

- Files: `src/modules/Root.tsx`, `cypress/support/commands.ts`, `cypress.config.ts`
- Why fragile: the app switches to `window.Cypress` and `window.appContext` during test runs, while Cypress mutates `window` and IndexedDB before load.
- Safe modification: keep that contract stable if the test harness stays browser-driven, and isolate bootstrapping changes carefully.
- Test coverage gap: only three Cypress specs were detected, each acting as a smoke-level check.

**Result export and download flow:**

- Files: `src/modules/builderview/results/ResultsView.tsx`, `src/modules/builderview/results/ResultsRow.tsx`
- Why fragile: export paths build JSON strings and filenames from runtime data and browser APIs in one component path.
- Safe modification: keep download construction and row actions separated so data formatting changes do not affect table rendering.
- Test coverage gap: no dedicated test file for the export/delete flow was detected.

**Cypress support code:**

- Files: `cypress/support/commands.ts`, `cypress/e2e/*`
- Why fragile: the support layer is small but highly coupled to the exact app context shape and seeded mock database.
- Safe modification: update fixtures and context scaffolding together with any local context schema changes.
- Test coverage gap: the current suite covers the three top-level views only.

## Test Coverage Gaps

**No conventional unit test suite detected:**

- What's not tested: survey element transformation, exclusion matching, settings mutation, and result export logic outside Cypress.
- Files: `src/modules/playerview/jspsych/experiment.ts`, `src/modules/builderview/settings/SectionSettingsView.tsx`, `src/modules/context/ExperimentContext.tsx`, `src/modules/context/SettingsContext.tsx`
- Risk: logic regressions in these modules are only caught when the browser suite exercises the full app.
- Priority: High

**Very small browser test surface:**

- What's not tested: the repo currently has three Cypress specs and each is a smoke check for a single context/view combination.
- Files: `cypress/e2e/builder/main.cy.ts`, `cypress/e2e/player/main.cy.ts`, `cypress/e2e/analytics/main.cy.ts`
- Risk: changes to branching logic inside the builder/player flows can ship without any narrow assertions.
- Priority: High

## Dependencies at Risk

**Browser-test and coverage tooling are tightly coupled:**

- Risk: `cypress`, `@cypress/code-coverage`, `nyc`, and `vite-plugin-istanbul` are all wired into the test path.
- Files: `package.json`, `cypress.config.ts`, `.github/workflows/cypress.yml`, `vite.config.ts`
- Impact: changes to any one of those tools can break the CI coverage flow even when the app itself still builds.
- Migration plan: keep the coverage contract explicit if the test stack changes.

---

_Concerns audit: 2026-04-02_
