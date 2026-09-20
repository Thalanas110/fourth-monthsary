# Splash Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an appropriately themed lantern-and-leaves splash overlay to the Poem Lantern monthsary suite that plays on every full page load and fades out to reveal the loaded site beneath.

**Architecture:** A fixed full-viewport `SplashScreen` component rendered in `src/main.tsx` above `PageRouter` inside the existing `ErrorBoundary`, so the app renders behind the veil. After `SPLASH_DURATION_MS` (1800ms) it applies a hiding class that fades opacity over `SPLASH_FADE_MS` (450ms); it unmounts on the fade's `transitionend` or a 450ms timeout guard. Under `prefers-reduced-motion: reduce` it renders nothing. Styling joins the existing hero/leaf rules in `src/index.css`, following the established deterministic custom-property pattern.

**Tech Stack:** React 19, TypeScript 5.8, Vitest 3 (jsdom environment for DOM tests), Vite 6, plain CSS in `src/index.css`.

## Global Constraints

- The splash plays on every full page load and must not add waiting time — the site renders and is interactive behind the veil.
- `SPLASH_DURATION_MS = 1800` and `SPLASH_FADE_MS = 450` are exported constants; the fade transition in CSS is exactly `450ms`.
- The splash renders exactly eight `span.splash-leaf` elements.
- The entire splash subtree is `aria-hidden="true"` with `pointer-events: none`; no status/live-region content, no focus management.
- `prefers-reduced-motion: reduce` must render no splash overlay at all.
- Motion animates only compositor-friendly `opacity`/`transform`; no layout or geometry property is animated in the flame, glow, or leaves.
- Existing selectors, test IDs, anchor behavior, and page composition must remain stable.
- The empty `src/pages/loading-page.tsx` file is removed; the splash is not a routed page.
- Verified with `npm test`, `npm run typecheck`, and `npm run build` at each task. Commit style follows the repo (`feat:`, `fix:`, `docs:`).

---

### Task 1: SplashScreen render + reduced-motion skip

**Files:**
- Create: `src/components/main/splash-screen.tsx`
- Create: `test/components/splash-screen.test.tsx`

**Interfaces:**
- Produces: `SplashScreen` (React component), constants `SPLASH_DURATION_MS = 1800` and `SPLASH_FADE_MS = 450`, a `SPLASH_LEAF_COUNT = 8` constant. Markup root is `div.splash-screen[aria-hidden="true"]` containing `div.splash-leaf-set` (8 `span.splash-leaf`), `div.splash-board` (span `.splash-glow`, div `.splash-lantern` containing `span.splash-flame` and `span.splash-lantern-cap`, `p.splash-kicker` with text `Lighting the lantern...`, `p.splash-title` with text `Happy 4th monthsary`).

- [ ] **Step 1: Write the failing tests**

Create `test/components/splash-screen.test.tsx`:

```tsx
// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { SplashScreen } from '@/components/main/splash-screen';

Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', { configurable: true, value: true });

function stubMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })),
  });
}

describe('SplashScreen', () => {
  it('renders the themed splash with lantern, glow, leaves, and caption', () => {
    const markup = renderToStaticMarkup(<SplashScreen />);

    expect(markup).toContain('class="splash-screen"');
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('splash-glow');
    expect(markup).toMatch(/<div class="splash-lantern"[^>]*>/);
    expect(markup).toContain('splash-flame');
    expect(markup).toContain('splash-lantern-cap');
    expect(markup.match(/<span class="splash-leaf"[^>]*><\/span>/g) ?? []).toHaveLength(8);
    expect(markup).toContain('Lighting the lantern...');
    expect(markup).toContain('Happy 4th monthsary');
  });

  it('skips the splash entirely under reduced motion', () => {
    stubMatchMedia(true);
    const container = document.createElement('div');
    document.body.appendChild(container);
    let root: Root | undefined;
    let didUnmount = false;
    try {
      act(() => {
        root = createRoot(container);
        root.render(<SplashScreen />);
      });
      expect(container.querySelector('.splash-screen')).toBeNull();
      act(() => root?.unmount());
      didUnmount = true;
    } finally {
      if (!didUnmount) act(() => root?.unmount());
      container.remove();
    }
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- test/components/splash-screen.test.tsx`
Expected: FAIL — `Cannot find module '@/components/main/splash-screen'` (file does not exist yet).

