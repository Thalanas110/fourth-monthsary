import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const cssPath = new URL('../../src/index.css', import.meta.url);

describe('hero-to-poems scroll fade', () => {
  it('defines an atmospheric, non-interactive transition layer', () => {
    const css = readFileSync(cssPath, 'utf8');
    const transition = css.match(/\.hero-transition\s*\{([^}]*)\}/)?.[1] ?? '';
    const visualLayer = css.match(/\.hero-transition::before\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(transition).toMatch(/pointer-events:\s*none/);
    expect(transition).toMatch(/height:\s*0/);
    expect(visualLayer).toMatch(/bottom:\s*0/);
    expect(visualLayer).toMatch(/opacity:\s*var\(--hero-transition-opacity/);
    expect(visualLayer).toMatch(/filter:\s*blur\(/);
    expect(visualLayer).toMatch(/background:[^;]*linear-gradient/);
    expect(visualLayer).toMatch(/hsl\(var\(--background\)/);
  });

  it('keeps mobile and reduced-motion overrides in place', () => {
    const css = readFileSync(cssPath, 'utf8');

    expect(css).toMatch(/@media \(max-width: 800px\)[\s\S]*\.hero-transition/);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*\.hero-transition/);
  });
});
