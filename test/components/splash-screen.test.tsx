// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { SplashScreen } from '@/components/main/splash-screen';

Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', { configurable: true, value: true });

function stubMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })),
  });
}

describe('SplashScreen', () => {
  it('renders the themed splash with lantern, glow, leaves, and caption', () => {
    const markup = renderToStaticMarkup(<SplashScreen />);

    expect(markup).toContain('class="splash-screen"');
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('splash-glow');
    expect(markup).toMatch(/<div class="splash-lantern"[^>]*>/);
    expect(markup).toContain('splash-flame');
    expect(markup).toContain('splash-lantern-cap');
    expect(markup.match(/<span class="splash-leaf"[^>]*><\/span>/g) ?? []).toHaveLength(8);
    expect(markup).toContain('Lighting the lantern...');
    expect(markup).toContain('Happy 4th monthsary');
  });

  it('skips the splash entirely under reduced motion', () => {
    stubMatchMedia(true);
    const container = document.createElement('div');
    document.body.appendChild(container);
    let root: Root | undefined;
    let didUnmount = false;
    try {
      act(() => {
        root = createRoot(container);
        root.render(<SplashScreen />);
      });
      expect(container.querySelector('.splash-screen')).toBeNull();
      act(() => root?.unmount());
      didUnmount = true;
    } finally {
      if (!didUnmount) act(() => root?.unmount());
      container.remove();
    }
  });
});