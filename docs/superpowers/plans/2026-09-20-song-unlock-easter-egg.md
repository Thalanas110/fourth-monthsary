# Song Unlock Easter Egg Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a shared seven-click lantern easter egg that persists an unlocked state and reveals an accessible song-library surface from both the header and hero lanterns.

**Architecture:** `App` owns a `useSongUnlock` hook and passes its click handler to one reusable `LanternButton` used by the header and hero. The hook persists only the unlocked flag, resets incomplete click sequences after two seconds, and reports unlock feedback through the existing toast hook. `SongLibrary` is conditionally rendered after the poem library and consumes the exported `songs` data, including the user-provided local MP3 asset; it also keeps an honest empty state for future empty catalogs rather than using fake audio URLs.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, jsdom, Sass/CSS, lucide-react.

## Global Constraints

- The unlock sequence is seven clicks within two seconds; an incomplete sequence resets after the timing window.
- Unlock state persists in `localStorage` and is safe during static/server rendering.
- Both lantern controls use native `<button type="button">` elements with accessible labels and visible focus states.
- Use the existing user-provided local MP3 asset at `src/assets/audios/I Saw You at the End of the Aisle.mp3`; do not fabricate audio URLs or metadata for tracks that are not present.
- Preserve existing poem behavior and all existing test coverage.
- Run `npm test`, `npm run typecheck`, and `npm run build` before completion.

## File Map

- Create `src/hooks/use-song-unlock.ts`: shared click-sequence and persistence logic.
- Create `src/components/main/lantern-button.tsx`: reusable accessible lantern control.
- Create `src/components/songs/song-library.tsx`: conditional song surface and empty state.
- Modify `src/components/main/site-header.tsx`: render the header lantern button and accept the shared callback.
- Modify `src/components/main/hero-section.tsx`: render the hero lantern and accept the shared callback/state.
- Modify `src/App.tsx`: own unlock state, pass callbacks, render the unlocked song library, and show the unlock toast.
- Modify `src/data/songs.ts`: correct the type shape and export the local MP3 as the first song record.
- Modify `src/index.css`: style the hero lantern, song section, empty state, and focus/pressed states.
- Create `test/hooks/use-song-unlock.test.tsx`: hook behavior and persistence tests.
- Create `test/components/lantern-button.test.tsx`: reusable control accessibility contract.
- Modify `test/components/hero-section.test.tsx`: hero lantern markup contract.
- Modify `test/components/component-organization.test.ts`: register the new components.
- Create `test/components/song-library.test.tsx`: locked/unlocked rendering contract.

### Task 1: Add the failing hook tests

**Files:**
- Create: `test/hooks/use-song-unlock.test.tsx`

**Interfaces:**
- Consumes the future `useSongUnlock()` hook.
- Produces the expected public contract: `{ isUnlocked, clickLantern, progress }`.

- [ ] **Step 1: Write the failing test**

The project does not currently depend on Testing Library, so use a small React test harness with `react-dom/client` and `jsdom` APIs already available in the repository. The tests must cover the concrete contract below:

```tsx
it('unlocks after seven clicks in the active window', () => {
  const { result } = renderSongUnlockHook();

  for (let click = 0; click < 7; click += 1) {
    act(() => result.current.clickLantern());
  }

  expect(result.current.isUnlocked).toBe(true);
  expect(result.current.progress).toBe(7);
});

it('resets an incomplete sequence after two seconds', () => {
  vi.useFakeTimers();
  const { result } = renderSongUnlockHook();

  act(() => {
    result.current.clickLantern();
    result.current.clickLantern();
    vi.advanceTimersByTime(2001);
  });

  expect(result.current.progress).toBe(0);
  vi.useRealTimers();
});

it('restores the persisted unlocked state', () => {
  window.localStorage.setItem('poem-lantern:songs-unlocked', 'true');

  const { result } = renderSongUnlockHook();

  expect(result.current.isUnlocked).toBe(true);
});
```

