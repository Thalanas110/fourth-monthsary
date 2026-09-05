import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PoemCard } from '@/components/poems/poem-card';
import type { Poem } from '@/data/poems';

const song: Poem = {
  id: 'song-preview',
  title: 'Song Preview',
  author: 'The Lanterns',
  mood: 'Warmth',
  kind: 'song',
  length: '3:42',
  excerpt: 'A small melody for the softer hours.',
  body: 'A small melody\nfor the softer hours.',
};

describe('PoemCard', () => {
  it('marks songs and changes the action label to listen', () => {
    const markup = renderToStaticMarkup(
      <PoemCard isFavorite={false} onToggleFavorite={() => undefined} poem={song} />,
    );

    expect(markup).toContain('is-song');
    expect(markup).toContain('data-piece-kind="song"');
    expect(markup).toContain('>Song</span>');
    expect(markup).toContain('href="/poems/song-preview"');
    expect(markup).toContain('>Listen <');
  });
});
