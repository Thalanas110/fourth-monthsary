# Hero-to-Poems Scroll Fade

## Purpose

Replace the hard visual seam between the hero and poem library with a soft, atmospheric transition that responds to scroll position and remains readable and stable on small screens.

## Visual direction

The transition is a low-contrast plum-and-amber haze attached to the bottom edge of the hero. It begins nearly transparent at the top of the hero and becomes more visible as the poem library approaches, so the two sections feel like one continuous lantern-lit surface rather than separate panels.

## Behavior

- Render a dedicated decorative transition layer inside the hero, positioned at its bottom edge and marked `aria-hidden`.
- Drive a CSS custom property from normalized scroll progress between the hero bottom and the poem library top.
- Use a requestAnimationFrame-throttled scroll listener so updates stay bounded to one visual update per frame.
- Clamp progress between 0 and 1 and clear the listener on unmount.
- Keep the layer `pointer-events: none` and avoid changing document flow or the poem library’s interaction behavior.
- Respect `prefers-reduced-motion` by keeping the transition static and low intensity.

## Responsive behavior

- Use viewport-relative blur, height, and opacity so the fade scales with available space.
- Keep the transition within the hero’s overflow boundary to prevent horizontal overflow from decorative blur.
- Preserve the existing mobile hero padding and poem-library stacking rules.
- Allow the transition to use a smaller blur footprint and lower opacity below the existing 800px breakpoint.

## Implementation boundaries

- Add one focused scroll-progress hook for the hero/library boundary.
- Add the transition element to `HeroSection` and expose the library boundary through its existing section id.
- Add scoped CSS for the transition layer and its reduced-motion/mobile variants.
- Do not change poem content, card behavior, filters, routes, or the existing leaf animation.

## Verification

- Add hook/component coverage for progress clamping, cleanup, and the decorative transition contract.
- Add stylesheet coverage for the transition layer, pointer behavior, responsive override, and reduced-motion behavior.
- Run the full local CI-equivalent commands from `package.json`: `npm test`, `npm run typecheck`, and `npm run build`.
- Confirm there is no horizontal overflow at desktop and mobile viewport widths during manual inspection.
