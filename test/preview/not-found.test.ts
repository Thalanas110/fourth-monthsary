import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const previewPath = new URL('../../preview/not-found.html', import.meta.url);

describe('not-found direct-file preview', () => {
  it('contains a self-contained themed 404 page with clear exits', () => {
    expect(existsSync(previewPath)).toBe(true);
    if (!existsSync(previewPath)) return;

    const html = readFileSync(previewPath, 'utf8');

    expect(html).toContain('This page wandered off.');
    expect(html).toContain('Return to the lantern');
    expect(html).toContain('Find a poem');
      expect(html).toContain('../src/assets/scene.png');
    expect(html).not.toMatch(/<script\b/i);
    expect(html).not.toMatch(/(?:src|href)\s*=\s*["'][^"']*(?:https?:|\/\/)/i);
  });
});
