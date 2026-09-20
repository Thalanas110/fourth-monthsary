# Song Player and Lyrics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Display the bundled lyrics for the existing protected song and replace the browser-default audio controls with an accessible Industrial listening-console player.

**Architecture:** Keep the song catalogue as the source of rendered lyric text by filling `Song.body` with the first song's authored lyrics. Extract the media interface into `SongPlayer`, which owns an `HTMLAudioElement` ref and playback state while `SongPage` retains route protection and page composition. The player exposes real button and range-input controls, then renders the song body as a whitespace-preserving lyric sheet.

**Tech Stack:** React 19, TypeScript, Vitest with jsdom, Lucide React, Vite, CSS.

## Global Constraints

- Work directly on `master`; the user explicitly authorized inline execution.
- Preserve the user's existing `.gitignore` modification and leave ignored `public/songs.md` unchanged.
- Add lyrics only for `i-saw-you-at-the-end-of-the-aisle`; the second Markdown song has no audio catalogue entry.
- Use the Industrial player tokens exactly: warm black `#0B0C0A`, amber `#FFB800`, DM Mono, flat 1px borders, tabular numerals, no rounded corners, grain, or decorative shadows inside `.song-player`.
- Preserve access control: song metadata, audio, and lyrics remain inside `SongAccessBoundary`.

---

## File structure

- `src/data/songs.ts` — existing catalogue; receives the first song's lyric body.
- `src/components/songs/song-player.tsx` — new focused audio transport and lyric-sheet component.
- `src/components/songs/song-page.tsx` — replaces direct `<audio>` and body rendering with `SongPlayer`.
- `src/index.css` — replaces the old native-audio block with the Industrial player layout and mobile rules.
- `test/components/song-player.test.tsx` — new behavior tests for transport, seek, errors, and lyrics.
- `test/pages/song-page.test.tsx` — verifies access-granted details expose the player's real lyrics.
- `test/components/component-organization.test.ts` — registers the new songs component.
- `test/styles/song-page.test.ts` — verifies the player style contract exists.

### Task 1: Bundle the first song's lyrics

**Files:**

- Modify: `src/data/songs.ts`
- Modify: `test/pages/song-page.test.tsx`

**Interfaces:**

- Consumes: `Song.body: string`.
- Produces: a non-empty lyric body for `songs[0]`, including the authored line `The room was quieter than I imagined,`.

- [ ] **Step 1: Write the failing page test**

  In the access-granted test, add the expected lyric assertion:

  ```ts
  expect(container.querySelector('[data-testid="text-song-body"]')?.textContent)
    .toContain('The room was quieter than I imagined,');
  ```

- [ ] **Step 2: Run the focused test to verify it fails**

  Run: `npx vitest run test/pages/song-page.test.tsx --pool=forks --maxWorkers=1 --minWorkers=1`

  Expected: the access-granted test fails because `songs[0].body` is empty and no lyric body renders.

- [ ] **Step 3: Add the authored lyric body**

  Copy only the reader-facing words from the first `public/songs.md` entry into `songs[0].body`, preserving section labels and line breaks. Exclude performance notes and chord progressions. Keep `audioSrc`, id, author, and catalogue metadata unchanged.

- [ ] **Step 4: Run the focused test to verify it passes**

  Run: `npx vitest run test/pages/song-page.test.tsx --pool=forks --maxWorkers=1 --minWorkers=1`

  Expected: all four song-page tests pass and the lyric assertion succeeds.

- [ ] **Step 5: Commit the data change**

  ```bash
  git add src/data/songs.ts test/pages/song-page.test.tsx
  git commit -m "feat: add bundled song lyrics"
  ```

### Task 2: Build the accessible custom player

**Files:**

- Create: `src/components/songs/song-player.tsx`
- Modify: `src/components/songs/song-page.tsx`
- Create: `test/components/song-player.test.tsx`
- Modify: `test/components/component-organization.test.ts`
- Modify: `test/pages/song-page.test.tsx`

**Interfaces:**

- Consumes: `SongPlayer({ song }: { song: Song })` and the existing song `audioSrc`, title, author, and `body` fields.
- Produces: `data-testid="song-player"`, `data-testid="button-song-playback"`, `data-testid="input-song-seek"`, and `data-testid="text-song-body"`.

