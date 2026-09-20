import { useCallback, useEffect, useRef, useState } from 'react';

export const SONG_UNLOCK_STORAGE_KEY = 'poem-lantern:songs-unlocked';
export const SONG_UNLOCK_CLICK_COUNT = 7;
export const SONG_UNLOCK_WINDOW_MS = 2000;

export function useSongUnlock() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [progress, setProgress] = useState(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      setIsUnlocked(window.localStorage.getItem(SONG_UNLOCK_STORAGE_KEY) === 'true');
    } catch {
      setIsUnlocked(false);
    }
  }, []);

  useEffect(() => () => {
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
  }, []);

  const clickLantern = useCallback(() => {
    if (isUnlocked) return;

    setProgress((current) => {
      const next = current + 1;

      if (next >= SONG_UNLOCK_CLICK_COUNT) {
        setIsUnlocked(true);
        try {
          window.localStorage.setItem(SONG_UNLOCK_STORAGE_KEY, 'true');
        } catch {
          // Storage is optional; the in-memory unlock still works.
        }
        return SONG_UNLOCK_CLICK_COUNT;
      }

      if (resetTimer.current) window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setProgress(0), SONG_UNLOCK_WINDOW_MS);
      return next;
    });
  }, [isUnlocked]);

  return { clickLantern, isUnlocked, progress };
}
