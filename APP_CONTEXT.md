# Survey Pages App - Context & Architecture

## Overview

A survey builder/player application for the LNCo.ai platform (fork of Graasp). Runs as an iFrame on the lnco.ai website with three main views: Builder, Player, and Analytics.

**Purpose**: Simple app to run surveys with participants.

---

## Three Main Views

### 1. **Builder View** (Experiment Configuration)

**Location**: `src/modules/main/BuilderView.tsx` → `src/modules/builderview/AdminView.tsx`

Two tabs accessible to experimenters:

- **Results Tab**: Display collected survey data
- **Settings Tab**: Create and edit survey configuration

**Settings Configuration includes:**

- **Sections**: Groups of questions/elements organized by page
- **Questions**: 6 question types available
  - ShortAnswer (text, number, or date input)
  - LongAnswer (multi-line text)
  - MultipleChoice (single select with optional "other")
  - MultiAnswer (multiple select)
  - LikertScale (single row, scale options)
  - LikertBlock (multiple questions with same scale)
- **Text Elements**: Static text/instructions (no response)
- **Page Button Settings**: Labels for navigation (Next, Previous, Submit)
- **Display Options**:
  - Fullscreen mode toggle
  - One-question-per-page layout toggle
- **Post-Survey**: Optional link to display after completion

**State Management**:

- `SettingsContext` manages app settings persistence
- Settings are saved to Graasp backend via `mutations`
- Uses React Query (`@tanstack/react-query`) for API calls

---

### 2. **Player View** (Participant Experience)

**Location**: `src/modules/main/PlayerView.tsx` → `src/modules/playerview/ExperimentLoader.tsx`

**Key Implementation Detail**: Uses **JsPsych v8** - the entire flow is calculated once on startup, not rendered dynamically.

**Flow**:

1. Loads `AppSettings` from context/backend
2. Builds complete JsPsych timeline upfront via `buildTimelineFromSurvey()`
3. Initializes JsPsych and runs timeline
4. Collects responses from participants
5. Saves responses to backend via `setExperimentResult()`
6. Prevents re-completion - shows message if already completed

**Recovery Features**:

- Retrieves previous responses if survey partially completed
- Pre-fills form fields with last answers
- Checks if all mandatory questions answered before allowing submission

**Key Files**:

- `src/modules/playerview/jspsych/experiment.ts` - Timeline building logic
- `src/modules/playerview/ExperimentLoader.tsx` - JsPsych initialization & result handling

---

### 3. **Analytics View** (Data Analysis)

**Location**: `src/modules/main/AnalyticsView.tsx`

_Note: Can be ignored for current development_

---

## Key Data Structures

### AppSettings (`src/modules/config/AppSettings.ts`)

```typescript
type AppSettings = {
  sectionSettings: SectionSettings;
  fullScreenSettings: FullScreenSettings;
  nextStepSettings: NextStepSettings;
};

type SectionSettings = {
  sections: Section[]; // Array of survey pages
  pageButtonSettings: PageButtonSettings;
};

type Section = SurveyElement[]; // Array of questions/text elements

// Question Types
enum QuestionTypes {
  ShortAnswer,
  LongAnswer,
  MultipleChoice,
  MultiAnswer,
  LikertScale,
  LikertBlock,
}

// Non-question elements
enum OtherElementType {
  Text, // Static text element
}
```

### ExperimentResult (`src/modules/config/AppResults.ts`)

```typescript
type ExperimentResult = {
  settings?: AppSettings;
  rawData?: { trials: TrialData[] };
};

type TrialData = Record<string, any>; // JsPsych response data
```

---

## Context Management

### SettingsContext

**Location**: `src/modules/context/SettingsContext.tsx`

- Stores survey configuration (`sectionSettings`, `fullScreenSettings`, `nextStepSettings`)
- Default values defined at context creation
- `saveSettings()` persists changes to backend
- Wrapped around all views in Root component

### ExperimentContext (Results)

**Location**: `src/modules/context/ExperimentContext.tsx`

- Stores participant responses (`experimentResultsAppData`)
- Tracks loading status
- `setExperimentResult()` updates stored results

---

## Technology Stack