- [ ] **Step 1: Write failing component tests**

  Create tests that render the intended public component API and verify its contract:

  ```tsx
  render(<SongPlayer song={songs[0]} />);
  expect(screen.getByTestId('song-player')).not.toBeNull();
  expect(screen.getByTestId('text-song-body').textContent)
    .toContain('The room was quieter than I imagined,');
  expect(screen.getByRole('button', { name: 'Play I Saw You at the End of the Aisle' })).not.toBeNull();
  ```

  Mock `HTMLMediaElement.prototype.play` and `.pause`, dispatch `loadedmetadata`, `timeupdate`, and `error` on the rendered audio, and assert the play label/state, seek value, formatted time, and playback-unavailable message.

- [ ] **Step 2: Run the focused component test to verify it fails**

  Run: `npx vitest run test/components/song-player.test.tsx --pool=forks --maxWorkers=1 --minWorkers=1`

  Expected: the test fails because `SongPlayer` does not exist yet.

- [ ] **Step 3: Implement `SongPlayer` and integrate it**

  Create a component that:

  ```tsx
  export interface SongPlayerProps { song: Song; }
  export function SongPlayer({ song }: SongPlayerProps) { /* transport + lyrics */ }
  ```

  Use an `HTMLAudioElement` ref; listen to `loadedmetadata`, `timeupdate`, `play`, `pause`, `ended`, and `error`; keep `isPlaying`, `currentTime`, `duration`, and `hasPlaybackError` in React state. Give the play/pause button an explicit accessible label, use an `input type="range"` for seeking, and use `aria-live="polite"` only for an error message. Render the lyric body in a whitespace-preserving element only when it is non-empty. Replace the direct `<audio controls>` and body block in `SongPage` with `<SongPlayer song={song} />`.

- [ ] **Step 4: Run focused tests to verify they pass**

  Run: `npx vitest run test/components/song-player.test.tsx test/pages/song-page.test.tsx --pool=forks --maxWorkers=1 --minWorkers=1`

  Expected: all component and page tests pass, including native media event state transitions.

- [ ] **Step 5: Register and commit the component**

  Add `song-player.tsx` to the `songs` component map, then run:

  ```bash
  git add src/components/songs/song-player.tsx src/components/songs/song-page.tsx test/components/song-player.test.tsx test/components/component-organization.test.ts test/pages/song-page.test.tsx
  git commit -m "feat: add accessible song player"
  ```

### Task 3: Apply the Industrial player system

**Files:**

- Modify: `src/index.css`
- Modify: `test/styles/song-page.test.ts`

**Interfaces:**

- Consumes: the stable `.song-player`, `.song-player-transport`, `.song-player-progress`, and `.song-player-lyrics` classes from Task 2.
- Produces: a responsive player that remains usable at `max-width: 800px`.

- [ ] **Step 1: Write the failing style-contract test**

  Add assertions for the intended player selectors and its token values:

  ```ts
  expect(css).toContain('.song-player {');
  expect(css).toContain('background: #0B0C0A;');
  expect(css).toContain('font-family: var(--app-font-mono);');
  expect(css).toContain('.song-player-lyrics {');
  ```

- [ ] **Step 2: Run the focused style test to verify it fails**

  Run: `npx vitest run test/styles/song-page.test.ts --pool=forks --maxWorkers=1 --minWorkers=1`

  Expected: the new assertions fail because player styles do not exist.

- [ ] **Step 3: Add the Industrial player styles**

  Replace `.song-page-audio` and `.song-page-body` presentation with a flat warm-black player. Use amber only for the playhead, progress fill, focused controls, and active playback state; keep every `.song-player` text rule in `var(--app-font-mono)`. Use 1px borders, `font-variant-numeric: tabular-nums`, a visible amber left rail on the lyric panel, and a mobile single-column media rule. Do not use border-radius, shadows, gradients, or grain within the player.

- [ ] **Step 4: Run focused style and component checks**

  Run: `npx vitest run test/styles/song-page.test.ts test/components/song-player.test.tsx --pool=forks --maxWorkers=1 --minWorkers=1`

  Expected: style-contract and player behavior tests pass.

- [ ] **Step 5: Commit the visual system**

  ```bash
  git add src/index.css test/styles/song-page.test.ts
  git commit -m "style: add industrial song player"
  ```

### Task 4: Verify the complete change

**Files:**

- Verify only.

- [ ] **Step 1: Run the full test suite**

  Run: `npm test`

  Expected: all Vitest files and tests pass with no focused or skipped tests.

- [ ] **Step 2: Run static and production checks**

  Run:

  ```bash
  npm run typecheck
  npm run build
  git diff --check
  ```

  Expected: each command exits with status 0.

- [ ] **Step 3: Review the worktree**

  Run: `git status --short`

  Expected: only the pre-existing `.gitignore` modification remains unstaged after task commits.
