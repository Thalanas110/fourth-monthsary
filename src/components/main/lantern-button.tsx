export interface LanternButtonProps {
  className?: string;
  isUnlocked?: boolean;
  onClick: () => void;
  placement: 'header' | 'hero';
}

export function LanternButton({ className = '', isUnlocked = false, onClick, placement }: LanternButtonProps) {
  return (
    <button
      aria-label={isUnlocked ? 'Songs unlocked' : 'Unlock songs'}
      aria-pressed={isUnlocked}
      className={`lantern-button lantern-button--${placement} ${className}`.trim()}
      data-testid={`${placement}-lantern`}
      onClick={onClick}
      type="button"
    >
      <span aria-hidden="true" className="lantern-button-cap" />
      <span aria-hidden="true" className="lantern-button-flame" />
      <span className="sr-only">{isUnlocked ? 'Songs unlocked' : 'Tap seven times to unlock songs'}</span>
    </button>
  );
}
