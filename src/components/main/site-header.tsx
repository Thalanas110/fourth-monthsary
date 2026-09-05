import { Heart } from 'lucide-react';
import { navigateToAnchor } from '@/lib/inertia';
import { getHomePath } from '@/lib/routes';

export interface SiteHeaderProps {
  favoriteCount: number;
  homePath?: string;
}

function withHomePath(homePath: string | undefined, hash: string) {
  if (!homePath) return hash;

  return `${getHomePath(homePath)}${hash}`;
}

function Logo({ homeHref }: { homeHref: string }) {
  return (
    <a className="wordmark" data-testid="link-home" href={homeHref} onClick={(event) => {
      event.preventDefault();
      navigateToAnchor(homeHref);
    }}>
      <span aria-hidden="true" className="lantern-mark" />
      <span className="wordmark-name">A Classic Surprise</span>
    </a>
  );
}

export function SiteHeader({ favoriteCount, homePath }: SiteHeaderProps) {
  const homeHref = withHomePath(homePath, '#top');
  const libraryHref = withHomePath(homePath, '#library');
  const ritualHref = withHomePath(homePath, '#ritual');

  return (
    <header className="topbar">
      <Logo homeHref={homeHref} />
      <nav aria-label="Primary navigation" className="nav-links">
        <a className="nav-link active" data-testid="link-find-a-poem" href={libraryHref} onClick={(event) => {
          event.preventDefault();
          navigateToAnchor(libraryHref);
        }}>Find a poem</a>
        <a className="nav-link" data-testid="link-about" href={ritualHref} onClick={(event) => {
          event.preventDefault();
          navigateToAnchor(ritualHref);
        }}>The ritual</a>
        <a className="saved-link" data-testid="link-saved-poems" href={libraryHref} onClick={(event) => {
          event.preventDefault();
          navigateToAnchor(libraryHref);
        }}>
          <Heart aria-hidden="true" size={13} />
          <span>Saved</span>
          <span className="saved-count" data-testid="text-saved-count">{favoriteCount}</span>
        </a>
      </nav>
    </header>
  );
}
