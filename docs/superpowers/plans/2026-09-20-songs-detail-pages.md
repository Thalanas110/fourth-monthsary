# Songs Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task in the current master worktree.

**Goal:** Make the unlocked songs shelf link to protected, shareable per-song pages that follow the existing poem detail experience.

**Architecture:** Add route helpers for the songs index and detail paths, then route both through a shared access boundary that requires the existing seven-tap flag and monthsary password. Keep `SongLibrary` focused on collection cards and add a focused `SongPage` for metadata and audio playback, with styles extending the existing poem-page visual system.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, native audio controls, existing CSS custom properties, and Lucide icons.

## Global Constraints

- Every `/songs/*` route must reject visitors without the existing seven-tap lantern unlock.
- The existing monthsary password remains required after the lantern unlock.
- Song body text is rendered only when it exists; do not invent lyrics or placeholder content.
- Preserve the current localStorage keys and seven-tap behavior.
- Keep the existing `.gitignore` working-tree edit unstaged.
- Run targeted tests after each behavior change, then `npm test`, `npm run typecheck`, `npm run build`, and `git diff --check` before completion.

---

### Task 1: Add song route helpers

**Files:**
- Modify: `src/lib/routes.ts`
- Test: `test/lib/routes.test.ts`

**Interfaces:**
- `getSongPath(songId: string, basePath?: string): string`
- `getSongId(pathname: string, basePath?: string): string | null`
- `isSongsPath(pathname: string, basePath?: string): boolean` recognizes the index and descendants.
- `isSongsIndexPath(pathname: string, basePath?: string): boolean` distinguishes the collection route.

- [ ] **Step 1: Write the failing tests**

Add tests for root and non-root paths:

```ts
it('builds and reads song detail paths', () => {
  expect(getSongPath('test-song')).toBe('/songs/test-song');
  expect(getSongId('/songs/test-song')).toBe('test-song');
  expect(getSongId('/songs/test-song/')).toBe('test-song');
});

it('preserves the configured base path and recognizes descendants', () => {
  expect(getSongPath('test-song', '/monthsary/')).toBe('/monthsary/songs/test-song');
  expect(getSongId('/monthsary/songs/test-song', '/monthsary/')).toBe('test-song');
  expect(isSongsPath('/monthsary/songs/test-song', '/monthsary/')).toBe(true);
  expect(isSongsIndexPath('/monthsary/songs/', '/monthsary/')).toBe(true);
});
```

- [ ] **Step 2: Verify the tests fail**

Run `npx vitest run test/lib/routes.test.ts`. Expect failure because the new helpers do not exist.

- [ ] **Step 3: Implement the helpers**

Use the existing base-path normalization and encode/decode IDs:

```ts
export function getSongPath(id: string, basePath = '/') {
  return `${getSongsPath(basePath)}${encodeURIComponent(id)}`;
}

export function getSongId(pathname: string, basePath = '/') {
  const songsPath = getSongsPath(basePath);
  if (!pathname.startsWith(songsPath)) return null;
  const match = pathname.slice(songsPath.length).match(/^([^/]+)\/?$/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}
```

Make `isSongsPath` accept the exact index and any descendant beginning with the normalized songs path. Make `isSongsIndexPath` accept `/songs` and `/songs/` only.

- [ ] **Step 4: Verify and commit**

Run `npx vitest run test/lib/routes.test.ts`; expect all route tests to pass.

```bash
git add test/lib/routes.test.ts src/lib/routes.ts
git commit -m "feat: add song detail route helpers"
```

### Task 2: Centralize the songs access boundary

**Files:**
- Create: `src/components/songs/song-access-boundary.tsx`
- Modify: `src/pages/songs-page.tsx`
- Test: `test/components/song-access-boundary.test.tsx`
- Modify: `test/pages/songs-page.test.tsx`

**Interfaces:**
- `SongAccessBoundaryProps` contains `basePath?: string` and `children: ReactNode`.
- `SongAccessBoundary` renders checking, redirecting, password, or granted content using the existing storage keys and password helper.

