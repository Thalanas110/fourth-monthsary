export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="hero-kicker fade-in">A small library for quiet hours</div>
        <h1 className="hero-title fade-in delay-1" id="hero-title">Find the<br /><em>right words.</em></h1>
        <p className="hero-description fade-in delay-2">
          Poems for the feeling you cannot quite name. Choose a mood, follow the light, and stay as long as you like.
        </p>
      </div>
      <div className="hero-rule fade-in delay-3"><span className="scroll-mark">↓</span> Scroll to choose a poem</div>
    </section>
  );
}
