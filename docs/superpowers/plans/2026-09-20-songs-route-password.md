# Songs Route Password Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move songs to `/songs/`, require the seven-click lantern unlock plus the configured monthsary password, and preserve access across direct route visits.

**Architecture:** The home app keeps only the lantern controls. The seventh click synchronously persists the lantern-unlocked flag and navigates to a dedicated `SongsPage`. `PageRouter` recognizes `/songs/` under the configured base path; `SongsPage` checks the unlock flag, gates with `SongPasswordGate`, persists a separate password-approved flag, and renders the existing `SongLibrary` only after approval. Password validation derives its accepted full and short forms from `import.meta.env.VITE_MONTHSARY_PASSWORD`.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, jsdom, Sass/CSS, existing browser navigation helpers.

## Global Constraints

- The home page must not render `song-library` or song cards.
- The seventh lantern click must persist access before navigating to `/songs/`.
- `/songs/` must redirect home when the lantern unlock flag is absent.
- The password is read from `VITE_MONTHSARY_PASSWORD`; no password literal may be added to source or tests.
- A configured `MM-DD-YYYY` password must also accept `MM-DD-YY`; compare trimmed strings exactly.
- Missing or empty password configuration fails closed.
- Use native accessible form controls and keep existing poem routes unchanged.
- Run `npm test`, `npm run typecheck`, and `npm run build` before completion.

## File Map

- Modify `src/hooks/use-song-unlock.ts`: make the click method synchronously return whether the seventh click unlocked access.
- Create `src/lib/song-access.ts`: storage keys, guarded storage reads/writes, and environment-derived password validation.
- Modify `src/lib/routes.ts`: `/songs/` path creation and matching.
- Modify `src/lib/inertia.ts`: full-path navigation helper for route changes.
- Create `src/components/songs/song-password-gate.tsx`: accessible password form and error state.
- Create `src/pages/songs-page.tsx`: route-level access state, redirect, gate, and song rendering.
- Modify `src/pages/page-router.tsx`: render `SongsPage` for the songs route.
- Modify `src/App.tsx`: remove inline songs and navigate after the seventh lantern click.
- Modify `src/index.css`: style the route gate and songs page shell.
- Modify `.env`: add the local `VITE_MONTHSARY_PASSWORD` key without committing the secret file.
- Create `test/lib/song-access.test.ts`: validation and storage contracts.
- Modify `test/hooks/use-song-unlock.test.tsx`: synchronous unlock return contract.
- Modify `test/pages/page-router.test.tsx`: songs route matching and rendering.
- Create `test/components/song-password-gate.test.tsx`: form accessibility and validation callbacks.
- Create `test/pages/songs-page.test.tsx`: route gate state and granted rendering.
- Modify `test/App.test.tsx`: no inline library and seventh-click navigation contract.

### Task 1: Define password and storage boundaries

**Files:**
- Create: `test/lib/song-access.test.ts`
- Create: `src/lib/song-access.ts`
- Modify: `.env`

**Interfaces:**
- Export `SONG_ACCESS_STORAGE_KEY = 'poem-lantern:songs-access-granted'`.
- Export `readSongUnlockFlag(): boolean` and `readSongAccessFlag(): boolean`.
- Export `writeSongAccessFlag(): void`.
- Export `isMonthsaryPassword(candidate: string, configuredPassword?: string): boolean`.

- [ ] **Step 1: Write failing tests**

