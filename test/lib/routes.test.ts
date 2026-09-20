import { describe, expect, it } from 'vitest';
import { getSongId, getSongPath, getSongsPath, isSongsIndexPath, isSongsPath } from '@/lib/routes';

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

  it('builds and reads song detail paths', () => {
    expect(getSongPath('test-song')).toBe('/songs/test-song');
    expect(getSongId('/songs/test-song')).toBe('test-song');
    expect(getSongId('/songs/test-song/')).toBe('test-song');
  });

  it('preserves the configured base path and recognizes descendants', () => {
    expect(getSongPath('test-song', '/monthsary/')).toBe('/monthsary/songs/test-song');
    expect(getSongId('/monthsary/songs/test-song', '/monthsary/')).toBe('test-song');
    expect(isSongsPath('/monthsary/songs/test-song', '/monthsary/')).toBe(true);
    expect(isSongsIndexPath('/monthsary/songs/', '/monthsary/')).toBe(true);
  });

  it('does not treat malformed song descendants as a detail id', () => {
    expect(getSongId('/songs/a/b')).toBe(null);
    expect(isSongsIndexPath('/songs/test-song')).toBe(false);
  });
});
