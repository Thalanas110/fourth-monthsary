import sceneImage from '@/assets/scene.png';
import { SiteHeader } from '@/components/main/site-header';
import { SongAccessBoundary } from '@/components/songs/song-access-boundary';
import { SongLibrary } from '@/components/songs/song-library';
import { songs } from '@/data/songs';

export interface SongsPageProps {
  basePath?: string;
}

export default function SongsPage({ basePath = '/' }: SongsPageProps) {
  return (
    <main className="app-shell songs-page" data-testid="page-songs" id="top">
      <img className="site-background" src={sceneImage} alt="" aria-hidden="true" />
      <div className="background-veil" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="page-content songs-page-shell">
        <SiteHeader favoriteCount={0} homePath={basePath} />
        <SongAccessBoundary basePath={basePath}>
          <SongLibrary basePath={basePath} songs={songs} />
        </SongAccessBoundary>
      </div>
    </main>
  );
}