Implement `renderSongUnlockHook` with a minimal mounted React component that captures the hook result in a ref; do not add a new test dependency.

- [ ] **Step 2: Run the hook test to verify it fails**

Run: `npm test -- --run test/hooks/use-song-unlock.test.tsx`

Expected: FAIL because `src/hooks/use-song-unlock.ts` does not exist yet.

### Task 2: Implement the shared unlock hook

**Files:**
- Create: `src/hooks/use-song-unlock.ts`
- Test: `test/hooks/use-song-unlock.test.tsx`

**Interfaces:**
- Produces `useSongUnlock(): { isUnlocked: boolean; progress: number; clickLantern: () => void }`.
- Uses storage key `poem-lantern:songs-unlocked` and `UNLOCK_CLICKS = 7`.

- [ ] **Step 1: Write the minimal implementation**

```tsx
import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'poem-lantern:songs-unlocked';
const UNLOCK_CLICKS = 7;
const CLICK_WINDOW_MS = 2000;

export function useSongUnlock() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [progress, setProgress] = useState(0);
  const resetTimer = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  useEffect(() => {
    try {
      setIsUnlocked(window.localStorage.getItem(STORAGE_KEY) === 'true');
    } catch {
      setIsUnlocked(false);
    }
  }, []);

  useEffect(() => () => {
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
  }, []);

  const clickLantern = useCallback(() => {
    if (isUnlocked) return;

    setProgress((current) => {
      const next = current + 1;
      if (next >= UNLOCK_CLICKS) {
        setIsUnlocked(true);
        setProgress(UNLOCK_CLICKS);
        try {
          window.localStorage.setItem(STORAGE_KEY, 'true');
        } catch {
          // Storage is optional; the in-memory unlock still works.
        }
        return UNLOCK_CLICKS;
      }

      if (resetTimer.current) window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setProgress(0), CLICK_WINDOW_MS);
      return next;
    });
  }, [isUnlocked]);

  return { clickLantern, isUnlocked, progress };
}
```

- [ ] **Step 2: Run the hook tests**

Run: `npm test -- --run test/hooks/use-song-unlock.test.tsx`

Expected: PASS for seven-click unlock, timeout reset, and persistence. If React emits a state-update warning, adjust the test harness to wrap mount/unmount and timer advancement in `act`; do not weaken assertions.

- [ ] **Step 3: Commit the hook**

```bash
git add test/hooks/use-song-unlock.test.tsx src/hooks/use-song-unlock.ts
git commit -m "feat: add persistent song unlock hook"
```

### Task 3: Add the reusable lantern control and hero integration

**Files:**
- Create: `src/components/main/lantern-button.tsx`
- Modify: `src/components/main/site-header.tsx`
- Modify: `src/components/main/hero-section.tsx`
- Modify: `test/components/hero-section.test.tsx`
- Modify: `test/components/component-organization.test.ts`
- Create: `test/components/lantern-button.test.tsx`

**Interfaces:**
- `LanternButtonProps = { className?: string; isUnlocked?: boolean; onClick: () => void; placement: 'header' | 'hero' }`.
- `SiteHeader` adds `onLanternClick?: () => void` and `isSongsUnlocked?: boolean`, preserving optional defaults for existing callers.
- `HeroSection` adds `onLanternClick?: () => void` and `isSongsUnlocked?: boolean`, preserving static-render tests.

- [ ] **Step 1: Write failing component tests**

```tsx
it('renders an accessible pressed lantern button', () => {
  const markup = renderToStaticMarkup(
    <LanternButton onClick={() => undefined} placement="hero" isUnlocked={false} />,
  );

  expect(markup).toContain('<button');
  expect(markup).toContain('type="button"');
  expect(markup).toContain('aria-label="Unlock songs"');
  expect(markup).toContain('aria-pressed="false"');
});
```

Extend the hero test with `expect(markup).toContain('data-testid="hero-lantern"')`, and update the component organization map with `lantern-button.tsx`.

