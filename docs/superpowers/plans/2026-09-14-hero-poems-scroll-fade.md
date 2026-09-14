# Hero-to-Poems Scroll Fade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a scroll-linked, atmospheric fade that softens the visual boundary between the hero and poem library without changing layout or interactions.

**Architecture:** A focused `useHeroScrollFade` hook measures the hero's bottom boundary and writes clamped scroll progress plus derived opacity to CSS custom properties on the hero element. `HeroSection` owns the decorative transition layer; CSS supplies the plum/amber haze, mobile sizing, and reduced-motion fallback.

**Tech Stack:** React 19, TypeScript, Vite, Vitest/jsdom, CSS custom properties, `requestAnimationFrame`-throttled scroll updates.

## Global Constraints

- Keep the transition decorative with `aria-hidden="true"` and `pointer-events: none`.
- Do not change poem content, card behavior, filters, routes, or the existing leaf animation.
- Clamp scroll progress between `0` and `1`, and clean up scroll, resize, and animation-frame work on unmount.
- Preserve the existing mobile breakpoint at `max-width: 800px` and avoid horizontal overflow.
- Respect `prefers-reduced-motion` with a static low-intensity transition.
- Run `npm test`, `npm run typecheck`, and `npm run build` before completion.

---

### Task 1: Add the scroll-progress hook

**Files:**
- Create: `src/hooks/use-hero-scroll-fade.ts`
- Create: `test/hooks/use-hero-scroll-fade.test.tsx`

**Interfaces:**
- Produces `useHeroScrollFade(): React.RefObject<HTMLElement | null>`.
- The returned ref is attached to the hero section; the hook writes `--hero-transition-progress` and `--hero-transition-opacity` inline styles.

- [ ] **Step 1: Write the failing hook tests**

Create a jsdom probe that attaches the returned ref to a section. Stub `requestAnimationFrame` to execute callbacks immediately and return an id, stub `cancelAnimationFrame`, and control `getBoundingClientRect().bottom` plus `window.innerHeight`. Assert the hook initializes progress at `0`, clamps progress to `1` when the boundary is above the fade range, clamps it back to `0` when the boundary is below the viewport, and removes the scroll/resize listeners during unmount.

```tsx
function FadeProbe() {
  const ref = useHeroScrollFade();
  return <section data-testid="hero" ref={ref} />;
}

it('clamps scroll progress and cleans up listeners', () => {
  // render probe, set innerHeight to 1000, and return boundary positions
  // 1000 -> progress 0, 450 -> progress 1, then dispatch scroll
  expect(hero?.style.getPropertyValue('--hero-transition-progress')).toBe('1');
  root.unmount();
  expect(removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), expect.anything());
  expect(removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- --run test/hooks/use-hero-scroll-fade.test.tsx`

Expected: FAIL because `@/hooks/use-hero-scroll-fade` does not exist yet.

- [ ] **Step 3: Implement the minimal hook**

Use a `RefObject`, one `useEffect`, and a nullable frame id. On each scheduled update, read `ref.current.getBoundingClientRect().bottom`, calculate `progress = clamp((window.innerHeight - bottom) / Math.max(window.innerHeight * 0.55, 1), 0, 1)`, derive `opacity = 0.28 + progress * 0.72`, and set both values to three decimal places. Schedule once on mount and thereafter from passive `scroll` and normal `resize` listeners. Cancel a queued frame and remove both listeners in the cleanup function.

