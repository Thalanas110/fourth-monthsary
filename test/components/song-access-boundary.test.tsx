// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SONG_ACCESS_STORAGE_KEY, SONG_UNLOCK_STORAGE_KEY } from '@/lib/song-access';
import { navigateToPath } from '@/lib/inertia';
import { SongAccessBoundary } from '@/components/songs/song-access-boundary';

vi.mock('@/lib/inertia', () => ({ navigateToPath: vi.fn() }));

Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', { configurable: true, value: true });

function renderBoundary(children: React.ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  let root: Root | undefined;

  act(() => {
    root = createRoot(container);
    root.render(<SongAccessBoundary>{children}</SongAccessBoundary>);
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

describe('SongAccessBoundary', () => {
  it('does not render protected children before the lantern unlock', () => {
    const { container, cleanup } = renderBoundary(<p>secret song</p>);

    expect(container.textContent).toContain('Returning to the lantern');
    expect(container.textContent).not.toContain('secret song');
    expect(navigateToPath).toHaveBeenCalledWith('/');
    cleanup();
  });

  it('shows the password gate after the lantern unlock', () => {
    window.localStorage.setItem(SONG_UNLOCK_STORAGE_KEY, 'true');
    const { container, cleanup } = renderBoundary(<p>secret song</p>);

    expect(container.querySelector('[data-testid="song-password-gate"]')).not.toBeNull();
    expect(container.textContent).not.toContain('secret song');
    cleanup();
  });

  it('renders protected children after both access flags are present', () => {
    window.localStorage.setItem(SONG_UNLOCK_STORAGE_KEY, 'true');
    window.localStorage.setItem(SONG_ACCESS_STORAGE_KEY, 'true');
    const { container, cleanup } = renderBoundary(<p>secret song</p>);

    expect(container.textContent).toContain('secret song');
    expect(container.querySelector('[data-testid="song-password-gate"]')).toBeNull();
    cleanup();
  });
});
