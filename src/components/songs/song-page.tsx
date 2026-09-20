import { ArrowLeft } from 'lucide-react';
import sceneImage from '@/assets/scene.png';
import { AmbientField } from '@/components/main/ambient-field';
import { FallingLeaves } from '@/components/main/falling-leaves';
import { SiteHeader } from '@/components/main/site-header';
import { SongAccessBoundary } from '@/components/songs/song-access-boundary';
import { SongPlayer } from '@/components/songs/song-player';
import type { Song } from '@/data/songs';
import { getSongsPath } from '@/lib/routes';
import NotFound from '@/pages/not-found';

export interface SongPageProps {
  basePath?: string;
  song?: Song;
}

export function SongPage({ basePath = import.meta.env.BASE_URL, song }: SongPageProps) {
  return (
    <main className="app-shell song-page-shell" id="top">
      <FallingLeaves />
      <img alt="" aria-hidden="true" className="site-background" src={sceneImage} />
      <div aria-hidden="true" className="background-veil" />
      <AmbientField />
      <div aria-hidden="true" className="grain" />
      <div className="page-content">
        <SiteHeader favoriteCount={0} homePath={basePath} />
        <SongAccessBoundary basePath={basePath}>
          {song ? (
            <article className="song-page" data-testid="page-song">
              <div className="song-page-topline">
                <a className="song-page-back" href={getSongsPath(basePath)}>
                  <ArrowLeft aria-hidden="true" size={14} />
                  Back to the songs
                </a>
                <span className="song-page-marker">A song for this hour</span>
              </div>

              <div className="song-page-layout">
                <header className="song-page-header">
                  <div className="song-page-eyebrow">
                    <span className="eyebrow">The hidden shelf</span>
                    <span className="song-page-kind">Song</span>
                  </div>
                  <h1 className="song-page-title">{song.title}</h1>
                  <p className="song-page-excerpt">{song.excerpt}</p>
                  <div className="song-page-byline">
                    <span>by {song.author}</span>
                    <span aria-hidden="true">·</span>
                    <span>{song.length}</span>
                  </div>
                </header>

                <div className="song-page-reading-column">
                  <div aria-hidden="true" className="song-page-rule" />
                  <SongPlayer song={song} />
                  <footer className="song-page-footer">
                    <p>Keep the song that found you.</p>
                  </footer>
                </div>
              </div>
            </article>
          ) : <NotFound />}
        </SongAccessBoundary>
      </div>
    </main>
  );
}
