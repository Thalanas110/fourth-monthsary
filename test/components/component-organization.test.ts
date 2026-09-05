import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const componentsRoot = new URL('../../src/components/', import.meta.url);
const componentMap = {
  errors: ['error-boundary.tsx'],
  main: ['ambient-field.tsx', 'hero-section.tsx', 'ritual-section.tsx', 'site-header.tsx'],
  poems: ['empty-results.tsx', 'mood-filter.tsx', 'poem-card.tsx', 'poem-library.tsx', 'poem-page.tsx', 'poem-reader.tsx', 'poem-search.tsx'],
} as const;

describe('component organization', () => {
  it('keeps components in their responsibility categories', () => {
    Object.entries(componentMap).forEach(([category, files]) => {
      files.forEach((file) => {
        const componentPath = new URL(`${category}/${file}`, componentsRoot);
        expect(existsSync(componentPath)).toBe(true);
        if (category === 'poems' && file === 'poem-page.tsx' && existsSync(componentPath)) {
          expect(readFileSync(componentPath, 'utf8')).toContain('data-testid="page-poem"');
        }
        expect(existsSync(new URL(file, componentsRoot))).toBe(false);
      });
    });
  });
});