- [ ] **Step 3: Write the minimal implementation**

Create `src/components/main/splash-screen.tsx`:

```tsx
import { useEffect, useState } from 'react';

export const SPLASH_DURATION_MS = 1800;
export const SPLASH_FADE_MS = 450;

const SPLASH_LEAF_COUNT = 8;

export function SplashScreen() {
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRemoved(true);
    }
  }, []);

  if (removed) return null;

  return (
    <div aria-hidden="true" className="splash-screen">
      <div aria-hidden="true" className="splash-leaf-set">
        {Array.from({ length: SPLASH_LEAF_COUNT }, (_, index) => <span className="splash-leaf" key={index} />)}
      </div>
      <div aria-hidden="true" className="splash-board">
        <span className="splash-glow" />
        <div className="splash-lantern">
          <span className="splash-flame" />
          <span className="splash-lantern-cap" />
        </div>
        <p className="splash-kicker">Lighting the lantern...</p>
        <p className="splash-title">Happy 4th monthsary</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- test/components/splash-screen.test.tsx`
Expected: PASS — both tests green.

- [ ] **Step 5: Run the broader checks**

Run: `npm run typecheck`
Expected: PASS (no type errors).

- [ ] **Step 6: Commit**

```bash
git add src/components/main/splash-screen.tsx test/components/splash-screen.test.tsx
git commit -m "feat: add splash screen render with reduced-motion skip"
```

---

### Task 2: Timed fade-out and unmount

**Files:**
- Modify: `src/components/main/splash-screen.tsx`
- Modify: `test/components/splash-screen.test.tsx`

**Interfaces:**
- Consumes: `SplashScreen`, `SPLASH_DURATION_MS`, `SPLASH_FADE_MS` from Task 1.
- Produces: `SplashScreen` now applies `splash-screen--hiding` on the root at `SPLASH_DURATION_MS` and unmounts (renders `null`) `SPLASH_FADE_MS` later, or on the fade `transitionend`, whichever comes first.

- [ ] **Step 1: Write the failing timing test**

Append this test to `test/components/splash-screen.test.tsx` (after the reduced-motion test):

```tsx
  it('fades out after the splash duration and unmounts after the fade', () => {
    vi.useFakeTimers();
    stubMatchMedia(false);
    const container = document.createElement('div');
    document.body.appendChild(container);
    let root: Root | undefined;
    let didUnmount = false;
    try {
      act(() => {
        root = createRoot(container);
        root.render(<SplashScreen />);
      });
      expect(container.querySelector('.splash-screen')).not.toBeNull();
      expect(container.querySelector('.splash-screen--hiding')).toBeNull();

      act(() => vi.advanceTimersByTime(SPLASH_DURATION_MS));
      expect(container.querySelector('.splash-screen--hiding')).not.toBeNull();

      act(() => vi.advanceTimersByTime(SPLASH_FADE_MS));
      expect(container.querySelector('.splash-screen')).toBeNull();

      act(() => root?.unmount());
      didUnmount = true;
    } finally {
      if (!didUnmount) act(() => root?.unmount());
      container.remove();
      vi.useRealTimers();
    }
  });
```

Also update the imports at the top of the test file to include the timing constants:

```tsx
import { SPLASH_DURATION_MS, SPLASH_FADE_MS, SplashScreen } from '@/components/main/splash-screen';
```

(Replace the existing `import { SplashScreen } from '@/components/main/splash-screen';` line.)

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- test/components/splash-screen.test.tsx`
Expected: FAIL — the new test fails because `SplashScreen` never applies `splash-screen--hiding` and never unmounts.

- [ ] **Step 3: Implement the timed lifecycle**

Replace the entire contents of `src/components/main/splash-screen.tsx`:

```tsx
import { useEffect, useState } from 'react';

export const SPLASH_DURATION_MS = 1800;
export const SPLASH_FADE_MS = 450;

const SPLASH_LEAF_COUNT = 8;

