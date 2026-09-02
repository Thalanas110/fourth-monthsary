import { useMemo, useState } from 'react';
import sceneImage from '@/assets/scene.png';
import { SiteHeader } from '@/components/site-header';
import { HeroSection } from '@/components/hero-section';
import { PoemLibrary } from '@/components/poem-library';
import { PoemReader } from '@/components/poem-reader';
import { AmbientField } from '@/components/ambient-field';
import { RitualSection } from '@/components/ritual-section';
import { useFavoritePoems } from '@/hooks/use-favorite-poems';
import { useToastMessage } from '@/hooks/use-toast-message';
import { moods, poems, type Poem } from '@/data/poems';

export const APP_NAME = 'Poem Lantern';

export default function App() {
  const [selectedMood, setSelectedMood] = useState('All feelings');
  const [query, setQuery] = useState('');
  const [openPoem, setOpenPoem] = useState<Poem | null>(null);
  const { favoriteIds, toggleFavorite } = useFavoritePoems();
  const { message, show } = useToastMessage();
  const visiblePoems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return poems.filter((poem) => {
      const moodMatches = selectedMood === 'All feelings' || poem.mood === selectedMood;
      const queryMatches = !normalizedQuery || `${poem.title} ${poem.author} ${poem.mood} ${poem.excerpt}`.toLowerCase().includes(normalizedQuery);
      return moodMatches && queryMatches;
    });
  }, [query, selectedMood]);
  const handleToggleFavorite = (id: string) => {
    const poem = poems.find((item) => item.id === id);
    const alreadySaved = favoriteIds.includes(id);
    toggleFavorite(id);
    if (poem) show(alreadySaved ? `${poem.title} left your saved poems` : `${poem.title} saved for later`);
  };

  return (
    <main className="app-shell" id="top">
      <img className="site-background" src={sceneImage} alt="" aria-hidden="true" />
      <div className="background-veil" aria-hidden="true" />
      <AmbientField />
      <div className="page-content">
        <SiteHeader favoriteCount={favoriteIds.length} />
        <HeroSection />
        <PoemLibrary favoriteIds={favoriteIds} moods={moods} onMoodChange={setSelectedMood} onOpen={setOpenPoem} onQueryChange={setQuery} onToggleFavorite={handleToggleFavorite} poems={visiblePoems} query={query} selectedMood={selectedMood} />
        <RitualSection />
      </div>
      {openPoem && <PoemReader isFavorite={favoriteIds.includes(openPoem.id)} onClose={() => setOpenPoem(null)} onToggleFavorite={handleToggleFavorite} poem={openPoem} />}
      {message && <div className="toast-message" data-testid="status-favorite-toast" role="status">{message}</div>}
    </main>
  );
}