- [ ] **Step 1: Write the failing tests**

Render the boundary in jsdom and assert that unarmed visitors never receive protected children, unlocked visitors see `SongPasswordGate`, and visitors with both flags see children.

```tsx
it('does not render protected children before the lantern unlock', () => {
  const { container, cleanup } = renderBoundary(<p>secret song</p>);
  expect(container.textContent).toContain('Returning to the lantern');
  expect(container.textContent).not.toContain('secret song');
  expect(navigateToPath).toHaveBeenCalledWith('/');
  cleanup();
});
```

- [ ] **Step 2: Verify the boundary test fails**

Run `npx vitest run test/components/song-access-boundary.test.tsx`. Expect failure because the component does not exist.

- [ ] **Step 3: Move the current access state logic into the boundary**

The component should preserve this state model and copy:

```tsx
type SongsAccessStatus = 'checking' | 'redirecting' | 'password' | 'granted';

if (status === 'checking') return <p className="songs-route-status">Lighting the way...</p>;
if (status === 'redirecting') return <p className="songs-route-status" data-testid="songs-route-redirecting">Returning to the lantern...</p>;
if (status === 'password') return <SongPasswordGate error={error} onSubmit={handlePasswordSubmit} />;
return <>{children}</>;
```

Move `getInitialStatus`, password submission, and redirect handling into the boundary. `SongsPage` keeps its shell and renders `SongLibrary` inside it, so existing page test IDs remain stable.

- [ ] **Step 4: Verify and commit**

Run `npx vitest run test/components/song-access-boundary.test.tsx test/pages/songs-page.test.tsx`; expect all focused tests to pass.

```bash
git add src/components/songs/song-access-boundary.tsx src/pages/songs-page.tsx test/components/song-access-boundary.test.tsx test/pages/songs-page.test.tsx
git commit -m "refactor: share songs route access boundary"
```

### Task 3: Turn the song shelf into a link-only library

**Files:**
- Modify: `src/components/songs/song-library.tsx`
- Test: `test/components/song-library.test.tsx`

**Interfaces:**
- `SongLibraryProps` gains `basePath?: string`.
- Each populated card produces a detail link and no native `<audio>` element.

- [ ] **Step 1: Write the failing tests**

```tsx
it('links each song card to its detail page without embedding audio', () => {
  const markup = renderToStaticMarkup(<SongLibrary basePath="/monthsary/" songs={[song]} />);
  expect(markup).toContain('href="/monthsary/songs/test-song"');
  expect(markup).toContain('aria-label="Listen to Test song"');
  expect(markup).not.toContain('<audio');
});
```

- [ ] **Step 2: Verify the focused test fails**

Run `npx vitest run test/components/song-library.test.tsx`. Expect failure because the current card embeds audio and has no detail link.

- [ ] **Step 3: Implement the card link**

Import `ArrowRight` and `getSongPath`, pass `basePath`, remove the card audio, and use the existing poem-card footer pattern:

```tsx
<div className="card-footer">
  <span className="song-author">by {song.author} · {song.length}</span>
  <a aria-label={`Listen to ${song.title}`} className="read-button" data-testid={`link-listen-${song.id}`} href={getSongPath(song.id, basePath)}>
    Listen <ArrowRight aria-hidden="true" />
  </a>
</div>
```

- [ ] **Step 4: Verify and commit**

Run `npx vitest run test/components/song-library.test.tsx`; expect all library tests to pass.

```bash
git add src/components/songs/song-library.tsx test/components/song-library.test.tsx
git commit -m "feat: link song cards to detail pages"
```

### Task 4: Add the protected song detail page and router selection

**Files:**
- Create: `src/components/songs/song-page.tsx`
- Create: `src/pages/song-page.tsx`
- Modify: `src/pages/page-router.tsx`
- Test: `test/pages/song-page.test.tsx`
- Modify: `test/pages/page-router.test.tsx`

