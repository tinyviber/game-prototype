import { describe, expect, it } from 'vitest';
import { advance } from '../../src/core/kernel';
import type { RunDefinition, StepFn } from '../../src/core/types';
import { createHistory, replay } from '../../src/services/history';
import { view } from '../../src/services/presentation';

const addStep: StepFn<number, number> = (prev, _tick, intent) => prev + intent;

describe('core/kernel', () => {
  it('advance applies exactly one step', () => {
    expect(advance(10, 1, 5, addStep)).toBe(15);
  });

  it('keeps the prior state read-only at the StepFn boundary', () => {
    const step: StepFn<{ readonly value: number }, void> = (prev) => ({ value: prev.value + 1 });
    expect(advance({ value: 2 }, 1, undefined, step)).toEqual({ value: 3 });
  });
});

describe('services/history', () => {
  const definition: RunDefinition<number, number> = {
    initialState: 0,
    step: addStep,
    inputSource: (tick) => tick,
  };

  it('replays from tick 1 through the requested tick', () => {
    expect(replay(definition, 3)).toBe(1 + 2 + 3);
    expect(replay(definition, 5)).toBe(1 + 2 + 3 + 4 + 5);
    expect(replay(definition, 0)).toBe(0);
  });

  it('is deterministic across repeated calls', () => {
    expect(replay(definition, 10)).toBe(replay(definition, 10));
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

describe('presentation/view', () => {
  it('runs a named bag of queries against one state', () => {
    const state = { level: 7, gate: true };
    const result = view(state, 3, {
      doubled: (s: typeof state) => s.level * 2,
      gateOpen: (s: typeof state) => s.gate,
    });
    expect(result).toEqual({ doubled: 14, gateOpen: true });
  });
});
