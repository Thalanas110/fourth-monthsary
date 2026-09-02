export interface MoodFilterProps {
  moods: string[];
  selectedMood: string;
  onSelect: (mood: string) => void;
}

export function MoodFilter({ moods, selectedMood, onSelect }: MoodFilterProps) {
  return (
    <div aria-label="Filter poems by feeling" className="mood-list" role="group">
      {moods.map((mood) => (
        <button
          className={`mood-button ${selectedMood === mood ? 'selected' : ''}`}
          data-testid={`button-mood-${mood.toLowerCase().replaceAll(' ', '-')}`}
          key={mood}
          onClick={() => onSelect(mood)}
          type="button"
        >
          {mood}
        </button>
      ))}
    </div>
  );
}
