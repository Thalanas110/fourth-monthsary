import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LanternButton } from '@/components/main/lantern-button';

describe('LanternButton', () => {
  it('renders an accessible locked lantern button', () => {
    const markup = renderToStaticMarkup(
      <LanternButton onClick={() => undefined} placement="hero" isUnlocked={false} />,
    );

    expect(markup).toContain('<button');
    expect(markup).toContain('type="button"');
    expect(markup).toContain('aria-label="Unlock songs"');
    expect(markup).toContain('aria-pressed="false"');
    expect(markup).toContain('Tap seven times to unlock songs');
  });

  it('announces when songs are unlocked', () => {
    const markup = renderToStaticMarkup(
      <LanternButton onClick={() => undefined} placement="header" isUnlocked />,
    );

    expect(markup).toContain('aria-label="Songs unlocked"');
    expect(markup).toContain('aria-pressed="true"');
  });
});
