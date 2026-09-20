import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PoemCard } from '@/components/poems/poem-card';
import type { Poem } from '@/data/poems';

const poem: Poem = {
  id: 'card-preview',
  title: 'Card Preview',
  author: 'Adriaan M. Dimate',
  mood: 'Longing',
  length: '3 min read',
  excerpt: 'A small line for the softer hours.',
  body: 'A small line\nfor the softer hours.',
};

describe('PoemCard', () => {
  it('marks the piece as a poem and links to its page', () => {
    const markup = renderToStaticMarkup(
      <PoemCard isFavorite={false} onToggleFavorite={() => undefined} poem={poem} />,
    );

    expect(markup).toContain('>Poem</span>');
    expect(markup).toContain('href="/poems/card-preview"');
    expect(markup).toContain('>Read <');
  });
});