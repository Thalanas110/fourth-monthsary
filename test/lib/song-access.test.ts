// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import {
  SONG_ACCESS_STORAGE_KEY,
  isMonthsaryPassword,
  readSongAccessFlag,
  readSongUnlockFlag,
  writeSongAccessFlag,
} from '@/lib/song-access';

afterEach(() => window.localStorage.clear());

describe('song access', () => {
  it('accepts configured full and short date formats without hardcoding the secret', () => {
    expect(isMonthsaryPassword('09-19-2026', '09-19-2026')).toBe(true);
    expect(isMonthsaryPassword('09-19-26', '09-19-2026')).toBe(true);
    expect(isMonthsaryPassword(' 09-19-26 ', '09-19-2026')).toBe(true);
    expect(isMonthsaryPassword('09/19/2026', '09-19-2026')).toBe(false);
    expect(isMonthsaryPassword('09-19-2025', '09-19-2026')).toBe(false);
  });

  it('fails closed when configuration is missing', () => {
    expect(isMonthsaryPassword('09-19-2026', '')).toBe(false);
    expect(isMonthsaryPassword('09-19-2026', undefined)).toBe(false);
  });

  it('reads and writes the separate password-access flag', () => {
    expect(SONG_ACCESS_STORAGE_KEY).toBe('poem-lantern:songs-access-granted');
    expect(readSongUnlockFlag()).toBe(false);
    expect(readSongAccessFlag()).toBe(false);
    window.localStorage.setItem('poem-lantern:songs-unlocked', 'true');
    expect(readSongUnlockFlag()).toBe(true);
    writeSongAccessFlag();
    expect(readSongAccessFlag()).toBe(true);
  });
});
