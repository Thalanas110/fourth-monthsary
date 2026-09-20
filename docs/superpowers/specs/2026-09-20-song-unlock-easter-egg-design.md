# Song Unlock Easter Egg Design

## Goal

Add a hidden, Android-Developer-Options-style interaction that unlocks the monthsary song library. The interaction should be discoverable through the existing lantern motif while remaining playful and unobtrusive.

## User experience

- The existing header lantern and a new hero lantern are both accessible buttons.
- Each click on either lantern contributes to one shared unlock sequence.
- Seven clicks within a short two-second window unlock the songs. A missed timing window resets the in-progress count so the interaction still feels intentional rather than accidental.
- Unlock state is persisted in `localStorage`, so the songs remain available after reloads in the same browser.
- Before unlock, the song library is not rendered as an available section. After unlock, the song library appears below the poem library and a status message confirms the reveal.
- The lantern button exposes an accessible label and a changing status hint so keyboard and assistive-technology users can operate the easter egg without relying on visual-only cues.

## Architecture

### Shared unlock state

Create a focused `use-song-unlock` hook under `src/hooks/`.

- Owns the seven-click counter, timeout reset, persisted unlocked flag, and one-shot transition from locked to unlocked.
- Exposes `isUnlocked`, `clickLantern`, and a status message suitable for the existing toast system.
- Guards browser storage access so server/static rendering remains safe.

### Lantern controls

- Update `SiteHeader` to accept the unlock callback/state needed by its existing lantern mark.
- Add a `HeroLantern` component under `src/components/main/` for the larger hero control, or keep the markup in `HeroSection` if no separate responsibility boundary is needed.
- Both controls call the same callback supplied by `App`.
- Reuse the existing lantern CSS vocabulary and add a visible focus state; do not use a decorative-only span as the interactive target.

### Song library

- Add the actual song collection to `src/data/songs.ts` using the existing `Song` type, correcting the current `excrept` typo only if needed at the data boundary.
- Add a focused `SongLibrary` component under `src/components/songs/` that renders unlocked songs and provides native audio controls using each song's source URL.
- Keep the section absent while locked and render it in the main page flow after unlock.
- If no playable source is currently present in the repository, the data model and UI must make that state explicit instead of fabricating a working audio URL.

## Data flow

`App` owns the shared hook and passes the click callback to `SiteHeader`, `HeroSection`, and the conditional `SongLibrary`. The hook reads the persisted flag once on mount, updates it after the seventh click, and calls the existing toast mechanism with the unlock confirmation.

## Styling direction

Keep the existing dark romantic lantern aesthetic: deep plum background, warm amber primary, serif display type, mono utility labels, thin borders, and restrained glow. The hero lantern is the visual differentiator: a larger, clickable lantern that is present in the hero composition without competing with the monthsary title.

## Accessibility and failure handling

- Use `<button type="button">` for both lantern controls.
- Provide `aria-label`, `aria-pressed` or an equivalent unlocked state, and a live status for progress/unlock feedback.
- Do not depend on hover, pointer events, or `window` during initial render.
- Treat unavailable storage/audio sources as non-fatal; the rest of the page must continue to render.

## Verification

- Add hook tests for initial locked state, timeout reset, seven-click unlock, and persistence.
- Add component tests that verify both lantern controls are accessible buttons and the hero lantern is rendered.
- Add app-level coverage for the song library appearing only after unlock.
- Run the full local CI-equivalent checks: `npm test`, `npm run typecheck`, and `npm run build`.
