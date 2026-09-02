import { useEffect } from 'react';
import { Check, Heart, X } from 'lucide-react';
import type { Poem } from '@/data/poems';

export interface PoemReaderProps {
  poem: Poem;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

export function PoemReader({ poem, isFavorite, onClose, onToggleFavorite }: PoemReaderProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKeyDown); };
  }, [onClose]);

  return (
    <div aria-label={`${poem.title} reader`} className="reader-overlay" data-testid="dialog-poem-reader" role="dialog">
      <div className="reader-panel">
        <button aria-label="Close poem reader" className="close-reader" data-testid="button-close-reader" onClick={onClose} type="button"><X aria-hidden="true" size={15} /></button>
        <span className="eyebrow">{poem.mood}</span>
        <h2 data-testid="text-reader-title">{poem.title}</h2>
        <div className="reader-byline" data-testid="text-reader-byline">by {poem.author} · {poem.length}</div>
        <p className="reader-lines" data-testid="text-reader-body">{poem.body}</p>
        <div className="reader-actions">
          <button className={`reader-action ${isFavorite ? 'is-favorite' : ''}`} data-testid="button-reader-favorite" onClick={() => onToggleFavorite(poem.id)} type="button">
            <Heart aria-hidden="true" fill={isFavorite ? 'currentColor' : 'none'} />
            {isFavorite ? 'Saved to your lantern' : 'Keep this one'}
          </button>
          <button className="reader-action" data-testid="button-reader-done" onClick={onClose} type="button"><Check aria-hidden="true" /> Close for now</button>
        </div>
      </div>
    </div>
  );
}
