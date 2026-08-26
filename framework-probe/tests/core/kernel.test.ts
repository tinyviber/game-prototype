import { describe, expect, it } from 'vitest';
import { advance, replay } from '../../src/core/kernel';
import type { StepFn } from '../../src/core/types';
import { view } from '../../src/core/query';

// A trivial counter kernel is enough to prove the generic contract: replay is a pure fold,
// independent of how many times or in what order it is invoked.
const addStep: StepFn<number, number> = (prev, _tick, intent) => prev + intent;

describe('core/kernel', () => {
  it('advance applies exactly one step', () => {
    expect(advance(addStep, 10, 1, 5)).toBe(15);
  });

  it('replay folds from tick 1 through targetTick', () => {
    const intents = [1, 2, 3, 4, 5];
    const intentAt = (tick: number) => intents[tick - 1] ?? 0;
    expect(replay(0, addStep, intentAt, 3)).toBe(1 + 2 + 3);
    expect(replay(0, addStep, intentAt, 5)).toBe(1 + 2 + 3 + 4 + 5);
  });

  it('replay is deterministic across repeated calls (no hidden mutable state)', () => {
    const intentAt = (tick: number) => tick * 2;
    const a = replay(0, addStep, intentAt, 10);
    const b = replay(0, addStep, intentAt, 10);
    expect(a).toBe(b);
  });

  it('replay(0) returns the initial state untouched', () => {
    expect(replay(42, addStep, () => 999, 0)).toBe(42);
  });
});

describe('core/query', () => {
  it('view() runs a named bag of queries against one state', () => {
    const state = { level: 7, gate: true };
    const result = view(state, 3, {
      doubled: (s: typeof state) => s.level * 2,
      gateOpen: (s: typeof state) => s.gate,
    });
    expect(result).toEqual({ doubled: 14, gateOpen: true });
  });
});
