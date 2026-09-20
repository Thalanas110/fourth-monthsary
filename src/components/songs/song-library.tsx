import { ArrowRight } from 'lucide-react';
import type { Song } from '@/data/songs';
import { getSongPath } from '@/lib/routes';

export interface SongLibraryProps {
  basePath?: string;
  songs: Song[];
}

export function SongLibrary({ basePath = import.meta.env.BASE_URL, songs }: SongLibraryProps) {
  return (
    <section aria-labelledby="songs-title" className="songs-section" data-testid="song-library" id="songs">
      <div className="songs-inner">
        <header className="songs-header">
          <div>
            <div className="eyebrow">The hidden shelf</div>
            <h2 className="songs-title" id="songs-title">Songs unlocked.</h2>
          </div>
          <p className="songs-note">A quieter companion for the poems above.</p>
        </header>
        {songs.length === 0 ? (
          <p className="songs-empty">No songs have been added yet.</p>
        ) : (
          <div className="song-grid">
            {songs.map((song) => (
              <article className="song-card" data-testid={`song-card-${song.id}`} key={song.id}>
                <div className="song-card-top">
                  <span className="piece-kind">Song</span>
                  <span className="song-length">{song.length}</span>
                </div>
                <h3 className="song-title">{song.title}</h3>
                <p className="song-excerpt">{song.excerpt}</p>
                <div className="card-footer">
                  <span className="song-author">by {song.author} · {song.length}</span>
                  <a aria-label={`Listen to ${song.title}`} className="read-button" data-testid={`link-listen-${song.id}`} href={getSongPath(song.id, basePath)}>
                    Listen <ArrowRight aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
