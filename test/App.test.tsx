import { describe, expect, it } from 'vitest';
import { APP_NAME } from '@/App';

describe('initial application scaffold', () => {
  it('identifies the Poem Lantern application', () => {
    expect(APP_NAME).toBe('Poem Lantern');
  });
});
