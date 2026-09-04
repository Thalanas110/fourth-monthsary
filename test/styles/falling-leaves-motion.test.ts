import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const indexCss = readFileSync(new URL('../../src/index.css', import.meta.url), 'utf8');

function readRule(css: string, selector: string): string {
  const escapedSelector = selector.replace(/[.*+?^{}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(escapedSelector + '\\s*\\{([^}]*)\\}'));

  expect(match, 'Expected ' + selector + ' to be declared').not.toBeNull();
  return match?.[1] ?? '';
}

describe('falling leaves motion CSS', () => {
  it('loops leaves through offscreen boundaries with compositor-only properties', () => {
    const leafRule = readRule(indexCss, '.hero-leaf');
    expect(leafRule).toMatch(/\banimation\s*:\s*leaf-fall\b/);
    expect(leafRule).toMatch(/\binfinite\b/);

    const animationStart = indexCss.indexOf('@keyframes leaf-fall');
    const animationEnd = indexCss.indexOf('\n@media', animationStart);
    const animationBlock = animationStart === -1
      ? ''
      : indexCss.slice(animationStart, animationEnd === -1 ? undefined : animationEnd);

    expect(animationBlock).toContain('translate3d(0, -18vh');
    expect(animationBlock).toContain('calc(100svh + 18vh)');
    expect(animationBlock).toMatch(/opacity\s*:\s*0/);
    expect(animationBlock).toMatch(/transform\s*:/);

    for (const property of ['top', 'left', 'width', 'height', 'background', 'clip-path']) {
      expect(animationBlock).not.toMatch(new RegExp('\\b' + property + '\\s*:'));
    }

    expect(indexCss).toContain('--leaf-duration: 18s;');
    expect(indexCss).toContain('--leaf-duration: 26s;');
  });
});
