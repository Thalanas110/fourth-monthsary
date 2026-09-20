import { useEffect, useState } from 'react';
import sceneImage from '@/assets/scene.png';
import { SiteHeader } from '@/components/main/site-header';
import { SongLibrary } from '@/components/songs/song-library';
import { SongPasswordGate } from '@/components/songs/song-password-gate';
import { songs } from '@/data/songs';
import { navigateToPath } from '@/lib/inertia';
import {
  getHomePath,
} from '@/lib/routes';
import { isMonthsaryPassword, readSongAccessFlag, readSongUnlockFlag, writeSongAccessFlag } from '@/lib/song-access';

export interface SongsPageProps {
  basePath?: string;
}

type SongsPageStatus = 'checking' | 'redirecting' | 'password' | 'granted';

function getInitialStatus(): SongsPageStatus {
  if (typeof window === 'undefined') return 'checking';
  if (!readSongUnlockFlag()) return 'redirecting';
  return readSongAccessFlag() ? 'granted' : 'password';
}

export default function SongsPage({ basePath = '/' }: SongsPageProps) {
  const [status, setStatus] = useState<SongsPageStatus>(getInitialStatus);
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

    setError(import.meta.env.VITE_MONTHSARY_PASSWORD ? 'That answer is not quite right.' : 'The answer is unavailable right now.');
  };

  return (
    <main className="app-shell songs-page" data-testid="page-songs" id="top">
      <img className="site-background" src={sceneImage} alt="" aria-hidden="true" />
      <div className="background-veil" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="page-content songs-page-shell">
        <SiteHeader favoriteCount={0} homePath={basePath} />
        {status === 'checking' && <p className="songs-route-status">Lighting the way...</p>}
        {status === 'redirecting' && <p className="songs-route-status" data-testid="songs-route-redirecting">Returning to the lantern...</p>}
        {status === 'password' && <SongPasswordGate error={error} onSubmit={handlePasswordSubmit} />}
        {status === 'granted' && <SongLibrary songs={songs} />}
      </div>
    </main>
  );
}