```ts
import { afterEach, describe, expect, it } from 'vitest';
import {
  SONG_ACCESS_STORAGE_KEY,
  isMonthsaryPassword,
  readSongAccessFlag,
  readSongUnlockFlag,
  writeSongAccessFlag,
} from '@/lib/song-access';

afterEach(() => window.localStorage.clear());

describe('song access', () => {
  it('accepts configured full and short date formats without hardcoding the secret', () => {
    expect(isMonthsaryPassword('09-19-2026', '09-19-2026')).toBe(true);
    expect(isMonthsaryPassword('09-19-26', '09-19-2026')).toBe(true);
    expect(isMonthsaryPassword(' 09-19-26 ', '09-19-2026')).toBe(true);
    expect(isMonthsaryPassword('09/19/2026', '09-19-2026')).toBe(false);
    expect(isMonthsaryPassword('09-19-2025', '09-19-2026')).toBe(false);
  });

  it('fails closed when configuration is missing', () => {
    expect(isMonthsaryPassword('09-19-2026', '')).toBe(false);
    expect(isMonthsaryPassword('09-19-2026', undefined)).toBe(false);
  });

  it('reads and writes the separate password-access flag', () => {
    expect(SONG_ACCESS_STORAGE_KEY).toBe('poem-lantern:songs-access-granted');
    expect(readSongUnlockFlag()).toBe(false);
    expect(readSongAccessFlag()).toBe(false);
    window.localStorage.setItem('poem-lantern:songs-unlocked', 'true');
    expect(readSongUnlockFlag()).toBe(true);
    writeSongAccessFlag();
    expect(readSongAccessFlag()).toBe(true);
  });
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- --run test/lib/song-access.test.ts`

Expected: FAIL because `src/lib/song-access.ts` does not exist.

- [ ] **Step 3: Implement the boundary**

```ts
export const SONG_UNLOCK_STORAGE_KEY = 'poem-lantern:songs-unlocked';
export const SONG_ACCESS_STORAGE_KEY = 'poem-lantern:songs-access-granted';

function readFlag(key: string) {
  if (typeof window === 'undefined') return false;
  try { return window.localStorage.getItem(key) === 'true'; } catch { return false; }
}

export function readSongUnlockFlag() { return readFlag(SONG_UNLOCK_STORAGE_KEY); }
export function readSongAccessFlag() { return readFlag(SONG_ACCESS_STORAGE_KEY); }

export function writeSongAccessFlag() {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(SONG_ACCESS_STORAGE_KEY, 'true'); } catch { /* session-only access */ }
}

export function isMonthsaryPassword(candidate: string, configuredPassword = import.meta.env.VITE_MONTHSARY_PASSWORD) {
  const configured = configuredPassword?.trim() ?? '';
  const answer = candidate.trim();
  if (!configured || !answer) return false;
  const accepted = new Set([configured]);
  const fullDate = configured.match(/^(\d{2}-\d{2})-(\d{4})$/);
  const shortDate = configured.match(/^(\d{2}-\d{2})-(\d{2})$/);
  if (fullDate) accepted.add(`${fullDate[1]}-${fullDate[2].slice(-2)}`);
  if (shortDate) accepted.add(`${shortDate[1]}-20${shortDate[2]}`);
  return accepted.has(answer);
}
```

Add `VITE_MONTHSARY_PASSWORD=` to `.env` without committing `.env`; the local value is supplied by the user’s environment.

- [ ] **Step 4: Run the focused test**

Run: `npm test -- --run test/lib/song-access.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/song-access.ts test/lib/song-access.test.ts
git commit -m "feat: add song access password boundary"
```

### Task 2: Make the unlock click navigate safely

**Files:**
- Modify: `src/hooks/use-song-unlock.ts`
- Modify: `src/lib/routes.ts`
- Modify: `src/lib/inertia.ts`
- Modify: `test/hooks/use-song-unlock.test.tsx`
- Create: `test/lib/routes.test.ts`

**Interfaces:**
- `clickLantern(): boolean` returns `true` only on the seventh click and persists the existing unlock flag before returning.
- `getSongsPath(basePath = '/'): string` returns `/songs/` at root and `<base>/songs/` for non-root bases.
- `isSongsPath(pathname: string, basePath = '/'): boolean` accepts the route with or without its trailing slash.
- `navigateToPath(href: string): void` performs browser navigation only when `window` exists.

- [ ] **Step 1: Add failing assertions**

