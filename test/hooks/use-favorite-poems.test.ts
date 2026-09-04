import { describe, expect, it } from 'vitest';
import { FAVORITES_STORAGE_KEY, readFavoriteIds } from '@/hooks/use-favorite-poems';

describe('favorite storage', () => {
  it('uses the stable key and falls back on invalid JSON', () => {
    expect(FAVORITES_STORAGE_KEY).toBe('poem-lantern-favorites');
    expect(readFavoriteIds('{not json')).toEqual([]);
  });
});
