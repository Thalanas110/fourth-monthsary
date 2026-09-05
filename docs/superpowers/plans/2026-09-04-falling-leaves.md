# Falling Leaves Hero Effect Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents are available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a continuously looping autumn-brown leaf field to the Poem Lantern hero, with 15 visible leaves at `<= 800px`, 30 at `> 800px`, reduced-motion support, a mobile-first compositor-only animation budget, and a direct-file HTML preview.

**Architecture:** `HeroSection` renders one decorative layer containing 30 static leaf spans. `src/index.css` owns the silhouette, deterministic per-leaf variables, responsive visibility, stacking, and transform/opacity-only keyframes. `preview/falling-leaves.html` is a dependency-free visual copy of the hero and leaf layer with no JavaScript or network dependency.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, CSS animations, local scene asset.

---

## Current-state constraints

- Preserve the existing user-owned monthsary copy in `src/components/hero-section.tsx` exactly.
- Do not reset, stash, or overwrite unrelated working-tree changes.
- Work in the current workspace because the user explicitly authorized proceeding and needs the preview file visible from the active project. The current branch is `master`; the user’s “Proceed” is explicit consent to continue here.
- Before the ten-commit feature sequence, isolate the existing monthsary copy in a meaningful baseline commit (`content: preserve monthsary hero copy`). This prevents whole-file staging from silently bundling user-owned changes into a leaf commit. The ten implementation commits below begin after that baseline and are all required to be non-empty and feature-related.
- Follow `@superpowers:test-driven-development`: every test commit must fail for the intended missing behavior before its paired implementation commit.
- Follow `@frontend-design` for the visual treatment and `@superpowers:verification-before-completion` before reporting completion.

## File map

- Modify `src/components/hero-section.tsx`: render the 30-element decorative leaf layer before the existing hero copy.
- Modify `src/index.css`: add the hero stacking context, leaf shape, deterministic values, animation keyframes, responsive count, and reduced-motion rules.
- Create `preview/falling-leaves.html`: standalone preview with duplicated local CSS/markup, a relative scene-image path, local font fallbacks, and no scripts or external requests.
- Create `test/components/hero-section.test.tsx`: static-render contract for the layer, 30 leaf spans, and preserved monthsary copy.
- Create `test/styles/falling-leaves-base.test.ts`: CSS contract for the layer and leaf silhouette.
- Create `test/styles/falling-leaves-motion.test.ts`: CSS contract for transform/opacity-only motion and offscreen endpoints.
- Create `test/styles/falling-leaves-responsive.test.ts`: CSS contract for stacking, responsive counts, and reduced motion.
- Create `test/preview/falling-leaves.test.ts`: direct-file preview contract.

## Deterministic visual/performance contract

- Render 30 `span.hero-leaf` elements inside one `div.hero-leaf-layer[aria-hidden="true"]`.
- Each leaf uses `position`, `background`, `clip-path`, and static pseudo-element decoration; do not add filters, shadows, canvas, or a JavaScript animation loop.
- Give each leaf a deterministic value set through `:nth-child()` custom properties. Use these formulas for index `i` from 1 through 30:
  - `--leaf-left`: `${((i * 37) % 94) + 2}%`.
  - `--leaf-delay`: `-${(i * 13) % 18}s`.
  - `--leaf-duration`: `${18 + ((i * 7) % 9)}s` (18–26s inclusive).
  - `--leaf-drift`: `${((i * 17) % 41) - 20}vw`.
  - `--leaf-size`: `${10 + ((i * 5) % 8)}px`.
  - `--leaf-start-rotation`: `${((i * 29) % 70) - 35}deg`.
  - `--leaf-end-rotation`: `${180 + ((i * 31) % 160)}deg`.
  - `--leaf-opacity`: one of `.40`, `.46`, `.52`, `.58`, cycling by `i % 4`.
  - `--leaf-color`: cycle `#8f4f32`, `#a7663a`, `#b4773d`, `#6e3d2c`.
