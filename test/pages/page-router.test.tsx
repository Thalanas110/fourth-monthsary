import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PageRouter } from '@/pages/page-router';

describe('PageRouter', () => {
  it('renders the not-found page for an unknown pathname', () => {
    const markup = renderToStaticMarkup(<PageRouter pathname="/somewhere-else" />);

    expect(markup).toContain('This page wandered off.');
    expect(markup).not.toContain('Happy 4th');
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
});
