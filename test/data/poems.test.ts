import { describe, expect, it } from 'vitest';
import { moods, poems } from '@/data/poems';

describe('poem catalog', () => {
  it('contains four poems across seven feeling options', () => {
    expect(poems).toHaveLength(4);
    expect(moods).toHaveLength(7);
    expect(poems.filter((poem) => poem.kind === 'song')).toHaveLength(0);
    expect(poems.map((poem) => poem.id)).toEqual([
      'if-i-could-be-there', 'the-waiting-days', 'everything-i-miss-about-you', 'if-i-could-live-these-three-months-again',
    ]);
  });
});
