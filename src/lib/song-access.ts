export const SONG_UNLOCK_STORAGE_KEY = 'poem-lantern:songs-unlocked';
export const SONG_ACCESS_STORAGE_KEY = 'poem-lantern:songs-access-granted';

function readFlag(key: string) {
  if (typeof window === 'undefined') return false;

  try {
    return window.localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

export function readSongUnlockFlag() {
  return readFlag(SONG_UNLOCK_STORAGE_KEY);
}

export function writeSongUnlockFlag() {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(SONG_UNLOCK_STORAGE_KEY, 'true');
  } catch {
    // Storage is optional; the current session can still continue.
  }
}

export function readSongAccessFlag() {
  return readFlag(SONG_ACCESS_STORAGE_KEY);
}

export function writeSongAccessFlag() {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(SONG_ACCESS_STORAGE_KEY, 'true');
  } catch {
    // Storage is optional; the current session can still continue.
  }
}

export function isMonthsaryPassword(candidate: string, configuredPassword?: string) {
  const configured = configuredPassword?.trim() ?? '';
  const answer = candidate.trim();
  if (!configured || !answer) return false;

  const accepted = new Set([configured]);
  const fullDate = configured.match(/^(\d{2}-\d{2})-(\d{4})$/);
  const shortDate = configured.match(/^(\d{2}-\d{2})-(\d{2})$/);
  if (fullDate) accepted.add(`${fullDate[1]}-${fullDate[2].slice(-2)}`);
  if (shortDate) accepted.add(`${shortDate[1]}-20${shortDate[2]}`);

  return accepted.has(answer);
}
