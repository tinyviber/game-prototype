import { describe, expect, it } from 'vitest';
import { GATE_WALL_CLIP, gateWallView } from './view';

describe('level one gate presentation', () => {
  it('keeps the descending wall inside the gate opening', () => {
    expect(gateWallView(0)).toEqual({ y: GATE_WALL_CLIP.y, height: GATE_WALL_CLIP.height });
    expect(gateWallView(0.5).height).toBeCloseTo(21.5);
    expect(gateWallView(1).height).toBe(0);
    expect(gateWallView(2).height).toBe(0);
  });
});
