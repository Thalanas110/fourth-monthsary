import { useMemo, useState } from 'react';
import sceneImage from '@/assets/scene.png';
import { SiteHeader } from '@/components/site-header';
import { HeroSection } from '@/components/hero-section';
import { PoemLibrary } from '@/components/poem-library';
import { moods, poems, type Poem } from '@/data/poems';

export const APP_NAME = 'Poem Lantern';

export default function App() {
  const [selectedMood, setSelectedMood] = useState('All feelings');
  const [query, setQuery] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [openPoem, setOpenPoem] = useState<Poem | null>(null);
  const visiblePoems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return poems.filter((poem) => {
      const moodMatches = selectedMood === 'All feelings' || poem.mood === selectedMood;
      const queryMatches = !normalizedQuery || `${poem.title} ${poem.author} ${poem.mood} ${poem.excerpt}`.toLowerCase().includes(normalizedQuery);
      return moodMatches && queryMatches;
    });
  }, [query, selectedMood]);
  const toggleFavorite = (id: string) => setFavoriteIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return (
    <main className="app-shell" id="top">
      <img className="site-background" src={sceneImage} alt="" aria-hidden="true" />
      <div className="background-veil" aria-hidden="true" />
      <div className="page-content">
        <SiteHeader favoriteCount={0} />
        <HeroSection />
        <PoemLibrary favoriteIds={favoriteIds} moods={moods} onMoodChange={setSelectedMood} onOpen={setOpenPoem} onQueryChange={setQuery} onToggleFavorite={toggleFavorite} poems={visiblePoems} query={query} selectedMood={selectedMood} />
      </div>
    </main>
  );
}
