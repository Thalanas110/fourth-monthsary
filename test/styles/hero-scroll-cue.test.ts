import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const cssPath = new URL('../../src/index.css', import.meta.url);

describe('hero scroll cue motion', () => {
  it('floats the dash, arrow, and label together', () => {
    const css = readFileSync(cssPath, 'utf8');
    const heroRule = css.match(/\.hero-rule\s*\{([^}]*)\}/)?.[1] ?? '';
    const scrollMark = css.match(/\.scroll-mark\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(heroRule).toMatch(/animation:\s*drift\s+2\.8s\s+ease-in-out\s+infinite/);
    expect(scrollMark).not.toMatch(/animation\s*:/);
    expect(css).toContain('.hero-rule::before');
  });
});