- Use `animation: leaf-fall var(--leaf-duration) linear var(--leaf-delay) infinite` and `transform-origin: center`.
- Keyframes must start at `translate3d(0, -18vh, 0)` with `opacity: 0`, keep opacity stable between 8% and 92%, and end at `translate3d(var(--leaf-drift), calc(100svh + 18vh), 0)` with `opacity: 0`. Intermediate sway and rotation must remain inside `transform` declarations.
- `.hero` must own `isolation: isolate` and `overflow: hidden`; the layer is z-index 1 and `.hero-copy` / `.hero-rule` are z-index 2. The layer is absolute, full-bleed, and `pointer-events: none`.
- At `max-width: 800px`, hide `.hero-leaf:nth-child(n + 16)`. Under reduced motion, hide `.hero-leaf-layer` entirely.

## Ten-commit implementation ledger

The baseline copy commit is not part of this ledger. Tasks 1–10 below must each produce one new commit, yielding at least ten new commits for the falling-leaves modification. Additional review-fix commits are allowed when they are non-empty, meaningful, and feature-related.

### Task 1: Add the hero leaf markup contract

**Commit:** `test: specify hero leaf layer contract`

**Files:**
- Create: `test/components/hero-section.test.tsx`

- [ ] **Step 1: Write the failing test.** Use `renderToStaticMarkup(<HeroSection />)` and assert the existing monthsary kicker/title/description, one `hero-leaf-layer`, `aria-hidden="true"`, and exactly 30 `hero-leaf` spans. The copy assertions should pass against the isolated baseline while the leaf assertions fail.
- [ ] **Step 2: Run the focused test to verify RED.** Run `npm test -- test/components/hero-section.test.tsx`; expected: FAIL because the layer does not exist.
- [ ] **Step 3: Commit the failing test.** Run `git add -- test/components/hero-section.test.tsx` and `git commit -m "test: specify hero leaf layer contract"`.

### Task 2: Render the fixed 30-leaf layer

**Commit:** `feat: render hero leaf layer`

**Files:**
- Modify: `src/components/hero-section.tsx`

- [ ] **Step 1: Add the minimal markup.** Insert a `div.hero-leaf-layer` before `.hero-copy` and map a fixed `Array.from({ length: 30 })` to `span.hero-leaf` elements with stable numeric keys. Preserve the existing hero copy byte-for-byte.
- [ ] **Step 2: Run the focused test to verify GREEN.** Run `npm test -- test/components/hero-section.test.tsx`; expected: PASS.
- [ ] **Step 3: Commit the markup.** Run `git add -- src/components/hero-section.tsx` and `git commit -m "feat: render hero leaf layer"`.

### Task 3: Add the base CSS contract test

**Commit:** `test: specify autumn leaf silhouette`

**Files:**
- Create: `test/styles/falling-leaves-base.test.ts`

- [ ] **Step 1: Write the failing test.** Read `src/index.css` with `readFileSync` and assert that `.hero-leaf-layer` and `.hero-leaf` exist, leaves are absolutely positioned, use `clip-path`, and do not declare `filter` or `box-shadow`. Parse all 30 `.hero-leaf:nth-child(i)` blocks and assert each block contains the exact values produced by the documented formulas for `--leaf-left`, `--leaf-delay`, `--leaf-duration`, `--leaf-drift`, `--leaf-size`, both rotations, opacity, and palette color.
- [ ] **Step 2: Run the focused test to verify RED.** Run `npm test -- test/styles/falling-leaves-base.test.ts`; expected: FAIL because the leaf CSS does not exist.
- [ ] **Step 3: Commit the failing test.** Run `git add -- test/styles/falling-leaves-base.test.ts` and `git commit -m "test: specify autumn leaf silhouette"`.

### Task 4: Style the autumn leaf silhouettes