**Interfaces:**
- `SongPageProps` contains `basePath?: string` and `song?: Song`.
- `SongPage` renders its shell and access boundary, then either the requested song or the existing not-found page.

- [ ] **Step 1: Write failing detail and router tests**

With both localStorage flags set, assert `data-testid="page-song"`, the song title, and an audio element whose `src` is the song asset. With no flags, assert the redirect message and absence of the title. Add a router test that `/songs/<known-id>` selects `SongPage`.

- [ ] **Step 2: Verify the tests fail**

Run `npx vitest run test/pages/song-page.test.tsx test/pages/page-router.test.tsx`. Expect failure because the detail component and dynamic selection do not exist.

- [ ] **Step 3: Implement the detail page**

Follow `src/components/poems/poem-page.tsx`: render the scene, leaves, ambient field, grain, site header, back link to `getSongsPath(basePath)`, title, excerpt, author/length metadata, and a reading/media column. Put the native player there:

```tsx
<audio aria-label={`Play ${song.title}`} controls preload="none" src={song.audioSrc} />
```

Render `song.body` only when `song.body.trim()` is non-empty. For `song?: Song` with no match, render `<NotFound />` only after the access boundary has granted access. Re-export the component from `src/pages/song-page.tsx` to match the poem page structure.

- [ ] **Step 4: Route the collection, detail, and malformed descendants**

In `PageRouter`, check `isSongsPath` before poem routing. Use `isSongsIndexPath` for `SongsPage`; otherwise pass `songs.find((item) => item.id === getSongId(pathname, basePath))` to `SongPage`. This keeps every `/songs/*` descendant behind the detail page boundary.

- [ ] **Step 5: Verify and commit**

Run `npx vitest run test/pages/song-page.test.tsx test/pages/page-router.test.tsx test/pages/songs-page.test.tsx`; expect all focused route tests to pass.

```bash
git add src/components/songs/song-page.tsx src/pages/song-page.tsx src/pages/page-router.tsx test/pages/song-page.test.tsx test/pages/page-router.test.tsx
git commit -m "feat: add protected song detail pages"
```

### Task 5: Style the song detail experience and run the full gate

**Files:**
- Modify: `src/index.css`
- Test: `test/styles/song-page.test.ts`

**Interfaces:**
- Adds `.song-page-*` selectors matching the poem detail layout at desktop and the existing `max-width: 800px` breakpoint.

- [ ] **Step 1: Write the failing style contract**

Read `src/index.css` and assert the new layout, audio, body, and responsive selectors:

```ts
expect(css).toContain('.song-page-layout {');
expect(css).toContain('.song-page-audio {');
expect(css).toContain('.song-page-body {');
expect(css).toContain('@media (max-width: 800px)');
```

- [ ] **Step 2: Verify the style test fails**

Run `npx vitest run test/styles/song-page.test.ts`. Expect failure because the selectors do not exist.

- [ ] **Step 3: Add the Organic poem-aligned styles**

Use existing CSS tokens and the poem detail geometry. The key new media treatment is:

```css
.song-page-audio {
  border: 1px solid hsl(var(--border));
  margin: 0 0 35px;
  padding: 18px;
}
.song-page-audio audio {
  width: 100%;
}
```

Add the two-column desktop layout, large serif title, metadata, rule, optional body, footer, and a flex-column collapse at `max-width: 800px`. Include the same gentle entrance treatment used by the poem detail page.

- [ ] **Step 4: Run the full local gate**

Run these commands in order:

```bash
npx vitest run test/styles/song-page.test.ts
npm test
npm run typecheck
npm run build
git diff --check
```

Expected: every command exits 0; Vitest reports all test files and tests passing.

- [ ] **Step 5: Commit and verify the worktree**

```bash
git add src/index.css test/styles/song-page.test.ts
git commit -m "style: match song details to poem pages"
git status --short
git branch --show-current
```

Expected: branch is `master`, and only the pre-existing `.gitignore` edit remains unstaged.
