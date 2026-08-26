import { describe, expect, it } from 'vitest';
import type { RunDefinition, StepFn } from '../../src/core/types';
import { createHistory, replay } from '../../src/services/history';

const addStep: StepFn<number, number> = (prev, _tick, intent) => prev + intent;

const definition: RunDefinition<number, number> = {
  initialState: 0,
  step: addStep,
  inputSource: (tick) => tick,
};

describe('services/history', () => {
  it('replays from tick 1 through the requested tick', () => {
    expect(replay(definition, 3)).toBe(1 + 2 + 3);
    expect(replay(definition, 5)).toBe(1 + 2 + 3 + 4 + 5);
    expect(replay(definition, 0)).toBe(0);
  });

  it('is deterministic across repeated calls', () => {
    expect(replay(definition, 10)).toBe(replay(definition, 10));
  });

  it('keeps the prior state read-only at the StepFn boundary', () => {
    const step: StepFn<{ readonly value: number }, void> = (prev) => ({ value: prev.value + 1 });
    const history = createHistory({ initialState: { value: 2 }, step, inputSource: () => undefined });
    expect(history.stateAt(1)).toEqual({ value: 3 });
  });

  it('binds the run definition fields at history creation', () => {
    const mutableDefinition = {
      initialState: 0,
      step: addStep,
      inputSource: (tick: number) => tick,
    };
    const history = createHistory(mutableDefinition);

    mutableDefinition.initialState = 100;
    mutableDefinition.step = () => 999;
    mutableDefinition.inputSource = () => 0;

    expect(history.stateAt(3)).toBe(6);
  });

  it('copies a data-shaped initial state for the history snapshot', () => {
    const initialState = { value: 0 };
    const history = createHistory({
      initialState,
      step: (prev: Readonly<typeof initialState>) => ({ value: prev.value + 1 }),
      inputSource: () => undefined,
    });

    initialState.value = 100;

    expect(history.stateAt(1)).toEqual({ value: 1 });
  });
});

describe('services/history — memoized timeline', () => {
  it('computes each tick exactly once: forward, repeated, and backward reads never recompute', () => {
    let steps = 0;
    const history = createHistory({
      initialState: 0,
      step: (prev: number) => {
        steps += 1;
        return prev + 1;
      },
      inputSource: () => undefined,
    });

    history.stateAt(5);
    history.stateAt(5);
    history.stateAt(3);

    expect(steps).toBe(5);
  });

  it('extends incrementally past the cached range and matches a fresh replay', () => {
    const history = createHistory(definition);

    history.stateAt(7);
    expect(history.stateAt(2)).toEqual(replay(definition, 2));
    expect(history.stateAt(9)).toEqual(replay(definition, 9));
    expect(replay(definition, 4)).toBe(10);
  });

  it('rejects negative or non-integer ticks instead of returning undefined states', () => {
    const history = createHistory({ initialState: 0, step: addStep, inputSource: () => 0 });
    expect(() => history.stateAt(-1)).toThrow(RangeError);
    expect(() => history.stateAt(1.5)).toThrow(RangeError);
  });
});
