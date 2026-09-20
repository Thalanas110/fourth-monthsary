import { describe, expect, it } from 'vitest';
import { songs } from '@/data/songs';

describe('songs data', () => {
  it('bundles the second song lyrics into the catalog', () => {
    const song = songs.find(({ id }) => id === 'if-you-could-see-what-i-see');

    expect(song?.title).toBe('If You Could See What I See');
    expect(song?.length).toBe('Local audio');
    expect(song?.audioSrc).toContain('If%20You%20Could%20See%20What%20I%20See.mp3');
    expect(song?.body).toContain('Sometimes I wonder what you see');
    expect(song?.body).toContain("I fell in love with you.");
    expect(song?.body).toContain("you'd love her too.");
  });
});
