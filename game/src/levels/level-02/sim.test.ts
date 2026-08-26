import { describe, expect, it } from 'vitest';
import { createHistory } from '../../runtime/history';
import { createRun, defaultProgram, initialState, repairProgram, step } from './sim';

describe('level 2 breathing floor', () => {
  it('shows the collapsed phase when the default arrives late', () => {
    const state = createHistory(createRun(defaultProgram)).stateAt(2);
    expect(state.status).toBe('failed');
    expect(state.phase).toBe(2);
    expect(state.tile).toBe('collapsed');
  });
  it('uses one wait to cross on the safe phase', () => {
    const first = createHistory(createRun(repairProgram)).stateAt(4);
    const second = createHistory(createRun(repairProgram)).stateAt(4);
    expect(first.status).toBe('success');
    expect(first.position).toBe(second.position);
    expect(first.phase).toBe(second.phase);
  });
  it('tells an interact apart from a wait when nothing needs a hand', () => {
    const state = step({ ...initialState, position: 1 }, 1, 'interact');
    expect(state.activity).toBe('acting');
    expect(state.message).toContain('needs a touch');
  });
});
