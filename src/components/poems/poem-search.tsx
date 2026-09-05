import { Search } from 'lucide-react';

export interface PoemSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function PoemSearch({ query, onQueryChange }: PoemSearchProps) {
  return (
    <label className="search-box">
      <Search aria-hidden="true" />
      <input
        aria-label="Search poems"
        data-testid="input-search-poems"
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search the room"
        type="search"
        value={query}
      />
    </label>
  );
}
