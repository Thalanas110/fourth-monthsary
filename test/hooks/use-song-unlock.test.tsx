// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useSongUnlock } from '@/hooks/use-song-unlock';

Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', { configurable: true, value: true });

type UnlockApi = ReturnType<typeof useSongUnlock>;

function UnlockProbe({ onReady }: { onReady: (api: UnlockApi) => void }) {
  const api = useSongUnlock();
  onReady(api);
  return null;
}

function renderSongUnlockHook() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  let latest: UnlockApi | undefined;
  let root: Root | undefined;

  act(() => {
    root = createRoot(container);
    root.render(<UnlockProbe onReady={(api) => { latest = api; }} />);
  });

  return {
    result: {
      get current() {
        if (!latest) throw new Error('The unlock hook did not render.');
        return latest;
      },
    },
    cleanup: () => {
      act(() => root?.unmount());
      container.remove();
    },
  };
}

afterEach(() => {
  window.localStorage.clear();
  vi.useRealTimers();
});

describe('useSongUnlock', () => {
  it('unlocks after seven clicks in the active window', () => {
    const { result, cleanup } = renderSongUnlockHook();

    expect(result.current.isUnlocked).toBe(false);
    expect(result.current.progress).toBe(0);

    for (let click = 0; click < 6; click += 1) {
      let unlocked = true;
      act(() => { unlocked = result.current.clickLantern(); });
      expect(unlocked).toBe(false);
    }

    let unlocked = false;
    act(() => { unlocked = result.current.clickLantern(); });

    expect(unlocked).toBe(true);
    expect(result.current.isUnlocked).toBe(true);
    expect(result.current.progress).toBe(7);
    expect(window.localStorage.getItem('poem-lantern:songs-unlocked')).toBe('true');
    cleanup();
  });

  it('resets an incomplete sequence after two seconds', () => {
    vi.useFakeTimers();
    const { result, cleanup } = renderSongUnlockHook();

    act(() => {
      result.current.clickLantern();
      result.current.clickLantern();
      vi.advanceTimersByTime(2001);
    });

    expect(result.current.progress).toBe(0);
    expect(result.current.isUnlocked).toBe(false);
    cleanup();
  });

  it('restores the persisted unlocked state', () => {
    window.localStorage.setItem('poem-lantern:songs-unlocked', 'true');

    const { result, cleanup } = renderSongUnlockHook();

    expect(result.current.isUnlocked).toBe(true);
    expect(result.current.progress).toBe(0);
    cleanup();
  });
});
