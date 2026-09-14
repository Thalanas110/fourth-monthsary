import { useEffect, useRef } from 'react';

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function useHeroScrollFade<THero extends HTMLElement = HTMLElement, TTransition extends HTMLElement = HTMLElement>() {
  const heroRef = useRef<THero | null>(null);
  const transitionRef = useRef<TTransition | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const transition = transitionRef.current;
    if (!hero || !transition) return;

    let frame: number | null = null;
    const update = () => {
      frame = null;
      const progress = clamp((window.innerHeight - hero.getBoundingClientRect().bottom) / Math.max(window.innerHeight * 0.55, 1));
      transition.style.setProperty('--hero-transition-progress', progress.toFixed(3));
      transition.style.setProperty('--hero-transition-opacity', (0.38 + progress * 0.62).toFixed(3));
    };
    const schedule = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return { heroRef, transitionRef };
}
