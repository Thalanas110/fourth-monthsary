import { describe, expect, it } from 'vitest';
import { getSongsPath, isSongsPath } from '@/lib/routes';

describe('song routes', () => {
  it('builds songs paths at root and under a configured base path', () => {
    expect(getSongsPath()).toBe('/songs/');
    expect(getSongsPath('/monthsary/')).toBe('/monthsary/songs/');
  });

  it('matches songs paths with or without a trailing slash', () => {
    expect(isSongsPath('/songs')).toBe(true);
    expect(isSongsPath('/songs/')).toBe(true);
    expect(isSongsPath('/monthsary/songs/', '/monthsary/')).toBe(true);
    expect(isSongsPath('/poems/example')).toBe(false);
  });
});