Extend the hook test so the seventh call returns `true`, earlier calls return `false`, and `localStorage` already contains `poem-lantern:songs-unlocked=true` immediately after the seventh call. Add route tests:

```ts
expect(getSongsPath()).toBe('/songs/');
expect(getSongsPath('/monthsary/')).toBe('/monthsary/songs/');
expect(isSongsPath('/songs')).toBe(true);
expect(isSongsPath('/monthsary/songs/', '/monthsary/')).toBe(true);
expect(isSongsPath('/poems/example')).toBe(false);
```

- [ ] **Step 2: Run focused tests to verify failure**

Run: `npm test -- --run test/hooks/use-song-unlock.test.tsx test/lib/routes.test.ts`

Expected: FAIL on the missing return value and route helpers.

- [ ] **Step 3: Implement synchronous unlock and routing helpers**

Track the click count in a ref before scheduling React state updates. On the seventh click, set the ref/state to seven, write the existing unlock storage flag, and return `true`; otherwise schedule the existing two-second reset and return `false`. Add `getSongsPath`, `isSongsPath`, and `navigateToPath` while leaving anchor navigation unchanged.

- [ ] **Step 4: Run focused tests**

Run: `npm test -- --run test/hooks/use-song-unlock.test.tsx test/lib/routes.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/use-song-unlock.ts src/lib/routes.ts src/lib/inertia.ts test/hooks/use-song-unlock.test.tsx test/lib/routes.test.ts
git commit -m "feat: navigate from lantern unlock to songs route"
```

### Task 3: Build the password gate component

**Files:**
- Create: `src/components/songs/song-password-gate.tsx`
- Create: `test/components/song-password-gate.test.tsx`

**Interfaces:**
- `SongPasswordGateProps = { error?: string; onSubmit: (candidate: string) => void }`.
- The component renders `data-testid="song-password-gate"`, a real label, a password input named `monthsary-password`, and a submit button.

- [ ] **Step 1: Write failing static-render tests**

```tsx
it('renders an accessible monthsary question form', () => {
  const markup = renderToStaticMarkup(<SongPasswordGate onSubmit={() => undefined} />);
  expect(markup).toContain('data-testid="song-password-gate"');
  expect(markup).toContain('When is our monthsary?');
  expect(markup).toContain('type="password"');
  expect(markup).toContain('autocomplete="off"');
  expect(markup).toContain('for="monthsary-password"');
});

it('renders an inline error without exposing the configured password', () => {
  const markup = renderToStaticMarkup(<SongPasswordGate error="That answer is not quite right." onSubmit={() => undefined} />);
  expect(markup).toContain('That answer is not quite right.');
  expect(markup).toContain('role="alert"');
  expect(markup).not.toContain('09-19');
});
```

- [ ] **Step 2: Run the focused test to verify failure**

