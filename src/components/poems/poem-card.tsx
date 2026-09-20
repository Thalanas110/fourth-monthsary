import { ArrowRight, Heart } from 'lucide-react';
import type { Poem } from '@/data/poems';
import { getPoemPath } from '@/lib/routes';

export interface PoemCardProps {
  basePath?: string;
  poem: Poem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export function PoemCard({ basePath = import.meta.env.BASE_URL, poem, isFavorite, onToggleFavorite }: PoemCardProps) {
  return (
    <article className="poem-card" data-reveal="true" data-testid={`card-poem-${poem.id}`}>
      <div className="card-top">
        <span className="card-mood" data-testid={`text-mood-${poem.id}`}>{poem.mood}</span>
        <div className="card-tools">
          <span className="piece-kind" data-testid={`text-kind-${poem.id}`}>Poem</span>
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
      </div>
      <h3 data-testid={`text-title-${poem.id}`}>{poem.title}</h3>
      <p data-testid={`text-excerpt-${poem.id}`}>{poem.excerpt}</p>
      <div className="card-footer">
        <span className="author" data-testid={`text-author-${poem.id}`}>by {poem.author} · {poem.length}</span>
        <a aria-label={`Read ${poem.title}`} className="read-button" data-testid={`link-read-${poem.id}`} href={getPoemPath(poem.id, basePath)}>
          Read <ArrowRight aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
