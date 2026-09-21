import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const redirectsPath = path.resolve(process.cwd(), 'public/_redirects');

describe('Netlify deployment routing', () => {
  it('falls back to the SPA entry point for client-side routes', () => {
    const redirects = readFileSync(redirectsPath, 'utf8');

    expect(redirects).toContain('/* /index.html 200');
  });
});
