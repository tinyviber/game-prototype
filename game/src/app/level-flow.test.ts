import { describe, expect, it } from 'vitest';
import { nextLevel, previousLevel } from './level-flow';

describe('level navigation', () => {
  it('moves between levels while respecting both boundaries', () => {
    expect(previousLevel(1)).toBeUndefined();
    expect(previousLevel(3)).toBe(2);
    expect(nextLevel(3)).toBe(4);
    expect(nextLevel(5)).toBeUndefined();
  });
});
