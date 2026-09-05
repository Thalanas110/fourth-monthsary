import { EmptyResults } from '@/components/poems/empty-results';
import { MoodFilter } from '@/components/poems/mood-filter';
import { PoemCard } from '@/components/poems/poem-card';
import { PoemSearch } from '@/components/poems/poem-search';
import type { Poem } from '@/data/poems';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

export interface PoemLibraryProps {
  poems: Poem[];
  moods: string[];
  selectedMood: string;
  query: string;
  favoriteIds: string[];
  onMoodChange: (mood: string) => void;
  onQueryChange: (query: string) => void;
  onOpen: (poem: Poem) => void;
  onToggleFavorite: (id: string) => void;
}

export function PoemLibrary({ poems, moods, selectedMood, query, favoriteIds, onMoodChange, onQueryChange, onOpen, onToggleFavorite }: PoemLibraryProps) {
  const poemGridRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="library-section" id="library" aria-labelledby="library-title">
      <div className="library-inner">
        <div className="section-head">
          <div><div className="eyebrow">The lantern room &middot; 09 pieces</div><h2 className="section-title" id="library-title">What are you carrying?</h2></div>
          <p className="section-note">Seven poems. Two songs.<br />Take the one that glows.</p>
        </div>
        <div className="toolbar">
          <MoodFilter moods={moods} onSelect={onMoodChange} selectedMood={selectedMood} />
          <PoemSearch onQueryChange={onQueryChange} query={query} />
        </div>
        <div className="poem-grid" ref={poemGridRef}>
          {poems.length > 0 ? poems.map((poem) => <PoemCard isFavorite={favoriteIds.includes(poem.id)} key={poem.id} onOpen={onOpen} onToggleFavorite={onToggleFavorite} poem={poem} />) : <EmptyResults />}
        </div>
      </div>
    </section>
  );
}
