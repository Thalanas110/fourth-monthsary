import { Heart } from 'lucide-react';
import { navigateToAnchor } from '@/lib/inertia';

export interface SiteHeaderProps {
  favoriteCount: number;
}

function Logo() {
  return (
    <a className="wordmark" data-testid="link-home" href="#top" onClick={(event) => {
      event.preventDefault();
      navigateToAnchor('#top');
    }}>
      <span aria-hidden="true" className="lantern-mark" />
      <span className="wordmark-name">A Classic Surprise</span>
    </a>
  );
}

export function SiteHeader({ favoriteCount }: SiteHeaderProps) {
  return (
    <header className="topbar">
      <Logo />
      <nav aria-label="Primary navigation" className="nav-links">
        <a className="nav-link active" data-testid="link-find-a-poem" href="#library" onClick={(event) => {
          event.preventDefault();
          navigateToAnchor('#library');
        }}>Find a poem</a>
        <a className="nav-link" data-testid="link-about" href="#ritual" onClick={(event) => {
          event.preventDefault();
          navigateToAnchor('#ritual');
        }}>The ritual</a>
        <a className="saved-link" data-testid="link-saved-poems" href="#library" onClick={(event) => {
          event.preventDefault();
          navigateToAnchor('#library');
        }}>
          <Heart aria-hidden="true" size={13} />
          <span>Saved</span>
          <span className="saved-count" data-testid="text-saved-count">{favoriteCount}</span>
        </a>
      </nav>
    </header>
  );
}