export function SplashScreen() {
  const [hiding, setHiding] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRemoved(true);
      return;
    }
    const fadeTimer = window.setTimeout(() => setHiding(true), SPLASH_DURATION_MS);
    return () => window.clearTimeout(fadeTimer);
  }, []);

  useEffect(() => {
    if (!hiding) return;
    const guardTimer = window.setTimeout(() => setRemoved(true), SPLASH_FADE_MS);
    return () => window.clearTimeout(guardTimer);
  }, [hiding]);

  if (removed) return null;

  return (
    <div
      aria-hidden="true"
      className={hiding ? 'splash-screen splash-screen--hiding' : 'splash-screen'}
      onTransitionEnd={hiding ? () => setRemoved(true) : undefined}
    >
      <div aria-hidden="true" className="splash-leaf-set">
        {Array.from({ length: SPLASH_LEAF_COUNT }, (_, index) => <span className="splash-leaf" key={index} />)}
      </div>
      <div aria-hidden="true" className="splash-board">
        <span className="splash-glow" />
        <div className="splash-lantern">
          <span className="splash-flame" />
          <span className="splash-lantern-cap" />
        </div>
        <p className="splash-kicker">Lighting the lantern...</p>
        <p className="splash-title">Happy 4th monthsary</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- test/components/splash-screen.test.tsx`
Expected: PASS — all three tests green.

- [ ] **Step 5: Commit**

```bash
git add src/components/main/splash-screen.tsx test/components/splash-screen.test.tsx
git commit -m "feat: fade and unmount splash after the timed sequence"
```

---

### Task 3: Splash styling in index.css

**Files:**
- Modify: `src/index.css` (insert the splash block after the `.delay-3` rule at line 231, before the `@keyframes fade-up` rule at line 232)
- Create: `test/styles/splash-screen.test.ts`

**Interfaces:**
- Consumes: the splash markup from Task 2 (`splash-screen`, `splash-screen--hiding`, `splash-leaf-set`, 8 `splash-leaf`, `splash-board`, `splash-glow`, `splash-lantern`, `splash-flame`, `splash-lantern-cap`, `splash-kicker`, `splash-title`).
- Produces: CSS classes and keyframes `splash-fall`, `splash-flame-flicker`, `splash-glow-bloom`; eight deterministic `.splash-leaf:nth-child(1..8)` blocks per the formulas below.

- [ ] **Step 1: Write the failing CSS test**

Create `test/styles/splash-screen.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const indexCss = readFileSync(new URL('../../src/index.css', import.meta.url), 'utf8');

describe('splash screen CSS', () => {
  it('styles the veil, lantern, flame glow, and a deterministic 8-leaf drift', () => {
    expect(indexCss).toMatch(/\.splash-screen\s*\{/);

    const screenRule = indexCss.match(/\.splash-screen\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(screenRule).toMatch(/\bposition\s*:\s*fixed\s*;/);
    expect(screenRule).toMatch(/\btransition\s*:\s*opacity\s+450ms\s+.*;/);
    expect(screenRule).toMatch(/\bpointer-events\s*:\s*none\s*;/);

    expect(indexCss).toMatch(/\.splash-screen--hiding\s*\{\s*opacity:\s*0\s*;\s*\}/);
    expect(indexCss).toMatch(/\.splash-leaf-set\s*\{/);
    expect(indexCss).toMatch(/\.splash-lantern\s*\{/);
    expect(indexCss).toMatch(/\.splash-flame\s*\{/);
    expect(indexCss).toMatch(/\.splash-glow\s*\{/);

    const leafRule = indexCss.match(/\.splash-leaf\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(leafRule).toMatch(/\bposition\s*:\s*absolute\s*;/);
    expect(leafRule).toMatch(/\bclip-path\s*:/);
    expect(leafRule).not.toMatch(/\bfilter\s*:/);
    expect(leafRule).not.toMatch(/\bbox-shadow\s*:/);

    const flameRule = indexCss.match(/\.splash-flame\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(flameRule).toMatch(/\banimation\s*:\s*splash-flame-flicker\b/);
    expect(flameRule).not.toMatch(/\btransition\b/);

    expect(indexCss).toMatch(/@keyframes splash-fall/);
    expect(indexCss).toMatch(/@keyframes splash-flame-flicker/);
    expect(indexCss).toMatch(/@keyframes splash-glow-bloom/);

    const leafBlocks = [...indexCss.matchAll(/\.splash-leaf:nth-child\((\d+)\)\s*\{([^}]*)\}/g)];
    expect(leafBlocks).toHaveLength(8);
    expect(new Set(leafBlocks.map(([, index]) => Number(index))).size).toBe(8);

    const opacities = ['.35', '.45', '.55', '.65'];
    const colors = ['#8f4f32', '#a7663a', '#b4773d', '#6e3d2c'];
    for (let i = 1; i <= 8; i += 1) {
      const declarations = leafBlocks.find(([, index]) => Number(index) === i)?.[2] ?? '';
      expect(declarations).toContain(`--splash-leaf-left: ${((i * 47) % 88) + 4}%;`);
      expect(declarations).toContain(`--splash-leaf-delay: -${(i * 237) % 1600}ms;`);
      expect(declarations).toContain(`--splash-leaf-duration: ${1400 + ((i * 41) % 401)}ms;`);
      expect(declarations).toContain(`--splash-leaf-drift: ${((i * 29) % 23) - 11}vw;`);
      expect(declarations).toContain(`--splash-leaf-size: ${9 + ((i * 3) % 5)}px;`);
      expect(declarations).toContain(`--splash-leaf-opacity: ${opacities[i % 4]};`);
      expect(declarations).toContain(`--splash-leaf-color: ${colors[i % 4]};`);
    }
  });
});
```

- [ ] **Step 2: Run the CSS test to verify it fails**

Run: `npm test -- test/styles/splash-screen.test.ts`
Expected: FAIL — the splash selectors are not yet in `src/index.css`.

- [ ] **Step 3: Add the splash styles**

Append the following block to `src/index.css` immediately after the `.delay-3` rule (line 231) and before the `@keyframes fade-up` rule (line 232). Do NOT place it between `@keyframes leaf-fall` and `@media (max-width: 800px)` — the existing `falling-leaves-motion.test.ts` asserts that window contains only the leaf keyframes' compositor-only declarations:

```css
.splash-screen { align-items: center; background: hsl(var(--background)); display: grid; inset: 0; opacity: 1; place-items: center; pointer-events: none; position: fixed; transition: opacity 450ms ease; z-index: 40; }
.splash-screen--hiding { opacity: 0; }
.splash-leaf-set { inset: 0; overflow: hidden; pointer-events: none; position: absolute; }
.splash-board { align-items: center; display: flex; flex-direction: column; gap: 16px; position: relative; z-index: 1; }
.splash-glow { animation: splash-glow-bloom 1800ms ease-out both; background: radial-gradient(circle, hsl(var(--primary) / .14), transparent 62%); height: 320px; left: 50%; opacity: 0; position: absolute; top: 46%; transform: translate(-50%, -50%) scale(.55); width: 320px; }
.splash-lantern { background: linear-gradient(145deg, hsl(var(--foreground) / .05), hsl(var(--background) / .42)); border: 1px solid hsl(var(--foreground) / .4); border-radius: 49% 49% 38% 38% / 26% 26% 68% 68%; box-shadow: 0 0 0 11px hsl(var(--foreground) / .02), 0 0 54px hsl(var(--primary) / .12); height: min(30vw, 112px); position: relative; width: min(25vw, 94px); }
.splash-lantern::before, .splash-lantern::after { background: hsl(var(--foreground) / .35); content: ''; height: 1px; left: 50%; position: absolute; transform: translateX(-50%); width: 70%; }
.splash-lantern::before { top: 30%; }
.splash-lantern::after { bottom: 30%; }
.splash-lantern-cap { border: 1px solid hsl(var(--foreground) / .4); border-bottom: 0; border-radius: 50% 50% 0 0; height: 14px; left: 50%; position: absolute; top: -9px; transform: translateX(-50%); width: 34px; }
.splash-flame { animation: splash-flame-flicker 900ms ease-in-out infinite; background: hsl(var(--primary)); border-radius: 52% 48% 48% 48%; box-shadow: 0 0 22px 8px hsl(var(--primary) / .32); clip-path: polygon(50% 0%, 77% 31%, 100% 59%, 88% 83%, 64% 100%, 34% 93%, 8% 70%, 0 46%, 27% 25%); height: 28px; left: 50%; position: absolute; top: 6%; transform: translateX(-50%); width: 15px; }
.splash-kicker { align-items: center; color: hsl(var(--primary)); display: flex; font: 500 10px var(--app-font-mono); gap: 12px; letter-spacing: .2em; margin: 0; text-transform: uppercase; }
.splash-kicker::before, .splash-kicker::after { background: hsl(var(--primary)); content: ''; height: 1px; width: 31px; }
.splash-title { color: hsl(var(--foreground)); font: 400 clamp(34px, 5.5vw, 56px)/.95 var(--app-font-serif); letter-spacing: -.045em; margin: 0; }
.splash-leaf { animation: splash-fall var(--splash-leaf-duration) linear var(--splash-leaf-delay) infinite; background: var(--splash-leaf-color); border-radius: 75% 12% 75% 12%; clip-path: polygon(50% 0%, 91% 23%, 84% 66%, 50% 100%, 16% 66%, 9% 23%); contain: layout paint; height: var(--splash-leaf-size); left: var(--splash-leaf-left); opacity: 0; position: absolute; top: 0; width: var(--splash-leaf-size); will-change: opacity, transform; }
.splash-leaf:nth-child(1) { --splash-leaf-left: 51%; --splash-leaf-delay: -237ms; --splash-leaf-duration: 1441ms; --splash-leaf-drift: -5vw; --splash-leaf-size: 12px; --splash-leaf-opacity: .45; --splash-leaf-color: #a7663a; }
.splash-leaf:nth-child(2) { --splash-leaf-left: 10%; --splash-leaf-delay: -474ms; --splash-leaf-duration: 1482ms; --splash-leaf-drift: 1vw; --splash-leaf-size: 10px; --splash-leaf-opacity: .55; --splash-leaf-color: #b4773d; }
.splash-leaf:nth-child(3) { --splash-leaf-left: 57%; --splash-leaf-delay: -711ms; --splash-leaf-duration: 1523ms; --splash-leaf-drift: 7vw; --splash-leaf-size: 13px; --splash-leaf-opacity: .65; --splash-leaf-color: #6e3d2c; }
.splash-leaf:nth-child(4) { --splash-leaf-left: 16%; --splash-leaf-delay: -948ms; --splash-leaf-duration: 1564ms; --splash-leaf-drift: -10vw; --splash-leaf-size: 11px; --splash-leaf-opacity: .35; --splash-leaf-color: #8f4f32; }
.splash-leaf:nth-child(5) { --splash-leaf-left: 63%; --splash-leaf-delay: -1185ms; --splash-leaf-duration: 1605ms; --splash-leaf-drift: -4vw; --splash-leaf-size: 9px; --splash-leaf-opacity: .45; --splash-leaf-color: #a7663a; }
.splash-leaf:nth-child(6) { --splash-leaf-left: 22%; --splash-leaf-delay: -1422ms; --splash-leaf-duration: 1646ms; --splash-leaf-drift: 2vw; --splash-leaf-size: 12px; --splash-leaf-opacity: .55; --splash-leaf-color: #b4773d; }
.splash-leaf:nth-child(7) { --splash-leaf-left: 69%; --splash-leaf-delay: -59ms; --splash-leaf-duration: 1687ms; --splash-leaf-drift: 8vw; --splash-leaf-size: 10px; --splash-leaf-opacity: .65; --splash-leaf-color: #6e3d2c; }
.splash-leaf:nth-child(8) { --splash-leaf-left: 28%; --splash-leaf-delay: -296ms; --splash-leaf-duration: 1728ms; --splash-leaf-drift: -9vw; --splash-leaf-size: 13px; --splash-leaf-opacity: .35; --splash-leaf-color: #8f4f32; }
@keyframes splash-fall {
  0% { opacity: 0; transform: translate3d(0, -18svh, 0) rotate(-14deg); }
  10% { opacity: var(--splash-leaf-opacity); transform: translate3d(calc(var(--splash-leaf-drift) * .1), 10svh, 0) rotate(16deg); }
  30% { opacity: var(--splash-leaf-opacity); transform: translate3d(calc(var(--splash-leaf-drift) * .32), 30svh, 0) rotate(52deg); }
  55% { opacity: var(--splash-leaf-opacity); transform: translate3d(calc(var(--splash-leaf-drift) * .6), 55svh, 0) rotate(96deg); }
  80% { opacity: var(--splash-leaf-opacity); transform: translate3d(calc(var(--splash-leaf-drift) * .92), 82svh, 0) rotate(148deg); }
  100% { opacity: 0; transform: translate3d(var(--splash-leaf-drift), calc(100svh + 18svh), 0) rotate(212deg); }
}
@keyframes splash-flame-flicker { 0%, 100% { opacity: .82; transform: translateX(-50%) scale(1); } 50% { opacity: 1; transform: translateX(-50%) scale(1.12); } }
@keyframes splash-glow-bloom { from { opacity: 0; transform: translate(-50%, -50%) scale(.55); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
```

- [ ] **Step 4: Run the CSS test to verify it passes**

Run: `npm test -- test/styles/splash-screen.test.ts`
Expected: PASS.

- [ ] **Step 5: Run the full suite plus checks**

Run: `npm test` then `npm run typecheck` then `npm run build`
Expected: all tests PASS (including the existing falling-leaves and hero tests, which read the same `src/index.css`), typecheck clean, build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/index.css test/styles/splash-screen.test.ts
git commit -m "feat: style the splash veil, lantern, and leaf drift"
```

---

### Task 4: Wire SplashScreen into the app root

**Files:**
- Modify: `src/main.tsx`
- Delete: `src/pages/loading-page.tsx`

**Interfaces:**
- Consumes: `SplashScreen` from Task 2.
- Produces: `src/main.tsx` renders `<SplashScreen />` above `<PageRouter />` inside `ErrorBoundary`, so the splash overlays the home page, poem pages, and not-found on every full page load.

- [ ] **Step 1: Render the splash above the router**

Edit `src/main.tsx`:

```tsx
import { createRoot } from 'react-dom/client';

import { ErrorBoundary } from '@/components/errors/error-boundary';
import { SplashScreen } from '@/components/main/splash-screen';
import { PageRouter } from '@/pages/page-router';

import './theme.scss';
import './index.css';

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary resetKey={window.location.pathname}>
    <SplashScreen />
    <PageRouter basePath={import.meta.env.BASE_URL} pathname={window.location.pathname} />
  </ErrorBoundary>,
);
```

- [ ] **Step 2: Remove the empty placeholder page**

Delete `src/pages/loading-page.tsx`:

```bash
Remove-Item src/pages/loading-page.tsx
```

- [ ] **Step 3: Verify everything**

Run: `npm test` then `npm run typecheck` then `npm run build`
Expected: all tests PASS, typecheck clean, build succeeds.

Manual smoke check (optional): `npm run dev`, open the app and confirm the lantern-and-leaves splash plays on reload, fades after ~1.8s revealing the interactive site, and does not appear under OS reduced-motion.

- [ ] **Step 4: Commit**

```bash
git add src/main.tsx
git rm src/pages/loading-page.tsx
git commit -m "feat: play the splash screen on app load"
```

---

## Self-Review

**Spec coverage:**
- Overlay architecture + unmount: Tasks 1-2, 4.
- `SPLASH_DURATION_MS = 1800` / `SPLASH_FADE_MS = 450`: Task 2 constants + Task 3 `transition: opacity 450ms ease`.
- Eight leaves with deterministic custom properties: Tasks 1, 3.
- Lantern + flame + glow + mono kicker + serif title: Tasks 1, 3.
- `aria-hidden="true"` subtree + `pointer-events: none` + no status content: Task 1 markup, Task 3 CSS (`pointer-events: none` on `.splash-screen`).
- Reduced-motion renders nothing: Task 1.
- Compositor-only animation (opacity/transform only; no `filter`, no `box-shadow` on animated leaves/flame): Task 3 CSS + test assertions.
- Every-page-load behavior: Task 4 (rendered in `main.tsx` above `PageRouter`).
- Remove `src/pages/loading-page.tsx`: Task 4.
- `npm test` / typecheck / build verification: each task.

**Placeholder scan:** All steps contain concrete code, exact paths, and exact commands; no TBD/TODO.

**Type consistency:** `SPLASH_DURATION_MS`/`SPLASH_FADE_MS` names and values are consistent across Tasks 1-3. Markup class names match between component (Tasks 1-2) and CSS (Task 3). Test import of `SplashScreen`, `SPLASH_DURATION_MS`, `SPLASH_FADE_MS` matches the component's exports.