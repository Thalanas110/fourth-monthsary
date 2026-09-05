import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const componentsRoot = new URL('../../src/components/', import.meta.url);
const componentMap = {
  errors: ['error-boundary.tsx'],
  main: ['ambient-field.tsx', 'hero-section.tsx', 'ritual-section.tsx', 'site-header.tsx'],
  poems: ['empty-results.tsx', 'mood-filter.tsx', 'poem-card.tsx', 'poem-library.tsx', 'poem-reader.tsx', 'poem-search.tsx'],
} as const;

describe('component organization', () => {
  it('keeps components in their responsibility categories', () => {
    Object.entries(componentMap).forEach(([category, files]) => {
      files.forEach((file) => {
        expect(existsSync(new URL(`${category}/${file}`, componentsRoot))).toBe(true);
        expect(existsSync(new URL(file, componentsRoot))).toBe(false);
      });
    });
  });
});
