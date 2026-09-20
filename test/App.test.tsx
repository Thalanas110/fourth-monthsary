// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { navigateToPath } from '@/lib/inertia';
import App, { APP_NAME } from '@/App';

vi.mock('@/lib/inertia', async () => ({
  ...await vi.importActual<typeof import('@/lib/inertia')>('@/lib/inertia'),
  navigateToPath: vi.fn(),
}));

Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', { configurable: true, value: true });
Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  value: (query: string) => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }),
});
vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

afterEach(() => {
  window.localStorage.removeItem('poem-lantern:songs-unlocked');
  window.localStorage.removeItem('poem-lantern:songs-access-granted');
  vi.mocked(navigateToPath).mockClear();
});

describe('initial application scaffold', () => {
  it('identifies the Poem Lantern application', () => {
    expect(APP_NAME).toBe('Poem Lantern');
  });

  it('navigates after seven taps and reopens songs with one later tap', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    let root: Root | undefined;

    try {
      act(() => {
        root = createRoot(container);
        root.render(<App />);
      });

      expect(container.querySelector('[data-testid="song-library"]')).toBeNull();

      const headerLantern = container.querySelector<HTMLButtonElement>('[data-testid="header-lantern"]');
      const heroLantern = container.querySelector<HTMLButtonElement>('[data-testid="hero-lantern"]');
      expect(headerLantern).not.toBeNull();
      expect(heroLantern).not.toBeNull();

      [headerLantern, heroLantern, headerLantern, heroLantern, headerLantern, heroLantern, headerLantern].forEach((lantern) => {
        act(() => lantern?.click());
      });

      expect(container.querySelector('[data-testid="song-library"]')).toBeNull();
      expect(window.localStorage.getItem('poem-lantern:songs-unlocked')).toBe('true');
      expect(navigateToPath).toHaveBeenCalledWith('/songs/');

      vi.mocked(navigateToPath).mockClear();
      act(() => heroLantern?.click());

      expect(navigateToPath).toHaveBeenCalledWith('/songs/');
    } finally {
      act(() => root?.unmount());
      container.remove();
    }
  });
});
