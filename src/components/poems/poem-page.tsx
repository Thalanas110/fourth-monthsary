import { ArrowLeft, Heart } from 'lucide-react';
import sceneImage from '@/assets/scene.png';
import { AmbientField } from '@/components/main/ambient-field';
import { SiteHeader } from '@/components/main/site-header';
import type { Poem } from '@/data/poems';
import { useFavoritePoems } from '@/hooks/use-favorite-poems';
import { useToastMessage } from '@/hooks/use-toast-message';
import { getLibraryPath } from '@/lib/routes';

export interface PoemPageProps {
  poem: Poem;
  basePath?: string;
}

export default function PoemPage({ basePath = import.meta.env.BASE_URL, poem }: PoemPageProps) {
  const { favoriteIds, toggleFavorite } = useFavoritePoems();
  const { message, show } = useToastMessage();
  const isFavorite = favoriteIds.includes(poem.id);
  const isSong = poem.kind === 'song';
  const handleToggleFavorite = () => {
    toggleFavorite(poem.id);
    show(isFavorite ? `${poem.title} left your saved poems` : `${poem.title} saved for later`);
  };

  return (
    <main className="app-shell poem-page-shell" id="top">
      <img alt="" aria-hidden="true" className="site-background" src={sceneImage} />
      <div aria-hidden="true" className="background-veil" />
      <AmbientField />
      <div aria-hidden="true" className="grain" />
      <div className="page-content">
        <SiteHeader favoriteCount={favoriteIds.length} homePath={basePath} />
        <article className="poem-page" data-piece-kind={poem.kind} data-testid="page-poem">
          <div className="poem-page-topline">
            <a className="poem-page-back" href={getLibraryPath(basePath)}>
              <ArrowLeft aria-hidden="true" size={14} />
              Back to the lantern room
            </a>
            <span className="poem-page-marker">A piece for this hour</span>
          </div>

          <div className="poem-page-layout">
            <header className="poem-page-header">
              <div className="poem-page-eyebrow">
                <span className="eyebrow">{poem.mood}</span>
                <span className="poem-page-kind">{isSong ? 'Song' : 'Poem'}</span>
              </div>
              <h1 className="poem-page-title">{poem.title}</h1>
              <p className="poem-page-excerpt">{poem.excerpt}</p>
              <div className="poem-page-byline">
                <span>by {poem.author}</span>
                <span aria-hidden="true">·</span>
                <span>{poem.length}</span>
              </div>
            </header>

            <div className="poem-page-reading-column">
              <div aria-hidden="true" className="poem-page-rule" />
              <p className="poem-page-body" data-testid="text-poem-body">{poem.body}</p>
              <footer className="poem-page-footer">
                <p>{isSong ? 'Keep the melody close.' : 'Keep the line that found you.'}</p>
                <button
                  aria-pressed={isFavorite}
                  className={`poem-page-save ${isFavorite ? 'is-favorite' : ''}`}
                  data-testid="button-page-favorite"
                  onClick={handleToggleFavorite}
                  type="button"
                >
                  <Heart aria-hidden="true" fill={isFavorite ? 'currentColor' : 'none'} size={15} />
                  {isFavorite ? 'Saved to your lantern' : 'Keep this one'}
                </button>
              </footer>
            </div>
          </div>
        </article>
      </div>
      {message && <div className="toast-message" data-testid="status-page-toast" role="status">{message}</div>}
    </main>
  );
}
