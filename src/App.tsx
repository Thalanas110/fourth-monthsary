import { useMemo, useState } from 'react';
import sceneImage from '@/assets/scene.png';
import { SiteHeader } from '@/components/site-header';
import { HeroSection } from '@/components/hero-section';
import { MoodFilter } from '@/components/mood-filter';
import { PoemCard } from '@/components/poem-card';
import { moods, poems, type Poem } from '@/data/poems';

export const APP_NAME = 'Poem Lantern';

export default function App() {
  const [selectedMood, setSelectedMood] = useState('All feelings');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [openPoem, setOpenPoem] = useState<Poem | null>(null);
  const visiblePoems = useMemo(() => poems.filter((poem) => selectedMood === 'All feelings' || poem.mood === selectedMood), [selectedMood]);
  const toggleFavorite = (id: string) => setFavoriteIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

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
            <div className="toolbar"><MoodFilter moods={moods} onSelect={setSelectedMood} selectedMood={selectedMood} /></div>
            <div className="poem-grid">
              {visiblePoems.map((poem) => <PoemCard isFavorite={favoriteIds.includes(poem.id)} key={poem.id} onOpen={setOpenPoem} onToggleFavorite={toggleFavorite} poem={poem} />)}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
