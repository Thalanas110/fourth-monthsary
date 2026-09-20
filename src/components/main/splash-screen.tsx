import { useEffect, useState } from 'react';

export const SPLASH_DURATION_MS = 1800;
export const SPLASH_FADE_MS = 450;

const SPLASH_LEAF_COUNT = 8;

export function SplashScreen() {
  const [hiding, setHiding] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRemoved(true);
      return;
    }
    const fadeTimer = window.setTimeout(() => setHiding(true), SPLASH_DURATION_MS);
    return () => window.clearTimeout(fadeTimer);
  }, []);

  useEffect(() => {
    if (!hiding) return;
    const guardTimer = window.setTimeout(() => setRemoved(true), SPLASH_FADE_MS);
    return () => window.clearTimeout(guardTimer);
  }, [hiding]);

  if (removed) return null;

  return (
    <div
      aria-hidden="true"
      className={hiding ? 'splash-screen splash-screen--hiding' : 'splash-screen'}
      onTransitionEnd={hiding ? () => setRemoved(true) : undefined}
    >
      <div aria-hidden="true" className="splash-leaf-set">
        {Array.from({ length: SPLASH_LEAF_COUNT }, (_, index) => <span className="splash-leaf" key={index} />)}
      </div>
      <div aria-hidden="true" className="splash-board">
        <span className="splash-glow" />
        <div className="splash-lantern">
          <span className="splash-flame" />
          <span className="splash-lantern-cap" />
        </div>
        <p className="splash-kicker">Lighting the lantern...</p>
        <p className="splash-title">Happy 4th monthsary</p>
      </div>
    </div>
  );
}