**Commit:** `feat: style autumn leaf silhouettes`

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add base leaf styles.** Add a small leaf silhouette using the palette and custom-property contract above. Keep the layer decorative, non-interactive, and free of paint-expensive effects.
- [ ] **Step 2: Add deterministic per-leaf values.** Add the 30 `:nth-child()` rules using the formulas above, keeping all leaves visually varied but restrained.
- [ ] **Step 3: Run the focused test to verify GREEN.** Run `npm test -- test/styles/falling-leaves-base.test.ts`; expected: PASS.
- [ ] **Step 4: Commit the silhouette styles.** Run `git add -- src/index.css` and `git commit -m "feat: style autumn leaf silhouettes"`.

### Task 5: Add the motion contract test

**Commit:** `test: specify seamless leaf motion`

**Files:**
- Create: `test/styles/falling-leaves-motion.test.ts`

- [ ] **Step 1: Write the failing test.** Extract the `@keyframes leaf-fall` block and assert it contains the `-18vh` start buffer, the `calc(100svh + 18vh)` end buffer, stable opacity stops, and only `transform` / `opacity` declarations. Also assert the 30 value blocks stay within 18–26s and that the animation declaration references `leaf-fall` with infinite iteration and the per-leaf negative delay.
- [ ] **Step 2: Run the focused test to verify RED.** Run `npm test -- test/styles/falling-leaves-motion.test.ts`; expected: FAIL because the animation does not exist.
- [ ] **Step 3: Commit the failing test.** Run `git add -- test/styles/falling-leaves-motion.test.ts` and `git commit -m "test: specify seamless leaf motion"`.

### Task 6: Add the compositor-friendly fall animation

**Commit:** `feat: animate seamless falling leaves`

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add the animation declaration.** Animate only `transform` and `opacity`, using the per-leaf duration and negative delay variables. Use `will-change: transform, opacity` only on the small leaf elements.
- [ ] **Step 2: Add the keyframes.** Use 0%, 8%, 20%, 45%, 70%, 92%, and 100% stops. Keep the leaf outside the clipped hero for the first/last 18vh, fade only at the offscreen boundaries, and use intermediate transform-only sway/rotation.
- [ ] **Step 3: Run the focused test to verify GREEN.** Run `npm test -- test/styles/falling-leaves-motion.test.ts`; expected: PASS.
- [ ] **Step 4: Commit the motion.** Run `git add -- src/index.css` and `git commit -m "feat: animate seamless falling leaves"`.

### Task 7: Add the responsive/accessibility contract test

**Commit:** `test: specify leaf density and motion fallback`

**Files:**
- Create: `test/styles/falling-leaves-responsive.test.ts`

- [ ] **Step 1: Write the failing test.** Assert `.hero` has `isolation: isolate` and `overflow: hidden`; the leaf layer has z-index 1 and `pointer-events: none`; `.hero-copy` and `.hero-rule` have z-index 2; the 800px media rule hides children 16–30 (15 visible of the 30 markup leaves); widths above 800px have no leaf hide rule (30 visible); and reduced motion hides the entire layer (0 visible).
- [ ] **Step 2: Run the focused test to verify RED.** Run `npm test -- test/styles/falling-leaves-responsive.test.ts`; expected: FAIL because the responsive and stacking rules do not exist.
- [ ] **Step 3: Commit the failing test.** Run `git add -- test/styles/falling-leaves-responsive.test.ts` and `git commit -m "test: specify leaf density and motion fallback"`.

### Task 8: Add stacking, responsive density, and reduced motion

**Commit:** `feat: tune leaf density and reduced motion`

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add the stacking context.** Update `.hero` with `isolation: isolate` and `overflow: hidden`; set exact layer/content z-index rules without changing layout dimensions.
- [ ] **Step 2: Add mobile density.** At `max-width: 800px`, set `.hero-leaf:nth-child(n + 16) { display: none; }`, producing 15 visible leaves in motion-enabled mode; leave all 30 visible above 800px.
- [ ] **Step 3: Add the reduced-motion override.** Under `prefers-reduced-motion: reduce`, set `.hero-leaf-layer { display: none; }` so zero decorative leaves are visible and the existing global motion rule cannot freeze them in place.
- [ ] **Step 4: Run the focused test to verify GREEN.** Run `npm test -- test/styles/falling-leaves-responsive.test.ts`; expected: PASS.
- [ ] **Step 5: Commit the responsive behavior.** Run `git add -- src/index.css` and `git commit -m "feat: tune leaf density and reduced motion"`.

