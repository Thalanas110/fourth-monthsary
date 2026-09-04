# Falling Leaves Hero Effect Design

## Goal

Add an autumn-brown falling-leaf atmosphere to the Poem Lantern hero while preserving the existing editorial layout, copy, ambient field, and interaction behavior. Provide a standalone HTML preview that can be opened directly from the filesystem without starting a local server.

## Product and performance constraints

- The effect is decorative only and must not compete with the hero copy or scroll cue.
- It must be mobile-first and designed for a sustained 60fps target on a repeatable representative profile: Chrome device emulation at Pixel 5 dimensions (`393 × 851` CSS pixels), with 4× CPU throttling. The acceptance check is a 30-second DevTools Performance capture with the leaf layer enabled compared with an identical capture with `.hero-leaf-layer` hidden: the enabled run must add no dropped frames and no long task over 50ms attributable to the leaf layer, while the frame track remains within the display’s 16.67ms budget. This is the target profile; other devices may vary.
- In motion-enabled mode, at viewport widths `<= 800px`, exactly 15 leaf elements are rendered as visible (`display` is not `none`); at widths `> 800px`, all 30 are visible. The breakpoint matches the existing responsive stylesheet. Reduced motion overrides this count and displays zero leaves.
- The animation loops continuously without visible popping, gaps, or synchronized resets.
- The effect must not intercept pointer input, change document layout, or add accessible content.
- Existing selectors, test IDs, anchor behavior, and page composition remain stable.
- `prefers-reduced-motion: reduce` hides the decorative leaf layer entirely. This explicit behavior takes precedence over the existing global animation-duration rule and leaves the hero usable without motion.

## Chosen approach

Use a CSS-only leaf layer rendered by `HeroSection` in `src/components/hero-section.tsx`, with styling in `src/index.css`. The component contract is a `div.hero-leaf-layer[aria-hidden="true"]` containing 30 `span.hero-leaf` elements. Each leaf is a lightweight, decorative element with a CSS silhouette and deterministic per-leaf custom properties for horizontal origin, drift, scale, rotation, duration, delay, and color. Motion uses only compositor-friendly `transform` and `opacity` properties; JavaScript animation loops and canvas drawing are intentionally out of scope.

The component renders one fixed 30-leaf set. CSS applies `display: none` to `.hero-leaf:nth-child(n + 16)` at `max-width: 800px`, so exactly 15 leaves are painted on mobile while the larger layout receives all 30. Under `prefers-reduced-motion: reduce`, `.hero-leaf-layer` is `display: none`, overriding the count rule. `.hero` owns the stacking context with `isolation: isolate` and clips the layer with `overflow: hidden`; `.hero-leaf-layer` is `position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 1`; `.hero-copy` and `.hero-rule` remain above it at `z-index: 2`. These rules do not affect hero layout dimensions.

## Seamless motion model

Every leaf begins at least `18vh` above the clipped hero and ends at least `18vh` below it. Its animation resets only after it has left the visible clipping region. Negative delays are distributed between `-18s` and `0s`, avoiding an initial burst. Each leaf’s duration is deterministic and bounded between `18s` and `26s`, so a leaf cycle means one complete 0%→100% path followed by its offscreen reset. Seamless looping is accepted after an 80-second observation (enough for three cycles of the slowest 26-second leaf) when no leaf reset occurs inside the clipped hero and there is no 500ms interval in which the top or bottom 12% edge band contains zero leaves with opacity above `0.05`.

The falling transform combines a diagonal translation, gentle intermediate sway, and rotation. All movement and fade keyframes animate only `transform` and `opacity`; no layout, geometry, or paint-heavy property is animated. Keyframes use an opacity ramp over the first and last 8% while the leaf is outside the clipping boundary and a stable opacity through the central 84% of the path.

## Visual direction

Leaves use a restrained autumn palette derived from the existing lantern amber and plum scene: muted chestnut, burnt sienna, ochre, and dry umber. Shapes are small and slightly irregular rather than photographic, keeping the effect editorial and reducing paint cost. Variants can be created with CSS custom properties and `clip-path` silhouettes without introducing image requests or new assets.

## Standalone preview

Add `preview/falling-leaves.html` as a dependency-free visual preview. It will contain the same hero treatment, leaf markup, CSS variables, keyframes, responsive counts, reduced-motion fallback, and a short non-interactive performance note. It may reference the tracked scene image using a relative path from `preview/`, but it must open as a `file://` document without Vite, React, JavaScript, `<script>` tags, or external network requests. Typography will use local fallbacks (`Georgia`/`serif` and a local sans-serif stack) because the app’s Google Fonts links are not available in the direct-file preview. The intended implementation files are `src/components/hero-section.tsx`, `src/index.css`, and `preview/falling-leaves.html`.

## Verification

Before handoff, verify:

1. `npm test` passes with existing behavior unchanged.
2. `npm run typecheck` passes.
3. `npm run build` succeeds.
4. The standalone preview opens successfully as a direct `file://` document with network access disabled and contains no external runtime dependency.
5. Responsive inspection at `800px` and `801px` confirms exactly 15 and 30 visible leaf elements respectively in motion-enabled mode; reduced-motion inspection confirms zero visible leaves.
6. Static inspection confirms the `18vh` offscreen loop buffers, `18–26s` duration bounds, `-18s–0s` negative-delay distribution, compositor-only animated properties, `isolation: isolate`, and unchanged hero stacking/interaction behavior.
7. A 30-second Pixel 5-sized Chrome performance comparison at 4× CPU throttling confirms no leaf-caused additional dropped frames, no leaf-caused long tasks over 50ms, and the 16.67ms frame-budget target.
8. An 80-second visual inspection confirms three cycles of the slowest leaf with no in-bounds reset and no 500ms top/bottom 12% edge band interval without a leaf above `0.05` opacity.
9. The working diff contains only the intended hero/style/preview changes plus this approved design record.

## Commit history requirement

The relevant project history must contain at least 10 non-empty commits. Every commit created for this work must be meaningful, reviewable, and related to a coherent implementation or verification increment; no empty or placeholder commits may be added solely to satisfy the count. The current repository already exceeds the minimum, so the implementation plan will prioritize useful commit boundaries rather than manufacturing additional history.
