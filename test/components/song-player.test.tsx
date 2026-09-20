// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SongPlayer } from '@/components/songs/song-player';
import { songs } from '@/data/songs';

Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', { configurable: true, value: true });

function renderSongPlayer() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  let root: Root | undefined;

  act(() => {
    root = createRoot(container);
    root.render(<SongPlayer song={songs[0]} />);
  });

  return {
    container,
    cleanup: () => {
      act(() => root?.unmount());
      container.remove();
    },
  };
}

afterEach(() => vi.restoreAllMocks());

describe('SongPlayer', () => {
  it('renders the song lyrics and an accessible play control', () => {
    const { container, cleanup } = renderSongPlayer();

    expect(container.querySelector('[data-testid="song-player"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="text-song-body"]')?.textContent)
      .toContain('The room was quieter than I imagined,');
    expect(container.querySelector('[data-testid="button-song-playback"]')?.getAttribute('aria-label'))
      .toBe(`Play ${songs[0].title}`);
    cleanup();
  });

  it('updates the transport from media events and reports playback errors', () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
    const { container, cleanup } = renderSongPlayer();
    const audio = container.querySelector('audio');
    const playbackButton = container.querySelector<HTMLButtonElement>('[data-testid="button-song-playback"]');
    const seek = container.querySelector<HTMLInputElement>('[data-testid="input-song-seek"]');

    expect(audio).not.toBeNull();
    expect(playbackButton).not.toBeNull();
    expect(seek).not.toBeNull();

    Object.defineProperty(audio, 'duration', { configurable: true, value: 125 });
    act(() => audio?.dispatchEvent(new Event('loadedmetadata')));
    expect(seek?.max).toBe('125');

    act(() => playbackButton?.click());
    expect(play).toHaveBeenCalledTimes(1);
    act(() => audio?.dispatchEvent(new Event('play')));
    expect(playbackButton?.getAttribute('aria-label')).toBe(`Pause ${songs[0].title}`);

    Object.defineProperty(audio, 'currentTime', { configurable: true, value: 60, writable: true });
    act(() => {
      if (!seek) return;
      seek.value = '60';
      seek.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(audio?.currentTime).toBe(60);
    act(() => audio?.dispatchEvent(new Event('timeupdate')));
    expect(seek?.value).toBe('60');

    act(() => playbackButton?.click());
    expect(pause).toHaveBeenCalledTimes(1);
    act(() => audio?.dispatchEvent(new Event('error')));
    expect(container.textContent).toContain('Playback unavailable.');
    cleanup();
  });
});
