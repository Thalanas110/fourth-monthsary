import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const previewPath = new URL('../../preview/falling-leaves.html', import.meta.url);

describe('falling leaves direct-file preview', () => {
  it('contains a self-contained local preview with responsive motion rules', () => {
    expect(existsSync(previewPath)).toBe(true);
    if (!existsSync(previewPath)) return;

    const html = readFileSync(previewPath, 'utf8');

    expect(html.match(/class="hero-leaf"/g) ?? []).toHaveLength(30);
    expect(html).not.toMatch(/<script\b[^>]+\bsrc=/i);
    expect(html).not.toMatch(/(?:src|href)\s*=\s*["'][^"']*(?:https?:|\/\/)/i);
    expect(html).not.toMatch(/(?:url|@import)[^;{]*(?:https?:|\/\/)/i);
    expect(html).toContain('src="../src/assets/scene.png"');
    expect(html).toContain('@media (max-width: 800px)');
    expect(html).toContain('.hero-leaf:nth-child(n + 16) { display: none; }');
    expect(html).toContain('@media (prefers-reduced-motion: reduce)');
    expect(html).toMatch(/60fps|60 fps/i);
  });
});
