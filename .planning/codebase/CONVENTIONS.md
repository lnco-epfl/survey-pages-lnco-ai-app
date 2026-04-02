# Coding Conventions

**Analysis Date:** 2026-04-02

## Naming Patterns

**Files:**
- React screens and feature views use PascalCase filenames in `src/modules/**`, such as `src/modules/main/App.tsx`, `src/modules/main/PlayerView.tsx`, and `src/modules/builderview/settings/SettingsView.tsx`.
- Shared config and helper modules use lower camel or lower snake style in `src/config/**`, such as `src/config/env.ts`, `src/config/queryClient.tsx`, and `src/config/selectors.ts`.
- Type declaration files use `.d.ts` and live in `src/`, `src/@types/`, and `src/window.d.ts`.

**Functions:**
- React function components are written as arrow functions and exported as constants, for example `const App = (): JSX.Element => (...)` in `src/modules/main/App.tsx`.
- Utility and hook functions also use arrow syntax, such as `useObjectState` in `src/utils/hooks.ts` and `buildDataCy` in `src/config/selectors.ts`.
- Explicit return types are expected on functions; the ESLint config enables `@typescript-eslint/explicit-function-return-type` in `eslint.config.mjs`.

**Variables:**
- Constants use `const` throughout, including config exports in `src/config/env.ts` and selector constants in `src/config/selectors.ts`.
- Hook state setters and context setters use descriptive names like `setMockContext`, `setSections`, and `saveSettings`.
- Temporary ignored parameters use a leading underscore when needed; `@typescript-eslint/no-unused-vars` ignores that prefix in `eslint.config.mjs`.

**Types:**
- TypeScript types are defined with `type` aliases and `enum`s in `src/modules/config/AppSettings.ts` and `src/modules/config/AppResults.ts`.
- Shared API shapes are modeled in dedicated modules rather than inline object literals, for example `AppSettings`, `SectionSettings`, `QuestionTypes`, and `ExperimentResult`.
- Global ambient extensions live in declaration files such as `src/window.d.ts` and `src/env.d.ts`.

## Code Style

**Formatting:**
- Prettier is the formatting source of truth, configured in `.prettierrc`.
- The repo uses 2-space indentation, semicolons, single quotes, and trailing commas.
- Import ordering is enforced by `@trivago/prettier-plugin-sort-imports` with the order defined in `.prettierrc`.

**Linting:**
- ESLint is configured in `eslint.config.mjs` using flat config plus `airbnb`, `airbnb-typescript`, `plugin:react/recommended`, `plugin:react-hooks/recommended`, `plugin:@typescript-eslint/recommended`, and `plugin:cypress/recommended`.
- `prettier/prettier` is enforced as an ESLint error, so formatting violations fail lint.
- `no-console` is restricted to `error`, `warn`, `debug`, and `info`; other console usage is disallowed.
- `react/function-component-definition` requires arrow-function components, and `react-hooks/rules-of-hooks` is enforced.
- `react/jsx-props-no-spreading`, `react/no-array-index-key`, `react/destructuring-assignment`, and several PropTypes-related rules are disabled in `eslint.config.mjs`.

## Import Organization

**Order:**
1. React imports first.
2. MUI imports next.
3. Graasp imports after MUI.
4. Third-party packages after Graasp.
5. `@/` alias imports next.
6. Relative imports last.

**Path Aliases:**
- `@/*` resolves to `src/*` through `tsconfig.json` and is used widely in application code, such as `@/config/queryClient` and `@/config/selectors`.
- Cypress and test files still use relative imports when reaching into `src`, for example `../../../src/config/selectors` in `cypress/e2e/*/*.cy.ts`.

## Error Handling

**Patterns:**
- Errors are usually handled with explicit `console.error` calls inside callback props, such as the `WithLocalContext` and `WithTokenContext` error handlers in `src/modules/Root.tsx`.
- Network and notification concerns are centralized in `src/config/queryClient.tsx`, where Axios errors are converted into toast notifications.
- React error isolation is handled with `src/modules/ErrorBoundary.tsx` wrapped around the app shell in `src/modules/Root.tsx`.

## Logging

**Framework:** `console`

**Patterns:**
- The app uses `console.error` for operational failures and avoids broader logging abstractions.
- Notification-style visibility is handled by `react-toastify` in `src/config/queryClient.tsx` and `src/modules/Root.tsx` rather than by custom logging utilities.

## Comments

**When to Comment:**
- Comments are sparse and used mostly for policy exceptions, setup explanations, or one-line clarifications around non-obvious behavior.
- Existing code uses comments to explain Cypress exception handling, Sentry initialization, mock API setup, and deliberate ESLint exceptions.

**JSDoc/TSDoc:**
- JSDoc-style comments are uncommon in source modules.
- The main repeated documentation mechanism is explicit TypeScript typing rather than prose comments.

## Function Design

**Size:**
- Components and hooks stay small and composable, with larger screens split into subcomponents such as `src/modules/builderview/settings/*View.tsx`.
- Complex state and data transformations are localized inside the component that owns them, as in `src/modules/builderview/settings/SettingView.tsx`.

**Parameters:**
- Function parameters are strongly typed and usually passed as single object props for components.
- Handler props use descriptive names like `onChange`, `onError`, and `saveSettings`.

**Return Values:**
- React components return JSX directly or through short helper render functions.
- Utility functions return simple values and avoid mutation-heavy APIs when a derived value is sufficient.

## Module Design

**Exports:**
- Default exports are common for React components, while config and helper modules use named exports.
- Type modules export multiple related types from one file, as seen in `src/modules/config/AppSettings.ts`.

**Barrel Files:**
- No central barrel-file pattern was detected in the inspected source.
- Imports typically point directly to the target module.

---

*Convention analysis: 2026-04-02*