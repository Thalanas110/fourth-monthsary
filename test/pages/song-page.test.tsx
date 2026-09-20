// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SongPage } from '@/components/songs/song-page';
import { songs, type Song } from '@/data/songs';
import { SONG_ACCESS_STORAGE_KEY, SONG_UNLOCK_STORAGE_KEY } from '@/lib/song-access';
import { navigateToPath } from '@/lib/inertia';

vi.mock('@/lib/inertia', () => ({ navigateToPath: vi.fn() }));

Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', { configurable: true, value: true });

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  value: (query: string) => ({
    addEventListener: () => undefined,
    addListener: () => undefined,
    dispatchEvent: () => false,
    matches: query.includes('reduce'),
    media: query,
    onchange: null,
    removeEventListener: () => undefined,
    removeListener: () => undefined,
  }),
});

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  configurable: true,
  value: () => null,
});

function renderSongPage(song: Song | null = songs[0]) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  let root: Root | undefined;

  act(() => {
    root = createRoot(container);
    root.render(<SongPage song={song ?? undefined} />);
  });

  return {
    container,
    cleanup: () => {
      act(() => root?.unmount());
      container.remove();
    },
  };
}

beforeEach(() => {
  window.localStorage.clear();
  vi.mocked(navigateToPath).mockClear();
});

afterEach(() => window.localStorage.clear());

describe('SongPage', () => {
  it('does not expose a song detail to an unarmed direct visitor', () => {
    const { container, cleanup } = renderSongPage();

    expect(container.textContent).toContain('Returning to the lantern');
    expect(container.textContent).not.toContain(songs[0].title);
    expect(navigateToPath).toHaveBeenCalledWith('/');
    cleanup();
  });

  it('shows the password gate after the lantern unlock', () => {
    window.localStorage.setItem(SONG_UNLOCK_STORAGE_KEY, 'true');
    const { container, cleanup } = renderSongPage();

    expect(container.querySelector('[data-testid="song-password-gate"]')).not.toBeNull();
    expect(container.textContent).not.toContain(songs[0].title);
    cleanup();
  });

  it('renders the song detail and native audio controls after access is granted', () => {
    window.localStorage.setItem(SONG_UNLOCK_STORAGE_KEY, 'true');
    window.localStorage.setItem(SONG_ACCESS_STORAGE_KEY, 'true');
    const { container, cleanup } = renderSongPage();

    expect(container.querySelector('[data-testid="page-song"]')).not.toBeNull();
    expect(container.textContent).toContain(songs[0].title);
    expect(container.querySelector('audio')).not.toBeNull();
    expect(container.querySelector('audio')?.getAttribute('aria-label')).toBe(`Play ${songs[0].title}`);
    cleanup();
  });

  it('shows not-found for an unknown song after access is granted', () => {
    window.localStorage.setItem(SONG_UNLOCK_STORAGE_KEY, 'true');
    window.localStorage.setItem(SONG_ACCESS_STORAGE_KEY, 'true');
    const { container, cleanup } = renderSongPage(null);

    expect(container.textContent).toContain('This page wandered off.');
    expect(container.querySelector('[data-testid="page-song"]')).toBeNull();
    cleanup();
  });
});
