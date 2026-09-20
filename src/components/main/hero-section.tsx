import { useHeroScrollFade } from '@/hooks/use-hero-scroll-fade';
import { FallingLeaves } from '@/components/main/falling-leaves';
import { LanternButton } from '@/components/main/lantern-button';

export interface HeroSectionProps {
  isSongsUnlocked?: boolean;
  onLanternClick?: () => void;
}

export function HeroSection({ isSongsUnlocked = false, onLanternClick = () => undefined }: HeroSectionProps) {
  const { heroRef, transitionRef } = useHeroScrollFade<HTMLElementTagNameMap['section'], HTMLElementTagNameMap['div']>();

  return (
    <>
    <section className="hero" ref={heroRef} aria-labelledby="hero-title">
      <FallingLeaves />
      <div className="hero-copy">
        <div className="hero-kicker fade-in">A fourth monthsary suite</div>
        <h1 className="hero-title fade-in delay-1" id="hero-title">Happy 4th<br /><em>monthsary, my madame :DD</em></h1>
        <p className="hero-description fade-in delay-2">
          A random surprise collection for our fourth monthsary, just for you.
        </p>
      </div>
      <div className="hero-lantern-wrap fade-in delay-2">
        <LanternButton isUnlocked={isSongsUnlocked} onClick={onLanternClick} placement="hero" />
      </div>
      <div className="hero-rule fade-in delay-3"><span className="scroll-mark">↓</span> Scroll to choose a poem</div>
    </section>
    <div className="hero-transition" ref={transitionRef} aria-hidden="true" />
    </>
  );
}
