import { useEffect, useState } from 'react';

export const FAVORITES_STORAGE_KEY = 'poem-lantern-favorites';

export function readFavoriteIds(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === 'string') ? parsed : [];
  } catch {
    return [];
  }
}

export function useFavoritePoems() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    return readFavoriteIds(window.localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]');
  });

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (id: string) => {
    setFavoriteIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return { favoriteIds, toggleFavorite };
}
