# Splash Screen Design

## Goal

Add an appropriately themed loading splash to the Poem Lantern monthsary suite: a lantern-and-falling-leaves entrance screen that plays on every full page load and fades out to reveal the loaded site beneath it.

## Product and behavior constraints

- The splash is an intro flourish, not a real loading indicator. It appears on every full page load and must not add waiting time: the site renders behind it and is already interactive when the splash fades.
- The sequence runs approximately 1.8 seconds, then a 450ms opacity fade reveals the site; the splash then unmounts entirely so it cannot trap focus or intercept input.
- The splash is decorative. Its entire subtree is `aria-hidden="true"` and `pointer-events: none`; it exposes no status or live-region content, introduces no focus management, and leaves the main document flow untouched.
- Under `prefers-reduced-motion: reduce`, the splash does not render at all, matching the existing leaf-layer convention. Reduced motion must never show a static splash screen.
- The splash must not change page layout (it is `position: fixed`, covering the viewport), must not regress existing selectors, test IDs, anchor behavior, or page composition, and must not intercept pointer input.
- Motion uses compositor-friendly `opacity` and `transform` (and the existing box-shadow-driven lantern glow approach already used by `.lantern-mark`); no layout or geometry property is animated in the flame or leaves.

## Chosen approach

A `SplashScreen` component rendered once by `src/main.tsx` inside the existing error boundary, above `PageRouter`, as a full-viewport fixed overlay. The app loads normally behind the veil; the splash unmounts after its timed fade completes. The empty `src/pages/loading-page.tsx` file is removed — the splash is not a routed page.

### Component and timing

- `src/components/main/splash-screen.tsx`:
  - Renders `div.splash-screen` containing a decorative lantern assembly (`div.splash-lantern` reusing the existing `.lantern-mark` silhouette with a `.splash-flame` glow), a small deterministic `span.splash-leaf` set (8 leaves), and a two-line caption: a mono kicker `Lighting the lantern...` and the serif copy `Happy 4th monthsary`.
  - The whole subtree carries `aria-hidden="true"`; the overlay is `position: fixed; inset: 0; z-index` above the app shell; `pointer-events: none`.
  - Named timing constants: `SPLASH_DURATION_MS = 1800` and `SPLASH_FADE_MS = 450`.
  - On mount it is fully visible; it applies a fade (`transition: opacity 450ms`) at `SPLASH_DURATION_MS`, then unmounts on the fade `transitionend`, with a `SPLASH_FADE_MS` timeout guard so it always clears.
  - Reads `prefers-reduced-motion` on mount (via `window.matchMedia`) and renders `null` when reduced motion is active.

### Styling

- Splash styles live in `src/index.css` beside the existing hero/leaf rules: `.splash-screen`, `.splash-lantern`/`.splash-flame` with a bloom-and-flicker animation, a `.splash-leaf-set` layer reusing the leaf silhouette, and per-leaf custom properties (`--splash-leaf-left`, `--splash-leaf-drift`, `--splash-leaf-size`, `--splash-leaf-delay`, `--splash-leaf-duration`, `--splash-leaf-opacity`, `--splash-leaf-color`) for a deterministic 8-leaf drift with negative delays so the field is already in motion at first paint.
- The flush canvas the site already uses for the background (`--ink-plum` backstop) keeps the veil cohesive with the page it covers. Colors come from the existing amber/plum/rose tokens.
- The caption uses `--app-font-mono` for the kicker and `--app-font-serif` for the title, matching the hero typography.

## Visual direction

An ink-plum full-viewport veil with a centered lantern. The lantern flame ignites over the first ~0.9s: a soft amber halo blooms and flickers with subtle intensity variation. Eight small amber leaves drift around the lantern over ~1.6s using the hero's muted autumn palette (chestnut `#a7663a`, sienna `#b4773d`, umber `#6e3d2c`, sienna `#8f4f32`). The caption sits below the lantern and completes the composition. Nothing in the splash denotes progress; it is purely an entrance.

## Accessibility

- Whole overlay `aria-hidden="true"`: transient decorative content with no essential information, no focus trap, and no dormant interactive elements.
- `pointer-events: none`: cannot block interaction with the site while fading.
- `prefers-reduced-motion: reduce`: no splash rendered.
- No `role="status"`, toast, or live-region side effects; main content remains focusable and reachable immediately.

## Test plan

- `test/components/splash-screen.test.tsx`:
  - SSR/render assertion: markup contains `div.splash-screen[aria-hidden="true"]`, the lantern assembly, exactly 8 `span.splash-leaf`, and both caption lines.
  - Fake timers: the fade begins at `SPLASH_DURATION_MS` and the component unmounts no later than `SPLASH_DURATION_MS + SPLASH_FADE_MS`.
  - `matchMedia` mock for `prefers-reduced-motion: reduce` confirms the component renders no splash overlay.
- `npm test` passes with existing behavior unchanged.

## Implementation files

- `src/components/main/splash-screen.tsx` (new)
- `src/main.tsx` (render `SplashScreen` above `PageRouter`; remove nothing else)
- `src/index.css` (splash veil, lantern, flame keyframes, splash-leaf set)
- `test/components/splash-screen.test.tsx` (new)
- `src/pages/loading-page.tsx` (remove empty file)
- `docs/superpowers/specs/2026-09-20-splash-screen-design.md` (this record)

## Verification

1. `npm test` passes, including the new splash tests.
2. `npm run typecheck` passes.
3. `npm run build` succeeds.
4. Manual: a full reload plays the ~1.8s lantern-and-leaves sequence, fades over 450ms, and reveals an already-interactive site with no pointer or focus interference.
5. Manual: with reduced motion enabled, the splash never appears and the site loads directly.
6. The working diff contains only the intended splash changes plus this approved design record.