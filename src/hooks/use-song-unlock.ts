import { useCallback, useEffect, useRef, useState } from 'react';
import { readSongUnlockFlag, writeSongUnlockFlag } from '@/lib/song-access';

export { SONG_UNLOCK_STORAGE_KEY } from '@/lib/song-access';
export const SONG_UNLOCK_CLICK_COUNT = 7;
export const SONG_UNLOCK_WINDOW_MS = 2000;

export function useSongUnlock() {
  const [isUnlocked, setIsUnlocked] = useState(readSongUnlockFlag);
  const [progress, setProgress] = useState(0);
  const resetTimer = useRef<number | null>(null);
  const progressRef = useRef(0);

  useEffect(() => () => {
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
  }, []);

  const clickLantern = useCallback(() => {
    if (isUnlocked) return false;

    const next = progressRef.current + 1;
    progressRef.current = next;

    if (next >= SONG_UNLOCK_CLICK_COUNT) {
      setIsUnlocked(true);
      setProgress(SONG_UNLOCK_CLICK_COUNT);
      writeSongUnlockFlag();
      return true;
    }

    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      progressRef.current = 0;
      setProgress(0);
    }, SONG_UNLOCK_WINDOW_MS);
    setProgress(next);
    return false;
  }, [isUnlocked]);

  return { clickLantern, isUnlocked, progress };
}
