// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { useHeroScrollFade } from '@/hooks/use-hero-scroll-fade';

Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', { configurable: true, value: true });

function FadeProbe() {
  const { heroRef, transitionRef } = useHeroScrollFade<HTMLElementTagNameMap['section'], HTMLElementTagNameMap['div']>();
  return <><section data-testid="hero" ref={heroRef} /><div data-testid="transition" ref={transitionRef} /></>;
}

describe('useHeroScrollFade', () => {
  it('clamps scroll progress and cleans up listeners', () => {
    const originalInnerHeight = window.innerHeight;
    const originalAnimationFrame = window.requestAnimationFrame;
    const originalCancelAnimationFrame = window.cancelAnimationFrame;
    let boundaryBottom = 1000;
    let pendingCallback: FrameRequestCallback | undefined;
    const animationFrame = vi.fn((callback: FrameRequestCallback) => {
      pendingCallback = callback;
      return 1;
    });
    const cancelAnimationFrame = vi.fn();
    const removeEventListener = vi.spyOn(window, 'removeEventListener');
    const getBoundingClientRect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({
      bottom: boundaryBottom,
    } as DOMRect));
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 });
    Object.defineProperty(window, 'requestAnimationFrame', { configurable: true, value: animationFrame });
    Object.defineProperty(window, 'cancelAnimationFrame', { configurable: true, value: cancelAnimationFrame });

    const container = document.createElement('div');
    document.body.appendChild(container);
    let root: Root | undefined;
    let didUnmount = false;

    try {
      act(() => {
        root = createRoot(container);
        root.render(<FadeProbe />);
      });

      const hero = container.querySelector<HTMLElement>('[data-testid="hero"]');
      const transition = container.querySelector<HTMLElement>('[data-testid="transition"]');
      act(() => pendingCallback?.(0));
      expect(transition?.style.getPropertyValue('--hero-transition-progress')).toBe('0.000');

      boundaryBottom = 450;
      act(() => window.dispatchEvent(new Event('scroll')));
      act(() => pendingCallback?.(0));
      expect(transition?.style.getPropertyValue('--hero-transition-progress')).toBe('1.000');
      expect(transition?.style.getPropertyValue('--hero-transition-opacity')).toBe('1.000');

      boundaryBottom = 2000;
      act(() => window.dispatchEvent(new Event('resize')));
      act(() => pendingCallback?.(0));
      expect(transition?.style.getPropertyValue('--hero-transition-progress')).toBe('0.000');

      act(() => root?.unmount());
      didUnmount = true;
      expect(removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
      expect(removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    } finally {
      if (!didUnmount) act(() => root?.unmount());
      container.remove();
      getBoundingClientRect.mockRestore();
      removeEventListener.mockRestore();
      Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalInnerHeight });
      Object.defineProperty(window, 'requestAnimationFrame', { configurable: true, value: originalAnimationFrame });
      Object.defineProperty(window, 'cancelAnimationFrame', { configurable: true, value: originalCancelAnimationFrame });
    }
  });
});
