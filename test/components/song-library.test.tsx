import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SongLibrary } from '@/components/songs/song-library';
import type { Song } from '@/data/songs';

const song: Song = {
  id: 'test-song',
  title: 'Test song',
  author: 'Test artist',
  duration: 180,
  length: '3:00',
  excerpt: 'A test track.',
  body: '',
  audioSrc: '/audio/test-song.mp3',
};

describe('SongLibrary', () => {
  it('renders the unlocked song section with an honest empty state', () => {
    const markup = renderToStaticMarkup(<SongLibrary songs={[]} />);

    expect(markup).toContain('data-testid="song-library"');
    expect(markup).toContain('Songs unlocked');
    expect(markup).toContain('No songs have been added yet.');
  });

  it('renders native audio controls for local song entries', () => {
    const markup = renderToStaticMarkup(<SongLibrary songs={[song]} />);

    expect(markup).toContain('Test song');
    expect(markup).toContain('aria-label="Play Test song"');
    expect(markup).toContain('controls');
    expect(markup).toContain('src="/audio/test-song.mp3"');
  });
});
