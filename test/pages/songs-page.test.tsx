// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SONG_ACCESS_STORAGE_KEY } from '@/lib/song-access';
import { navigateToPath } from '@/lib/inertia';
import SongsPage from '@/pages/songs-page';

vi.mock('@/lib/inertia', () => ({ navigateToPath: vi.fn() }));

Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', { configurable: true, value: true });

function renderPage() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  let root: Root | undefined;

  act(() => {
    root = createRoot(container);
    root.render(<SongsPage />);
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

describe('SongsPage', () => {
  it('redirects unarmed visitors to the home route', () => {
    const { container, cleanup } = renderPage();

    expect(container.querySelector('[data-testid="songs-route-redirecting"]')).not.toBeNull();
    expect(navigateToPath).toHaveBeenCalledWith('/');
    cleanup();
  });

  it('shows the password gate after the lantern unlock', () => {
    window.localStorage.setItem('poem-lantern:songs-unlocked', 'true');

    const { container, cleanup } = renderPage();

    expect(container.querySelector('[data-testid="page-songs"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="song-password-gate"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="song-library"]')).toBeNull();
    cleanup();
  });

  it('shows the library after password access has been granted', () => {
    window.localStorage.setItem('poem-lantern:songs-unlocked', 'true');
    window.localStorage.setItem(SONG_ACCESS_STORAGE_KEY, 'true');

    const { container, cleanup } = renderPage();

    expect(container.querySelector('[data-testid="song-library"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="song-password-gate"]')).toBeNull();
    cleanup();
  });
});
