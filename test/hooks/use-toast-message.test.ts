import { describe, expect, it } from 'vitest';
import { TOAST_DURATION_MS } from '@/hooks/use-toast-message';

describe('favorite feedback timing', () => {
  it('keeps the status message visible for 2200 milliseconds', () => {
    expect(TOAST_DURATION_MS).toBe(2200);
  });
});