- [ ] **Step 2: Run the focused tests to verify they fail**

Run: `npm test -- --run test/components/lantern-button.test.tsx test/components/hero-section.test.tsx test/components/component-organization.test.ts`

Expected: FAIL because the component and hero lantern are not present.

- [ ] **Step 3: Implement the lantern control**

```tsx
export function LanternButton({ className = '', isUnlocked = false, onClick, placement }: LanternButtonProps) {
  return (
    <button
      aria-label={isUnlocked ? 'Songs unlocked' : 'Unlock songs'}
      aria-pressed={isUnlocked}
      className={`lantern-button lantern-button--${placement} ${className}`.trim()}
      data-testid={`${placement}-lantern`}
      onClick={onClick}
      type="button"
    >
      <span aria-hidden="true" className="lantern-button-cap" />
      <span aria-hidden="true" className="lantern-button-flame" />
      <span className="sr-only">{isUnlocked ? 'Songs unlocked' : 'Tap seven times to unlock songs'}</span>
    </button>
  );
}
```

Replace the header’s decorative `.lantern-mark` span with `LanternButton placement="header"` and add the hero button beside the hero copy. Keep `onLanternClick` optional so server-rendered component tests and unrelated callers remain valid.

- [ ] **Step 4: Run focused component tests**

Run: `npm test -- --run test/components/lantern-button.test.tsx test/components/hero-section.test.tsx test/components/component-organization.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the lantern controls**

```bash
git add src/components/main/lantern-button.tsx src/components/main/site-header.tsx src/components/main/hero-section.tsx src/index.css test/components/lantern-button.test.tsx test/components/hero-section.test.tsx test/components/component-organization.test.ts
git commit -m "feat: add clickable hero lantern"
```

### Task 4: Add the gated song-library surface

**Files:**
- Modify: `src/data/songs.ts`
- Create: `src/components/songs/song-library.tsx`
- Create: `test/components/song-library.test.tsx`
- Modify: `test/components/component-organization.test.ts`

**Interfaces:**
- `Song` retains `id`, `title`, `author`, `duration`, `length`, `excerpt`, and `body`, and adds `audioSrc`; rename the typo `excrept` to `excerpt` because no callers currently depend on it.
- Import `I Saw You at the End of the Aisle.mp3` from `@/assets/audios/` and export one `Song` record using that local source. Keep the array extensible for future tracks.
- `SongLibraryProps = { songs: Song[] }`.

- [ ] **Step 1: Write the failing song-library tests**

```tsx
it('renders the unlocked song section with an honest empty state', () => {
  const markup = renderToStaticMarkup(<SongLibrary songs={[]} />);

  expect(markup).toContain('data-testid="song-library"');
  expect(markup).toContain('Songs unlocked');
  expect(markup).toContain('No songs have been added yet.');
});
```

Register `songs/song-library.tsx` in the component organization test.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- --run test/components/song-library.test.tsx test/components/component-organization.test.ts`

Expected: FAIL because the song component does not exist.

- [ ] **Step 3: Implement the data boundary and library**

```tsx
import aisleSong from '@/assets/audios/I Saw You at the End of the Aisle.mp3';

export type Song = {
  id: string;
  title: string;
  author: string;
  duration: number;
  length: string;
  excerpt: string;
  body: string;
  audioSrc: string;
};

export const songs: Song[] = [{
  id: 'i-saw-you-at-the-end-of-the-aisle',
  title: 'I Saw You at the End of the Aisle',
  author: 'Adriaan M. Dimate',
  duration: 0,
  length: 'Song',
  excerpt: 'A song waiting behind the lantern.',
  body: '',
  audioSrc: aisleSong,
}];
```

Render a `<section id="songs" data-testid="song-library" aria-labelledby="songs-title">` with the heading `Songs unlocked`. When `songs.length === 0`, render `No songs have been added yet.`. When entries exist, render each title, author, excerpt, and a native `<audio controls preload="none" src={song.audioSrc}>`. Keep the empty branch for future catalog changes.

