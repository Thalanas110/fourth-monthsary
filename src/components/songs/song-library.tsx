import type { Song } from '@/data/songs';

export interface SongLibraryProps {
  songs: Song[];
}

export function SongLibrary({ songs }: SongLibraryProps) {
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
                <p className="song-author">by {song.author}</p>
                <audio aria-label={`Play ${song.title}`} controls preload="none" src={song.audioSrc} />
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