```ts
const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function useHeroScrollFade() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const hero = ref.current;
    if (!hero) return;

    let frame: number | null = null;
    const update = () => {
      frame = null;
      const progress = clamp((window.innerHeight - hero.getBoundingClientRect().bottom) / Math.max(window.innerHeight * 0.55, 1));
      hero.style.setProperty('--hero-transition-progress', progress.toFixed(3));
      hero.style.setProperty('--hero-transition-opacity', (0.28 + progress * 0.72).toFixed(3));
    };
    const schedule = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}
```

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm test -- --run test/hooks/use-hero-scroll-fade.test.tsx`

Expected: PASS with all progress and cleanup assertions green.

- [ ] **Step 5: Commit the hook and tests**

```bash
git add src/hooks/use-hero-scroll-fade.ts test/hooks/use-hero-scroll-fade.test.tsx
git commit -m "feat: add hero scroll fade progress hook"
```

### Task 2: Integrate the transition layer and responsive styling

**Files:**
- Modify: `src/components/main/hero-section.tsx`
- Modify: `src/index.css`
- Modify: `test/components/hero-section.test.tsx`
- Create: `test/styles/hero-poems-scroll-fade.test.ts`

**Interfaces:**
- Consumes `useHeroScrollFade` from Task 1.
- Produces a hero section with a ref-bound `.hero-transition` layer and CSS variables used only by that layer.

- [ ] **Step 1: Extend the component contract test**

Add assertions to the existing `HeroSection` test that the static markup includes exactly one `<div class="hero-transition" aria-hidden="true"></div>` and that the hero section remains present. This protects the decorative layer without coupling the test to generated style values.

```tsx
expect(markup.match(/<div class="hero-transition" aria-hidden="true"><\/div>/g)).toHaveLength(1);
expect(markup).toContain('<section class="hero"');
```

- [ ] **Step 2: Add failing stylesheet contract tests**

Read `src/index.css` and assert the new selector is positioned at the bottom of the hero, has `pointer-events: none`, uses the scroll opacity custom property, has a mobile override inside the 800px media query, and has a reduced-motion override.

```ts
expect(css).toMatch(/\.hero-transition\s*\{[^}]*bottom:\s*-?\d+px/);
expect(css).toMatch(/\.hero-transition\s*\{[^}]*pointer-events:\s*none/);
expect(css).toMatch(/\.hero-transition\s*\{[^}]*opacity:\s*var\(--hero-transition-opacity/);
expect(css).toMatch(/@media \(max-width: 800px\)[\s\S]*\.hero-transition/);
expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*\.hero-transition/);
```

- [ ] **Step 3: Run the focused component and stylesheet tests to verify they fail**

Run: `npm test -- --run test/components/hero-section.test.tsx test/styles/hero-poems-scroll-fade.test.ts`

Expected: FAIL because the transition markup and styles are not present.

- [ ] **Step 4: Add the ref and transition layer**

Import `useHeroScrollFade`, call it once at the top of `HeroSection`, attach the returned ref to the existing `<section className="hero">`, and render the transition layer immediately inside the section before the leaf layer.

```tsx
const heroRef = useHeroScrollFade();

<section className="hero" ref={heroRef} aria-labelledby="hero-title">
  <div className="hero-transition" aria-hidden="true" />
  <div className="hero-leaf-layer" aria-hidden="true">
```

- [ ] **Step 5: Add the atmospheric transition styles**

Add `.hero-transition` after the hero base rule. Use an absolute, oversized-but-clipped layer with a blurred linear gradient from transparent to plum and amber. Keep the layer below leaves and copy (`z-index: 0`), non-interactive, and use `opacity: var(--hero-transition-opacity, .28)`. Add a smaller `height`, blur, and opacity fallback in the existing `max-width: 800px` media query. Add `.hero-transition { opacity: .22; }` inside the existing reduced-motion media query so motion-sensitive users see a stable, quiet seam.

```css
.hero-transition { background: linear-gradient(180deg, transparent 0%, hsl(318 28% 52% / .12) 58%, hsl(31 94% 66% / .13) 100%); bottom: -24px; filter: blur(30px); height: clamp(104px, 15vw, 190px); left: -5%; opacity: var(--hero-transition-opacity, .28); pointer-events: none; position: absolute; width: 110%; z-index: 0; }
```

- [ ] **Step 6: Run focused tests to verify the integration passes**

Run: `npm test -- --run test/components/hero-section.test.tsx test/styles/hero-poems-scroll-fade.test.ts`

Expected: PASS for the transition markup and stylesheet contracts.

- [ ] **Step 7: Commit the integration**

```bash
git add src/components/main/hero-section.tsx src/index.css test/components/hero-section.test.tsx test/styles/hero-poems-scroll-fade.test.ts
git commit -m "feat: blend hero into poem library on scroll"
```

### Task 3: Run the complete local quality gate

**Files:**
- No source changes expected; only update files if a check exposes a defect in Tasks 1-2.

**Interfaces:**
- Verifies the completed hook, component integration, responsive CSS, and unchanged application behavior as one repository-level gate.

- [ ] **Step 1: Run the complete test suite**

Run: `npm test`

Expected: PASS with every existing and new test passing.

- [ ] **Step 2: Run TypeScript validation**

Run: `npm run typecheck`

Expected: PASS with no diagnostics.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: PASS with Vite producing the `dist` bundle.

- [ ] **Step 4: Inspect the final diff and whitespace**

Run: `git diff --check; git status --short; git diff --stat`

Expected: no whitespace errors; only the hook, hero integration, CSS, tests, and approved documentation are changed.

- [ ] **Step 5: Commit any verification-only corrections**

If a source defect is found, fix it, rerun the smallest affected check followed by the complete gate, and commit the correction with a focused message. If no defect is found, do not create an empty commit.