- [ ] **Step 4: Run the focused tests**

Run: `npm test -- --run test/components/song-library.test.tsx test/components/component-organization.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the song surface**

```bash
git add src/data/songs.ts src/components/songs/song-library.tsx test/components/song-library.test.tsx test/components/component-organization.test.ts
git commit -m "feat: add unlocked song library surface"
```

### Task 5: Wire the hook, lanterns, toast, and conditional rendering

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/main/site-header.tsx`
- Modify: `src/components/main/hero-section.tsx`
- Modify: `test/App.test.tsx`
- Modify: `src/index.css`

**Interfaces:**
- `App` calls `useSongUnlock()` and passes a wrapper around `clickLantern` plus `isUnlocked` to both lantern locations.
- `App` renders `<SongLibrary songs={songs} />` only when `isUnlocked` is true.
- The wrapper checks `!isUnlocked && progress === 6` before calling `clickLantern`, then displays `Songs unlocked. The hidden library is yours.` exactly once on the seventh click. It must not display the toast when `localStorage` restores an already-unlocked state.

- [ ] **Step 1: Write the failing app-level test**

Add a test that clears the song-unlock storage key, mounts `App`, finds both `data-testid="header-lantern"` and `data-testid="hero-lantern"`, clicks across both controls seven times, and asserts that `data-testid="song-library"` appears. Before the clicks, assert that it is absent. The test should use the existing jsdom setup and wrap all clicks in `act`.

- [ ] **Step 2: Run the app test to verify it fails**

Run: `npm test -- --run test/App.test.tsx`

Expected: FAIL because `App` does not yet pass the unlock callback or render the conditional song library.

- [ ] **Step 3: Wire the feature**

Import `useSongUnlock` and `songs` in `App`, derive `handleLanternClick` from the current `isUnlocked` and `progress` values, and call the existing `show` function when `!isUnlocked && progress === 6` immediately before forwarding the click to the hook. This makes the toast user-triggered and prevents a persisted unlock from showing a duplicate message on reload. Pass the hook values to `SiteHeader` and `HeroSection`, then render `{isUnlocked && <SongLibrary songs={songs} />}` immediately after `PoemLibrary`.

- [ ] **Step 4: Add the styles**

Add CSS for `.lantern-button`, `.lantern-button-cap`, `.lantern-button-flame`, `.hero-lantern-wrap`, `.songs-section`, `.songs-empty`, and their mobile variants. Use the existing `hsl(var(--primary))`, plum background, serif heading, mono utility text, thin border, and restrained glow. Include `button:focus-visible` styling for the new target and ensure the hero button remains above the leaf layer with `z-index: 2`.

- [ ] **Step 5: Run the focused app and regression tests**

Run: `npm test -- --run test/App.test.tsx test/components/hero-section.test.tsx test/components/lantern-button.test.tsx test/components/song-library.test.tsx`

Expected: PASS, including the pre-unlock absence and post-unlock appearance assertions.

- [ ] **Step 6: Commit the integration**

```bash
git add src/App.tsx src/components/main/site-header.tsx src/components/main/hero-section.tsx src/index.css test/App.test.tsx
git commit -m "feat: unlock songs through lantern easter egg"
```

### Task 6: Run the complete CI-equivalent verification

**Files:**
- No intended file changes.

- [ ] **Step 1: Run all tests**

Run: `npm test`

Expected: PASS with all existing and new tests; no focused or skipped test filters.

- [ ] **Step 2: Run type checking**

Run: `npm run typecheck`

Expected: PASS with exit code 0.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: PASS with a generated `dist` bundle.

- [ ] **Step 4: Check the final diff and status**

Run: `git diff --check; git status --short; git log -6 --oneline`

Expected: no whitespace errors, only feature commits plus the pre-existing `.gitignore` modification, and no generated files staged.
