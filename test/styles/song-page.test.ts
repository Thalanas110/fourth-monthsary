import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8');

describe('song detail styles', () => {
  it('provides the reading layout, media panel, and responsive collapse', () => {
    expect(css).toContain('.song-page-layout {');
    expect(css).toContain('.song-page-audio {');
    expect(css).toContain('.song-page-body {');
    expect(css).toContain('@media (max-width: 800px)');
  });
});
