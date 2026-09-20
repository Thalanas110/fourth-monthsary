import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { songs } from '@/data/songs';
import { PageRouter } from '@/pages/page-router';

describe('PageRouter', () => {
  it('renders the not-found page for an unknown pathname', () => {
    const markup = renderToStaticMarkup(<PageRouter pathname="/somewhere-else" />);

    expect(markup).toContain('This page wandered off.');
    expect(markup).not.toContain('Happy 4th');
  });

  it('renders a complete poem page for a poem pathname', () => {
    const markup = renderToStaticMarkup(<PageRouter pathname="/poems/if-i-could-be-there" />);

    expect(markup).toContain('If I Could Be There');
    expect(markup).toContain('Some nights I stare into the night');
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
    const markup = renderToStaticMarkup(<PageRouter basePath="/monthsary/" pathname="/monthsary/poems/the-waiting-days" />);

    expect(markup).toContain('The Waiting Days');
    expect(markup).toContain('data-testid="page-poem"');
  });

  it('renders the songs route shell at the configured path', () => {
    const markup = renderToStaticMarkup(<PageRouter pathname="/songs/" />);

    expect(markup).toContain('data-testid="page-songs"');
  });

  it('supports the songs route below a non-root Vite base path', () => {
    const markup = renderToStaticMarkup(<PageRouter basePath="/monthsary/" pathname="/monthsary/songs/" />);

    expect(markup).toContain('data-testid="page-songs"');
  });

  it('routes a known song id to the song detail shell', () => {
    const markup = renderToStaticMarkup(<PageRouter pathname={`/songs/${songs[0].id}`} />);

    expect(markup).toContain('song-page-shell');
    expect(markup).not.toContain('data-testid="page-songs"');
  });
});
