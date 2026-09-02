import { ArrowRight, Heart } from 'lucide-react';
import type { Poem } from '@/data/poems';

export interface PoemCardProps {
  poem: Poem;
  isFavorite: boolean;
  onOpen: (poem: Poem) => void;
  onToggleFavorite: (id: string) => void;
}

export function PoemCard({ poem, isFavorite, onOpen, onToggleFavorite }: PoemCardProps) {
  return (
    <article className="poem-card fade-in" data-testid={`card-poem-${poem.id}`}>
      <div className="card-top">
        <span className="card-mood" data-testid={`text-mood-${poem.id}`}>{poem.mood}</span>
        <button
          aria-label={isFavorite ? `Remove ${poem.title} from saved poems` : `Save ${poem.title}`}
          className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
          data-testid={`button-favorite-${poem.id}`}
          onClick={() => onToggleFavorite(poem.id)}
          type="button"
        >
          <Heart aria-hidden="true" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <h3 data-testid={`text-title-${poem.id}`}>{poem.title}</h3>
      <p data-testid={`text-excerpt-${poem.id}`}>{poem.excerpt}</p>
      <div className="card-footer">
        <span className="author" data-testid={`text-author-${poem.id}`}>by {poem.author} · {poem.length}</span>
        <button className="read-button" data-testid={`button-read-${poem.id}`} onClick={() => onOpen(poem)} type="button">
          Read <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
