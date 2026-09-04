import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { HeroSection } from '@/components/hero-section';

describe('HeroSection', () => {
  it('preserves the monthsary copy and exposes the hero leaf layer contract', () => {
    const markup = renderToStaticMarkup(<HeroSection />);

    expect(markup).toContain('A fourth monthsary suite');
    expect(markup).toContain('Happy 4th');
    expect(markup).toContain('monthsary, my madame :DD');
    expect(markup).toContain('A random surprise collection for our fourth monthsary, just for you.');

    const leafLayers = markup.match(/<div class="hero-leaf-layer" aria-hidden="true">/g) ?? [];
    const leafSpans = markup.match(/<span class="hero-leaf"[^>]*><\/span>/g) ?? [];

    expect(leafLayers).toHaveLength(1);
    expect(leafSpans).toHaveLength(30);
  });
});
