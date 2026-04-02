# Quick Task 260402-ffe: Translate small player elements to French - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Task Boundary

Translate selected system UI strings from English to French while preserving user-authored content.

Scope:

- Add a builder-side setting to choose experiment/player language (`en` or `fr`).
- Remove editable settings UI for previous/continue/submit button labels.
- Use i18n defaults for system navigation/start text.
- Make player-view language follow builder setting only.

Out of scope:

- Translating survey content entered by admins.
- Translating exclusion criteria text entered by admins.
- Participant-side language switching.

</domain>

<decisions>
## Implementation Decisions

### Language Source of Truth

- Use a single builder-managed setting on `fullScreenSettings.language` with values `en | fr`.
- Player runtime sets i18n language from that setting before timeline creation.

### Player UI Localization

- Localize system-owned player strings only:
  - start screen title/button
  - survey navigation buttons (continue/previous/submit)
  - generic completion thank-you
- Do not localize admin-authored exclusion/survey strings.

### Removed UI

- Remove button-text settings controls from builder section settings UI.
- Keep defaults from i18n translations.

### the agent's Discretion

- Keep `sectionSettings.pageButtonSettings` in data model for backward compatibility, but stop using it for player button text.

</decisions>

<specifics>
## Specific Ideas

- Add `SETTINGS.PLAYER.*` i18n keys in `en.json` and `fr.json`.
- Add `SETTINGS.FULL_SCREEN.LANGUAGE_*` labels for builder selector.

</specifics>

<canonical_refs>

## Canonical References

- User request in current session is the canonical requirement source.

</canonical_refs>