### Task 9: Add the standalone preview contract test

**Commit:** `test: specify direct file leaf preview`

**Files:**
- Create: `test/preview/falling-leaves.test.ts`

- [ ] **Step 1: Write the failing test.** Assert `preview/falling-leaves.html` exists, contains exactly 30 leaf spans, has no `<script>` tags, has no `http://`, `https://`, or protocol-relative `//` dependency in `src`, `href`, `url()`, `@import`, or stylesheet markup, references `../src/assets/scene.png`, includes the 800px and reduced-motion rules, and includes a performance note.
- [ ] **Step 2: Run the focused test to verify RED.** Run `npm test -- test/preview/falling-leaves.test.ts`; expected: FAIL because the preview does not exist.
- [ ] **Step 3: Commit the failing test.** Run `git add -- test/preview/falling-leaves.test.ts` and `git commit -m "test: specify direct file leaf preview"`.

### Task 10: Build the dependency-free visual preview

**Commit:** `feat: add direct file falling leaves preview`

**Files:**
- Create: `preview/falling-leaves.html`

- [ ] **Step 1: Add the preview document shell.** Create a local-only HTML document with the scene image at `../src/assets/scene.png`, local font fallbacks, the monthsary hero copy, and the 30-leaf markup. Do not include any `<script>` tag, module import, remote font, or external request.
- [ ] **Step 2: Add the matching embedded CSS.** Copy the leaf layer’s custom-property formulas, silhouette, keyframes, responsive rule, stacking rule, and reduced-motion rule into the preview so it can render without Vite or React.
- [ ] **Step 3: Add the preview note.** Include a small non-interactive note stating the mobile/desktop leaf counts and compositor-only motion budget without adding controls or extra runtime behavior.
- [ ] **Step 4: Run the focused test to verify GREEN.** Run `npm test -- test/preview/falling-leaves.test.ts`; expected: PASS.
- [ ] **Step 5: Verify the direct file path with concrete checks.** Run `Test-Path -LiteralPath 'preview/falling-leaves.html'` and `Test-Path -LiteralPath 'src/assets/scene.png'`; expected: both `True`. Open the absolute `file:///E:/all-projects/active/personal/open-secret/preview/falling-leaves.html` path in the in-app browser without starting a server; expected: the scene image and hero render. Inspect at 800px and 801px widths and with reduced motion enabled.
- [ ] **Step 6: Commit the preview.** Run `git add -- preview/falling-leaves.html` and `git commit -m "feat: add direct file falling leaves preview"`.

## Final verification and commit-count audit

- [ ] Run `npm test`; expected: all tests pass with 0 failures.
- [ ] Run `npm run typecheck`; expected: exit 0 with no TypeScript errors.
- [ ] Run `npm run build`; expected: exit 0 with a successful Vite production build.
- [ ] Inspect the React markup and stylesheet to confirm 15 visible leaves at 800px or narrower, 30 above 800px, and zero under reduced motion.
- [ ] Run the direct-file preview with network access disabled; expected: it opens and resolves only local assets.
- [ ] Run the 30-second Pixel 5-sized Chrome/4× CPU-throttled performance comparison; expected: enabling the leaf layer adds no dropped frames or leaf-caused long task over 50ms and stays within the 16.67ms frame budget.
- [ ] Observe 80 seconds of animation; expected: three cycles of the slowest leaf show no in-bounds reset and no 500ms top/bottom 12% edge-band gap.
- [ ] Identify the commit immediately before Task 1 (the isolated copy baseline) and run `git rev-list --count <feature-baseline>..HEAD`; expected: at least 10 implementation commits for this modification. Run `git log --oneline <feature-baseline>..HEAD`; expected: every listed commit is non-empty, meaningful, and related to this feature, with the ten ledger subjects represented plus any justified review-fix commits.
- [ ] Run `git status --short`; expected: no unintended changes and the existing user-owned hero copy remains intact.
