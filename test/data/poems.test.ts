import { describe, expect, it } from 'vitest';
import { moods, poems } from '@/data/poems';

describe('poem catalog', () => {
  it('starts with six poems across seven feeling options', () => {
    expect(poems).toHaveLength(6);
    expect(moods).toHaveLength(7);
    expect(poems.map((poem) => poem.id)).toEqual([
      'blue-hour', 'the-last-light', 'small-weather', 'after-the-rain', 'postcard-home', 'night-bloom',
    ]);
  });
});
