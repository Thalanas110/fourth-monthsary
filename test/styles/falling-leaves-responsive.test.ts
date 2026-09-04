import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const indexCss = readFileSync(new URL('../../src/index.css', import.meta.url), 'utf8');

function readRule(css: string, selector: string): string {
  const escapedSelector = selector.replace(/[.*+?^{}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(escapedSelector + '\\s*\\{([^}]*)\\}'));

  expect(match, 'Expected ' + selector + ' to be declared').not.toBeNull();
  return match?.[1] ?? '';
}

describe('falling leaves responsive CSS', () => {
  it('keeps the leaf layer behind content and caps visible density by mode', () => {
    const heroRule = readRule(indexCss, '.hero');
    const layerRule = readRule(indexCss, '.hero-leaf-layer');
    const copyRule = readRule(indexCss, '.hero-copy');
    const heroCueRule = readRule(indexCss, '.hero-rule');

    expect(heroRule).toMatch(/\bisolation\s*:\s*isolate\s*;/);
    expect(heroRule).toMatch(/\boverflow\s*:\s*hidden\s*;/);
    expect(layerRule).toMatch(/\bpointer-events\s*:\s*none\s*;/);
    expect(layerRule).toMatch(/\bz-index\s*:\s*1\s*;/);
    expect(copyRule).toMatch(/\bz-index\s*:\s*2\s*;/);
    expect(heroCueRule).toMatch(/\bz-index\s*:\s*2\s*;/);

    expect(indexCss).toMatch(
      /@media\s*\(max-width:\s*800px\)[\s\S]*\.hero-leaf:nth-child\(n \+ 16\)\s*\{\s*display:\s*none;\s*\}/,
    );
    expect(indexCss.match(/\.hero-leaf:nth-child\(n \+ 16\)/g) ?? []).toHaveLength(1);

    expect(indexCss).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.hero-leaf-layer\s*\{\s*display:\s*none;\s*\}/,
    );
  });
});
