import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const cssPath = new URL('../../src/index.css', import.meta.url);

describe('hero-to-poems scroll fade', () => {
  it('defines an atmospheric, non-interactive transition layer', () => {
    const css = readFileSync(cssPath, 'utf8');
    const transition = css.match(/\.hero-transition\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(transition).toMatch(/bottom:\s*-?\d+px/);
    expect(transition).toMatch(/pointer-events:\s*none/);
    expect(transition).toMatch(/opacity:\s*[^;]*var\(--hero-transition-opacity/);
    expect(transition).toMatch(/filter:\s*blur\(/);
  });

  it('keeps mobile and reduced-motion overrides in place', () => {
    const css = readFileSync(cssPath, 'utf8');

    expect(css).toMatch(/@media \(max-width: 800px\)[\s\S]*\.hero-transition/);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*\.hero-transition/);
  });
});
