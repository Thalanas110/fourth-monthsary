import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PageRouter } from '@/pages/page-router';

describe('PageRouter', () => {
  it('renders the not-found page for an unknown pathname', () => {
    const markup = renderToStaticMarkup(<PageRouter pathname="/somewhere-else" />);

    expect(markup).toContain('This page wandered off.');
    expect(markup).not.toContain('Happy 4th');
  });

  it('renders a complete poem page for a poem pathname', () => {
    const markup = renderToStaticMarkup(<PageRouter pathname="/poems/blue-hour" />);

    expect(markup).toContain('Blue Hour');
    expect(markup).toContain('The day leaves by the river');
    expect(markup).toContain('data-testid="page-poem"');
    expect(markup).not.toContain('dialog-poem-reader');
  });

  it('uses not-found for an unknown poem id', () => {
    const markup = renderToStaticMarkup(<PageRouter pathname="/poems/not-a-real-poem" />);

    expect(markup).toContain('This page wandered off.');
    expect(markup).not.toContain('data-testid="page-poem"');
  });

  it('keeps the poem experience at the configured home path', () => {
    const markup = renderToStaticMarkup(<PageRouter pathname="/" />);

    expect(markup).toContain('Happy 4th');
    expect(markup).not.toContain('This page wandered off.');
  });

  it('supports a non-root Vite base path', () => {
    const markup = renderToStaticMarkup(<PageRouter basePath="/monthsary/" pathname="/monthsary/" />);

    expect(markup).toContain('Happy 4th');
  });

  it('supports poem pages below a non-root Vite base path', () => {
    const markup = renderToStaticMarkup(<PageRouter basePath="/monthsary/" pathname="/monthsary/poems/night-bloom" />);

    expect(markup).toContain('Night Bloom');
    expect(markup).toContain('data-testid="page-poem"');
  });
});
