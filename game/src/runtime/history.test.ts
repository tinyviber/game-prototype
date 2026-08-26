import { describe, expect, it } from 'vitest';
import { createHistory } from './history';
import { createRun, type L1Action } from '../levels/level-01/sim';

describe('memoized run history', () => {
  it('computes each forward tick once and supports backward reads', () => {
    let calls = 0;
    const history = createHistory({
      initialState: { value: 0 },
      step: (previous, tick) => { calls += 1; return { value: previous.value + tick }; },
      inputSource: () => undefined,
    });
    expect(history.stateAt(3).value).toBe(6);
    expect(calls).toBe(3);
    expect(history.stateAt(1).value).toBe(1);
    expect(history.stateAt(3).value).toBe(6);
    expect(calls).toBe(3);
    expect(() => history.stateAt(-1)).toThrow(RangeError);
    expect(() => history.stateAt(1.5)).toThrow(RangeError);
  });

  it('captures authored programs when a run is created', () => {
    const program = { actions: ['move', 'move', 'move'] as L1Action[] };
    const run = createRun(program);
    program.actions[0] = 'interact';
    const state = createHistory(run).stateAt(2);
    expect(state.status).toBe('failed');
    expect(state.failureBeat).toBe(2);
  });
});
