import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import NotFound from '@/pages/not-found';

describe('NotFound page', () => {
  it('uses the current site header and gives the reader two clear ways back', () => {
    const markup = renderToStaticMarkup(<NotFound />);

    expect(markup).toContain('A Classic Surprise');
    expect(markup).toContain('data-testid="link-find-a-poem"');
    expect(markup).toContain('data-testid="text-saved-count"');
    expect(markup).toContain('href="/#top"');
    expect(markup).toContain('href="/#library"');
    expect(markup).toContain('This page wandered off.');
    expect(markup).toContain('Return to the lantern');
    expect(markup).toContain('Find a poem');
    expect(markup).toContain('not-found-lantern');
    expect(markup).not.toContain('This door');
  });
});