| Purpose              | Technology                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------- |
| UI Framework         | React 18.3.1                                                                                |
| State & API          | @tanstack/react-query 4.36.1                                                                |
| Backend Integration  | @graasp/apps-query-client 3.4.15                                                            |
| Components           | @mui/material 5.16.7                                                                        |
| Survey Engine        | jspsych 8.0.2                                                                               |
| JsPsych Plugins      | @jspsych/plugin-survey, -likert, -multi-choice, -text, -fullscreen, -html-keyboard-response |
| Styling              | @emotion/styled + SCSS                                                                      |
| Type Checking        | TypeScript 5.6.2                                                                            |
| Build Tool           | Vite                                                                                        |
| Testing              | Cypress                                                                                     |
| Internationalization | i18next 23.9.0                                                                              |
| Error Tracking       | @sentry/react 7.119.0                                                                       |

---

## Entry Points

- `src/main.tsx` - Application bootstrap
  - Mocks Graasp API if `MOCK_API=true`
  - Initializes Sentry error tracking
  - Renders Root component
- `src/modules/Root.tsx` - Root wrapper
  - Configures QueryClientProvider
  - Sets up SettingsProvider & ExperimentResultsProvider context
- `src/modules/main/App.tsx` - Main router
  - Switches between Builder/Analytics/Player based on context
  - Handles language changes

---

## Important Concepts

### JsPsych Integration

- Timeline is **static**, calculated once on player load
- Uses plugins: survey (text inputs), survey-likert, survey-multi-choice, etc.
- Data flows: JsPsych → `updateData()` callback → `setExperimentResult()` → stored in context

### Settings Persistence

- Settings stored in Graasp backend via `mutations.patchAppSetting()`
- Settings provider automatically fetches on mount via React Query
- Changes applied immediately to UI after successful save

### Mock API

- Standalone development/testing mode when `MOCK_API=true`
- Uses MSW (Mock Service Worker)
- Database: `src/mocks/db.ts`
- Cypress integration: stores data in IndexedDB

---

## Builder Settings Components

**Location**: `src/modules/builderview/settings/`

- `SettingView.tsx` - Main settings page with save logic
- `FullScreenSettingsView.tsx` - Toggle fullscreen & page-per-question
- `PageButtonSettingsView.tsx` - Configure button labels
- `SectionSettingsView.tsx` - Manage survey sections/pages
- `NextStepSettingsView.tsx` - Post-survey link configuration
- `questionviews/` - Individual question type editors

---

## File Organization

```
src/
├── config/                 # App configuration
│   ├── appData.ts
│   ├── env.ts             # Environment variables
│   ├── i18n.ts            # Translations
│   ├── queryClient.tsx    # React Query setup
│   └── selectors.ts       # Test selectors
├── modules/
│   ├── main/              # Router & main views
│   │   ├── App.tsx
│   │   ├── BuilderView.tsx
│   │   ├── PlayerView.tsx
│   │   └── AnalyticsView.tsx
│   ├── builderview/       # Builder-specific components
│   │   ├── AdminView.tsx
│   │   ├── results/
│   │   └── settings/
│   ├── playerview/        # Player-specific components
│   │   ├── ExperimentLoader.tsx
│   │   └── jspsych/
│   │       └── experiment.ts (Timeline building)
│   ├── context/           # React Context
│   │   ├── SettingsContext.tsx
│   │   └── ExperimentContext.tsx
│   ├── config/            # Type definitions
│   │   ├── AppSettings.ts
│   │   └── AppResults.ts
│   └── common/            # Shared components
│       ├── CustomToasts.tsx
│       └── Loader.tsx
└── index.css, main.tsx
```

---

## Development Commands

```bash
npm run dev              # Start dev server
npm run build           # Build for production
npm run build:test      # Build for testing
npm run start:test      # Run in test mode (with mock API)
```

---

## Notes for Future Context Recovery

- **JsPsych is key**: All survey rendering on player side happens via JsPsych timeline
- **Builder is React state-based**: Settings edited in React, saved to Graasp
- **Graasp integration**: Uses `@graasp/apps-query-client` for CRUD operations
- **Three contexts are critical**: SettingsContext (config), ExperimentContext (results), Graasp context (from SDK)
- **Mock mode useful**: `MOCK_API=true` allows standalone dev without backend
