import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const faviconPath = path.resolve(process.cwd(), 'public/favicon.svg');

describe('lantern favicon', () => {
  it('uses the lantern mark instead of the former solid square', () => {
    const favicon = readFileSync(faviconPath, 'utf8');

    expect(favicon).toContain('id="lantern-frame"');
    expect(favicon).toContain('id="lantern-flame"');
    expect(favicon).not.toContain('fill="#FF3C00"');
  });
});
