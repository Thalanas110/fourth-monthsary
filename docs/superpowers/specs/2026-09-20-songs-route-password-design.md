# Songs Route Password Gate Design

## Goal

Move the song experience from the home page to a dedicated `/songs/` route and require both the seven-click lantern easter egg and a monthsary-date password before the route reveals the songs.

## User experience

- The home page keeps the header and hero lanterns, but no longer renders the song library inline.
- The seventh lantern click arms song access and navigates to `/songs/`.
- `/songs/` checks the persisted lantern-unlock flag. If it is absent, the visitor is sent back to the home route.
- If the lantern flag exists but password access has not been granted, the route shows a focused password form asking: `When is our monthsary?`
- The password is read from `import.meta.env.VITE_MONTHSARY_PASSWORD`. The configured `09-19-2026` value must also accept `09-19-26`; the comparison is exact after trimming, with no case folding.
- A wrong answer stays on the gate and shows an inline error without navigating or revealing audio.
- A correct answer persists a separate song-access flag and reveals the existing song library on `/songs/`.
- Direct visits to `/songs/` reuse the same behavior: armed users see the password gate or songs, unarmed users return home.

## Architecture

### Route matching

Add `getSongsPath`, `isSongsPath`, and `isSongsUnlocked`-compatible route helpers in `src/lib/routes.ts`. Extend `PageRouter` to render a dedicated `SongsPage` for the normalized route under both `/songs/` and a configured Vite base path.

### Navigation

Add a path-navigation helper beside `navigateToAnchor` that performs a normal browser navigation when the destination pathname changes. The seventh lantern click uses this helper to navigate to the songs route after persisting the unlock flag. Existing anchor behavior remains unchanged.

### Access state

Extend the song access boundary with a stable storage key for password approval, separate from the lantern-unlock key. The route page owns `checking`, `password`, and `granted` states. Storage and navigation effects are browser-guarded so static rendering remains safe.

### Password gate

Create a focused `SongPasswordGate` component with a controlled password input, native form submission, accessible label, inline error, and no password value in rendered markup. A small validation utility derives the accepted full and short date forms from `VITE_MONTHSARY_PASSWORD` rather than hardcoding the secret in source.

## Security boundary

This is an easter-egg gate in a client-side static app, not a security boundary. The environment variable avoids putting the configured value in source, but any client-delivered value can be inspected by a determined visitor.

## Styling

Reuse the current dark plum, warm amber, serif display, mono utility, border, and restrained-glow system. The route should feel like a continuation of the lantern experience: centered gate panel before approval, then the existing song cards after approval. Do not change poem route or library behavior.

## Accessibility and failure handling

- The password form uses a real `<label>`, `type="password"`, `autocomplete="off"`, and `aria-describedby` for errors.
- Error text uses an assertive or polite live region without exposing the configured password.
- Missing or empty `VITE_MONTHSARY_PASSWORD` fails closed: the gate remains locked and reports that the answer is unavailable.
- Local-storage failures are non-fatal; the page remains usable for the current session where possible.
- Unavailable audio continues to use the song library’s existing explicit empty-state behavior.

## Verification

- Test route helper matching and base-path behavior.
- Test password validation for the configured full date, short date, wrong input, and missing configuration.
- Test the gate’s accessible form and error behavior.
- Test the page router’s `/songs/` rendering and the unarmed redirect contract.
- Test that the home app does not render `song-library` and that the seventh click navigates to the songs route.
- Run `npm test`, `npm run typecheck`, and `npm run build`.
