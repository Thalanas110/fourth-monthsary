import { useEffect, useState, type ReactNode } from 'react';
import { SongPasswordGate } from '@/components/songs/song-password-gate';
import { isMonthsaryPassword, readSongAccessFlag, readSongUnlockFlag, writeSongAccessFlag } from '@/lib/song-access';
import { navigateToPath } from '@/lib/inertia';
import { getHomePath } from '@/lib/routes';

export interface SongAccessBoundaryProps {
  basePath?: string;
  children: ReactNode;
}

type SongsAccessStatus = 'checking' | 'redirecting' | 'password' | 'granted';

function getInitialStatus(): SongsAccessStatus {
  if (typeof window === 'undefined') return 'checking';
  if (!readSongUnlockFlag()) return 'redirecting';
  return readSongAccessFlag() ? 'granted' : 'password';
}

export function SongAccessBoundary({ basePath = '/', children }: SongAccessBoundaryProps) {
  const [status, setStatus] = useState<SongsAccessStatus>(getInitialStatus);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (status === 'redirecting') navigateToPath(getHomePath(basePath));
  }, [basePath, status]);

  const handlePasswordSubmit = (candidate: string) => {
    if (isMonthsaryPassword(candidate, import.meta.env.VITE_MONTHSARY_PASSWORD)) {
      writeSongAccessFlag();
      setError(undefined);
      setStatus('granted');
      return;
    }

    setError(import.meta.env.VITE_MONTHSARY_PASSWORD
      ? 'That answer is not quite right.'
      : 'The answer is unavailable right now.');
  };

  if (status === 'checking') return <p className="songs-route-status">Lighting the way...</p>;
  if (status === 'redirecting') {
    return <p className="songs-route-status" data-testid="songs-route-redirecting">Returning to the lantern...</p>;
  }
  if (status === 'password') return <SongPasswordGate error={error} onSubmit={handlePasswordSubmit} />;
  return <>{children}</>;
}
