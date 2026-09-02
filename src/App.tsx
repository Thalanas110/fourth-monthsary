import sceneImage from '@/assets/scene.png';
import { SiteHeader } from '@/components/site-header';
import { HeroSection } from '@/components/hero-section';
import { moods, poems } from '@/data/poems';

export const APP_NAME = 'Poem Lantern';

export default function App() {
  return (
    <main className="app-shell" id="top">
      <img className="site-background" src={sceneImage} alt="" aria-hidden="true" />
      <div className="background-veil" aria-hidden="true" />
      <div className="page-content">
        <SiteHeader favoriteCount={0} />
        <HeroSection />
        <section className="library-section" id="library" aria-labelledby="library-title">
          <div className="library-inner">
            <div className="section-head">
              <div><div className="eyebrow">The lantern room · {poems.length.toString().padStart(2, '0')} poems</div><h2 className="section-title" id="library-title">What are you carrying?</h2></div>
              <p className="section-note">There is no wrong door here.<br />Take the one that glows.</p>
            </div>
            <div className="poem-grid">
              {poems.map((poem) => <article className="poem-card" key={poem.id}><span className="card-mood">{poem.mood}</span><h3>{poem.title}</h3><p>{poem.excerpt}</p><span className="author">by {poem.author} · {poem.length}</span></article>)}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
