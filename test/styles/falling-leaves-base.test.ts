import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const indexCss = readFileSync(new URL('../../src/index.css', import.meta.url), 'utf8');

function readRule(css: string, selector: string): string {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`));

  expect(match, `Expected ${selector} to be declared`).not.toBeNull();
  return match?.[1] ?? '';
}

describe('falling leaves base CSS', () => {
  it('specifies the autumn leaf silhouette and deterministic leaf values', () => {
    expect(indexCss).toMatch(/\.hero-leaf-layer\s*\{/);
    expect(indexCss).toMatch(/\.hero-leaf\s*\{/);

    const leafRule = readRule(indexCss, '.hero-leaf');
    expect(leafRule).toMatch(/\bposition\s*:\s*absolute\s*;/);
    expect(leafRule).toMatch(/\bclip-path\s*:/);
    expect(leafRule).not.toMatch(/\bfilter\s*:/);
    expect(leafRule).not.toMatch(/\bbox-shadow\s*:/);

    const leafBlocks = [
      ...indexCss.matchAll(/\.hero-leaf:nth-child\((\d+)\)\s*\{([^}]*)\}/g),
    ];
    const declarationsByIndex = new Map(
      leafBlocks.map(([, index, declarations]) => [Number(index), declarations]),
    );

    expect(leafBlocks).toHaveLength(30);
    expect([...declarationsByIndex.keys()].sort((a, b) => a - b)).toEqual(
      Array.from({ length: 30 }, (_, index) => index + 1),
    );

    const opacities = ['.40', '.46', '.52', '.58'];
    const colors = ['#8f4f32', '#a7663a', '#b4773d', '#6e3d2c'];

    for (let i = 1; i <= 30; i += 1) {
      const declarations = declarationsByIndex.get(i) ?? '';

      expect(declarations).toContain(`--leaf-left: ${((i * 37) % 94) + 2}%;`);
      expect(declarations).toContain(`--leaf-delay: -${(i * 13) % 18}s;`);
      expect(declarations).toContain(`--leaf-duration: ${18 + ((i * 7) % 9)}s;`);
      expect(declarations).toContain(`--leaf-drift: ${((i * 17) % 41) - 20}vw;`);
      expect(declarations).toContain(`--leaf-size: ${10 + ((i * 5) % 8)}px;`);
      expect(declarations).toContain(`--leaf-start-rotation: ${((i * 29) % 70) - 35}deg;`);
      expect(declarations).toContain(`--leaf-end-rotation: ${180 + ((i * 31) % 160)}deg;`);
      expect(declarations).toContain(`--leaf-opacity: ${opacities[i % 4]};`);
      expect(declarations).toContain(`--leaf-color: ${colors[i % 4]};`);
    }
  });
});
