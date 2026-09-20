import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const indexCss = readFileSync(new URL('../../src/index.css', import.meta.url), 'utf8');

describe('splash screen CSS', () => {
  it('styles the veil, lantern, flame glow, and a deterministic 8-leaf drift', () => {
    expect(indexCss).toMatch(/\.splash-screen\s*\{/);

    const screenRule = indexCss.match(/\.splash-screen\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(screenRule).toMatch(/\bposition\s*:\s*fixed\s*;/);
    expect(screenRule).toMatch(/\btransition\s*:\s*opacity\s+450ms\s+.*;/);
    expect(screenRule).toMatch(/\bpointer-events\s*:\s*none\s*;/);

    expect(indexCss).toMatch(/\.splash-screen--hiding\s*\{\s*opacity:\s*0\s*;\s*\}/);
    expect(indexCss).toMatch(/\.splash-leaf-set\s*\{/);
    expect(indexCss).toMatch(/\.splash-lantern\s*\{/);
    expect(indexCss).toMatch(/\.splash-flame\s*\{/);
    expect(indexCss).toMatch(/\.splash-glow\s*\{/);

    const leafRule = indexCss.match(/\.splash-leaf\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(leafRule).toMatch(/\bposition\s*:\s*absolute\s*;/);
    expect(leafRule).toMatch(/\bclip-path\s*:/);
    expect(leafRule).not.toMatch(/\bfilter\s*:/);
    expect(leafRule).not.toMatch(/\bbox-shadow\s*:/);

    const flameRule = indexCss.match(/\.splash-flame\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(flameRule).toMatch(/\banimation\s*:\s*splash-flame-flicker\b/);
    expect(flameRule).not.toMatch(/\btransition\b/);

    expect(indexCss).toMatch(/@keyframes splash-fall/);
    expect(indexCss).toMatch(/@keyframes splash-flame-flicker/);
    expect(indexCss).toMatch(/@keyframes splash-glow-bloom/);

    const leafBlocks = [...indexCss.matchAll(/\.splash-leaf:nth-child\((\d+)\)\s*\{([^}]*)\}/g)];
    expect(leafBlocks).toHaveLength(8);
    expect(new Set(leafBlocks.map(([, index]) => Number(index))).size).toBe(8);

    const opacities = ['.35', '.45', '.55', '.65'];
    const colors = ['#8f4f32', '#a7663a', '#b4773d', '#6e3d2c'];
    for (let i = 1; i <= 8; i += 1) {
      const declarations = leafBlocks.find(([, index]) => Number(index) === i)?.[2] ?? '';
      expect(declarations).toContain(`--splash-leaf-left: ${((i * 47) % 88) + 4}%;`);
      expect(declarations).toContain(`--splash-leaf-delay: -${(i * 237) % 1600}ms;`);
      expect(declarations).toContain(`--splash-leaf-duration: ${1400 + ((i * 41) % 401)}ms;`);
      expect(declarations).toContain(`--splash-leaf-drift: ${((i * 29) % 23) - 11}vw;`);
      expect(declarations).toContain(`--splash-leaf-size: ${9 + ((i * 3) % 5)}px;`);
      expect(declarations).toContain(`--splash-leaf-opacity: ${opacities[i % 4]};`);
      expect(declarations).toContain(`--splash-leaf-color: ${colors[i % 4]};`);
    }
  });
});