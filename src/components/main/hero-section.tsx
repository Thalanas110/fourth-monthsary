export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-leaf-layer" aria-hidden="true">
        {Array.from({ length: 30 }, (_, index) => <span className="hero-leaf" key={index} />)}
      </div>
      <div className="hero-copy">
        <div className="hero-kicker fade-in">A fourth monthsary suite</div>
        <h1 className="hero-title fade-in delay-1" id="hero-title">Happy 4th<br /><em>monthsary, my madame :DD</em></h1>
        <p className="hero-description fade-in delay-2">
          A random surprise collection for our fourth monthsary, just for you.
        </p>
      </div>
      <div className="hero-rule fade-in delay-3"><span className="scroll-mark">↓</span> Scroll to choose a poem</div>
    </section>
  );
}