Run: `npm test -- --run test/components/song-password-gate.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the form**

Use local `useState('')`, submit `onSubmit(password.trim())`, clear the field after submission, and render the error with `role="alert"` and `aria-describedby`. The submit button text should be `Open the songs`.

- [ ] **Step 4: Run the focused test**

Run: `npm test -- --run test/components/song-password-gate.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/songs/song-password-gate.tsx test/components/song-password-gate.test.tsx
git commit -m "feat: add monthsary password gate form"
```

### Task 4: Add the `/songs/` page and route matching

**Files:**
- Create: `src/pages/songs-page.tsx`
- Modify: `src/pages/page-router.tsx`
- Modify: `test/pages/page-router.test.tsx`
- Create: `test/pages/songs-page.test.tsx`

**Interfaces:**
- `SongsPageProps = { basePath?: string }`.
- `PageRouter` renders `SongsPage` when `isSongsPath(pathname, basePath)` is true.

- [ ] **Step 1: Write failing route/page tests**

Add a page-router test with `window.localStorage.setItem('poem-lantern:songs-unlocked', 'true')` that renders `/songs/` and asserts `data-testid="page-songs"`. Add a songs-page test that sets the unlock flag, renders the page in jsdom, and asserts the password gate appears; a separate test sets both unlock and access flags and asserts `data-testid="song-library"` appears. Use a stub for `window.location.assign` or a mocked `navigateToPath` when testing the unarmed redirect branch.

- [ ] **Step 2: Run the focused tests to verify failure**

Run: `npm test -- --run test/pages/page-router.test.tsx test/pages/songs-page.test.tsx`

Expected: FAIL because the route and page do not exist.

- [ ] **Step 3: Implement `SongsPage` and router branch**

`SongsPage` should initialize to `checking` during static rendering, then read `readSongUnlockFlag()` and `readSongAccessFlag()` in a browser-safe effect. If unarmed, call `navigateToPath(getHomePath(basePath))` and render a redirecting shell. If armed and not approved, render `SongPasswordGate`; on a valid candidate call `writeSongAccessFlag()` and switch to `granted`. In `granted`, render the existing `SongLibrary songs={songs}` inside a page shell with `SiteHeader` and `data-testid="page-songs"`.

- [ ] **Step 4: Run focused tests**

Run: `npm test -- --run test/pages/page-router.test.tsx test/pages/songs-page.test.tsx`

Expected: PASS, including configured base paths and gated/granted states.

- [ ] **Step 5: Commit**

```bash
git add src/pages/songs-page.tsx src/pages/page-router.tsx test/pages/page-router.test.tsx test/pages/songs-page.test.tsx
git commit -m "feat: add password-gated songs route"
```

### Task 5: Remove inline songs and wire final navigation

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/index.css`
- Modify: `test/App.test.tsx`

**Interfaces:**
- `App` no longer imports `songs` or `SongLibrary` and never renders `data-testid="song-library"`.
- On the seventh `clickLantern()` result, `App` calls `navigateToPath(getSongsPath(import.meta.env.BASE_URL))` after the unlock flag has been persisted.

- [ ] **Step 1: Write failing integration assertions**

Update the app test to mock `navigateToPath`, clear both song storage keys, click the two lantern buttons seven times as separate `act` calls, assert that the mock received a `/songs/` destination, and assert that `song-library` is absent before and after the home-page clicks. Do not assert the password literal.

- [ ] **Step 2: Run the app test to verify failure**

Run: `npm test -- --run test/App.test.tsx`

Expected: FAIL because the home app still renders the song library and does not navigate.

- [ ] **Step 3: Implement integration**

Remove the inline song imports/render. In `handleLanternClick`, call `const unlockedNow = clickLantern(); if (unlockedNow) navigateToPath(getSongsPath(import.meta.env.BASE_URL));`. Keep the lanterns’ `isSongsUnlocked` prop so the visual state remains accurate until navigation.

Add `.songs-page`, `.songs-page-shell`, `.song-password-panel`, `.song-password-error`, and mobile rules reusing the existing plum/amber/serif/mono tokens. Preserve the existing song card styles for the route.

- [ ] **Step 4: Run focused integration tests**

Run: `npm test -- --run test/App.test.tsx test/pages/songs-page.test.tsx test/components/song-password-gate.test.tsx`

Expected: PASS, with no inline song library on the home page.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/index.css test/App.test.tsx
git commit -m "feat: move songs behind route password gate"
```

### Task 6: Run the complete CI-equivalent verification

**Files:**
- No intended file changes.

- [ ] **Step 1: Run all tests**

Run: `npm test`

Expected: PASS with all existing and new tests; no skipped or focused lanes.

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`

Expected: PASS with exit code 0.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: PASS with the songs route and MP3 asset in the generated bundle.

- [ ] **Step 4: Check final diff and status**

Run: `git diff --check; git status --short; git log -8 --oneline`

Expected: no whitespace errors, only the pre-existing `.gitignore` modification remains unrelated, and the feature commits are present.
