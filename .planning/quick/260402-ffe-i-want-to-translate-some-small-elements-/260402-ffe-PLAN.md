# Quick Task 260402-ffe - Plan

## Goal

Implement builder-driven French/English player localization for system UI text while preserving admin-authored survey and exclusion content.

## Steps

1. Update settings schema

- Add `language: 'en' | 'fr'` to `fullScreenSettings`.
- Ensure defaults initialize to `en`.

2. Update builder settings UI

- Add language selector in `FullScreenSettingsView`.
- Remove `PageButtonSettingsView` from `SectionSettingsView` so previous/continue/submit are no longer editable.

3. Update player runtime behavior

- Set i18n language from settings before building/running timeline.
- Replace hardcoded/system button labels with i18n defaults.
- Keep exclusion/survey user-authored fields unchanged.

4. Add translation keys

- Add English/French `SETTINGS.PLAYER` keys.
- Add full-screen language selector labels.

5. Validate

- Run formatter.
- Run build and verify no regressions.

## Verification Criteria

- Builder has a language selector (`en`/`fr`).
- Page button text settings are not shown in settings UI.
- Player start/continue/previous/submit/thank-you text switches with selected language.
- Admin-entered exclusion and survey text remains as entered.
