import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { RitualSection } from '@/components/main/ritual-section';

describe('RitualSection', () => {
  it('dedicates the footer to Annah Claire and the fourth monthsary', () => {
    const markup = renderToStaticMarkup(<RitualSection />);

    expect(markup).toContain('Made for Annah Claire · our 4th monthsary');
    expect(markup).toContain('September 19, 2026');
    expect(markup).toContain('A note for Annah Claire');
    expect(markup).toContain('Four months with you already, and I still find new reasons to choose you.');
    expect(markup).toContain('Happy 4th monthsary, my madame :DD');
    expect(markup).not.toContain('A note from the lantern keeper');
    expect(markup).not.toContain('Poem Lantern is a little place to pause.');
    expect(markup).not.toContain('Poem Lantern · made for the in-between');
    expect(markup).not.toContain('© 2024');
  });
});
