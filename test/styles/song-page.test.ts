import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8');

describe('song detail styles', () => {
  it('provides the reading layout and industrial player system', () => {
    expect(css).toContain('.song-page-layout {');
    expect(css).toContain('.song-player {');
    expect(css).toContain('background: #0B0C0A;');
    expect(css).toContain('font-family: var(--app-font-mono);');
    expect(css).toContain('.song-player-lyrics {');
    expect(css).toContain('@media (max-width: 800px)');
  });
});
