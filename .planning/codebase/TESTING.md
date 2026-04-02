# Testing Patterns

**Analysis Date:** 2026-04-02

## Test Framework

**Runner:**

- Cypress 13.15.0, configured in `cypress.config.ts`.
- `cypress/e2e` holds the current automated test suite.

**Assertion Library:**

- Cypress built-in assertions via `cy.get(...).should(...)`.

**Run Commands:**

```bash
yarn test              # Starts the app server and runs Cypress CI
yarn test:ci           # Runs Cypress headless plus NYC report generation
yarn cypress:open      # Opens Cypress against .env.test via env-cmd
```

## Test File Organization

**Location:**

- E2E specs live under `cypress/e2e/<area>/main.cy.ts`.
- Current suites exist for `analytics`, `builder`, and `player`.
- Shared Cypress support lives under `cypress/support/`.
- Fixtures live under `cypress/fixtures/`.

**Naming:**

- Cypress spec files use the `*.cy.ts` suffix.
- Test folders mirror the product area under test, such as `cypress/e2e/player` and `cypress/e2e/builder`.

**Structure:**

```text
cypress/
  e2e/
    analytics/main.cy.ts
    builder/main.cy.ts
    player/main.cy.ts
  fixtures/
    members.ts
    mockItem.ts
  support/
    commands.ts
    component.ts
    e2e.ts
```

## Test Structure

**Suite Organization:**

```typescript
describe('Player View', () => {
  beforeEach(() => {
    cy.setUpApi(
      {},
      {
        context: Context.Player,
        permission: PermissionLevel.Write,
      },
    );
    cy.visit('/');
  });

  it('App', () => {
    cy.get(buildDataCy(PLAYER_VIEW_CY)).should(
      'contain.text',
      'Player as write',
    );
  });
});
```

**Patterns:**

- Each suite prepares state in `beforeEach`, usually by calling `cy.setUpApi(...)` and then `cy.visit('/')`.
- Suites focus on one app mode at a time by setting `Context.Builder`, `Context.Analytics`, or `Context.Player`.
- Assertions usually check for visible text and `data-cy` targets rather than brittle selectors.

## Mocking

**Framework:**

- Cypress custom command setup in `cypress/support/commands.ts`.
- App-level mocking also uses `@graasp/apps-query-client` and MirageJS or Service Worker mocking in `src/main.tsx`.

**Patterns:**

```typescript
Cypress.Commands.add('setUpApi', (database, appContext) => {
  Cypress.on('window:before:load', (win: Window) => {
    win.indexedDB.deleteDatabase('graasp-app-cypress');
    win.appContext = {
      memberId: CURRENT_MEMBER.id,
      itemId: MOCK_SERVER_ITEM.id,
      apiHost: Cypress.env('VITE_API_HOST'),
      ...appContext,
    };
    win.database = {
      appData: [],
      appActions: [],
      appSettings: [],
      members: Object.values(MEMBERS),
      items: [MOCK_SERVER_ITEM],
      ...database,
    };
  });
});
```

**What to Mock:**

- Mock the local app context, member, item, and database when testing app shells and mode-specific rendering.
- Use fixture objects from `cypress/fixtures/` for stable data.

**What NOT to Mock:**

- Do not bypass the actual app bootstrap when the goal is to validate mode detection or selector rendering.
- Do not invent ad hoc globals; reuse the Cypress command and fixture setup.

## Fixtures and Factories

**Test Data:**

```typescript
export const MOCK_SERVER_ITEM = {
  id: '123456789',
  name: 'app-starter-ts-vite',
  description: null,
  path: '',
  settings: {},
  creator: MEMBERS[0],
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

**Location:**

- Shared fixtures live in `cypress/fixtures/members.ts` and `cypress/fixtures/mockItem.ts`.
- The app itself also has reusable mock data in `src/mocks/db.ts`.

## Coverage

**Requirements:**

- No coverage threshold is enforced in the inspected config.
- Coverage collection is enabled through `@cypress/code-coverage` and NYC.

**View Coverage:**

```bash
yarn cov:report
```

## Test Types

**Unit Tests:**

- No Jest, Vitest, or other unit-test runner config was detected in the inspected workspace.

**Integration Tests:**

- Cypress E2E specs act as the primary automated test layer for current behavior.
- The app bootstrap supports mocked API behavior for Cypress in `src/main.tsx`.

**E2E Tests:**

- Cypress is the active end-to-end framework.
- `cypress.config.ts` wires `baseUrl`, retries, and code coverage.
- `cypress/support/e2e.ts` loads code coverage support and ignores `ResizeObserver` uncaught exceptions.
- `cypress/support/component.ts` and `cypress/support/component-index.html` are present for component testing support, but no component spec files were detected in the current search.

## Common Patterns

**Async Testing:**

```typescript
beforeEach(() => {
  cy.setUpApi(
    {},
    { context: Context.Player, permission: PermissionLevel.Write },
  );
  cy.visit('/');
});
```

- Cypress command chains are used directly; no async/await test style was detected.

**Error Testing:**

```typescript
Cypress.on('uncaught:exception', (err) => {
  if (/ResizeObserver/.test(err.message)) {
    return false;
  }
});
```

- Global Cypress exception handling is limited to known `ResizeObserver` noise.
- Application error handling is usually exercised indirectly through UI rendering and mocked API responses.

---

_Testing analysis: 2026-04-02_
