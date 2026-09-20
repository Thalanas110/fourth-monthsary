import { Heart } from 'lucide-react';
import { LanternButton } from '@/components/main/lantern-button';
import { navigateToAnchor } from '@/lib/inertia';
import { getHomePath } from '@/lib/routes';

export interface SiteHeaderProps {
  favoriteCount: number;
  homePath?: string;
  isSongsUnlocked?: boolean;
  onLanternClick?: () => void;
}

function withHomePath(homePath: string | undefined, hash: string) {
  if (!homePath) return hash;

  return `${getHomePath(homePath)}${hash}`;
}

function Logo({ homeHref, isSongsUnlocked, onLanternClick }: { homeHref: string; isSongsUnlocked: boolean; onLanternClick: () => void }) {
  return (
    <div className="wordmark">
      <LanternButton isUnlocked={isSongsUnlocked} onClick={onLanternClick} placement="header" />
      <a data-testid="link-home" href={homeHref} onClick={(event) => {
        event.preventDefault();
        navigateToAnchor(homeHref);
      }}>
        <span className="wordmark-name">A Classic Surprise</span>
      </a>
    </div>
  );
}

export function SiteHeader({ favoriteCount, homePath, isSongsUnlocked = false, onLanternClick = () => undefined }: SiteHeaderProps) {
  const homeHref = withHomePath(homePath, '#top');
  const libraryHref = withHomePath(homePath, '#library');
  const ritualHref = withHomePath(homePath, '#ritual');

  return (
    <header className="topbar">
      <Logo homeHref={homeHref} isSongsUnlocked={isSongsUnlocked} onLanternClick={onLanternClick} />
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
