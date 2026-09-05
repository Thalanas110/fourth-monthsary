// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', { configurable: true, value: true });

class IntersectionObserverStub {
  static latest: IntersectionObserverStub | null = null;
  private readonly callback: IntersectionObserverCallback;
  readonly observed = new Set<Element>();

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    IntersectionObserverStub.latest = this;
  }

  observe = vi.fn((element: Element) => {
    this.observed.add(element);
  });

  disconnect = vi.fn();

  emit(element: Element, isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting, target: element } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

function RevealProbe() {
  const ref = useScrollReveal<HTMLDivElement>();
  return <div ref={ref}><article data-reveal="true" /></div>;
}

describe('useScrollReveal', () => {
  it('adds visibility on entry and removes it when scrolling away', () => {
    const originalObserver = window.IntersectionObserver;
    Object.defineProperty(window, 'IntersectionObserver', { configurable: true, value: IntersectionObserverStub });
    const container = document.createElement('div');
    document.body.appendChild(container);
    let root: Root | undefined;

    try {
      act(() => {
        root = createRoot(container);
        root.render(<RevealProbe />);
      });

      const card = container.querySelector('[data-reveal]');
      const observer = IntersectionObserverStub.latest;
      expect(card).not.toBeNull();
      expect(observer?.observe).toHaveBeenCalledWith(card);

      act(() => observer?.emit(card as Element, true));
      expect(card?.classList.contains('is-visible')).toBe(true);

      act(() => observer?.emit(card as Element, false));
      expect(card?.classList.contains('is-visible')).toBe(false);
    } finally {
      act(() => root?.unmount());
      container.remove();
      Object.defineProperty(window, 'IntersectionObserver', { configurable: true, value: originalObserver });
    }
  });
});
