import { describe, expect, it } from 'vitest';
import { moods, poems } from '@/data/poems';

describe('poem catalog', () => {
  it('contains nine pieces across seven feeling options', () => {
    expect(poems).toHaveLength(9);
    expect(moods).toHaveLength(7);
    expect(poems.filter((poem) => poem.kind === 'song')).toHaveLength(2);
    expect(poems.map((poem) => poem.id)).toEqual([
      'blue-hour', 'the-last-light', 'small-weather', 'after-the-rain', 'postcard-home', 'night-bloom',
      'under-the-same-moon', 'slow-dancing-in-the-kitchen', 'wish-you-were-here',
    ]);
  });
});
