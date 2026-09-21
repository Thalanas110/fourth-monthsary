import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { RitualSection } from '@/components/main/ritual-section';

describe('RitualSection', () => {
  it('dedicates the footer to Annah Claire and the fourth monthsary', () => {
    const markup = renderToStaticMarkup(<RitualSection />);

    expect(markup).toContain('Made for Annah Claire · our 4th monthsary');
    expect(markup).toContain('September 19, 2026');
    expect(markup).not.toContain('Poem Lantern · made for the in-between');
    expect(markup).not.toContain('© 2024');
  });
});
