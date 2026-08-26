import { describe, expect, it } from 'vitest';
import { createHistory } from '../../runtime/history';
import { createRun, defaultProgram, repairProgram } from './sim';
import { toView } from './view';

describe('level 1 sleeping latch', () => {
  it('makes the direct route fail at the locked gate', () => {
    const state = createHistory(createRun(defaultProgram)).stateAt(3);
    expect(state.status).toBe('failed');
    expect(state.failureBeat).toBe(2);
    expect(state.message).toContain('activator');
  });
  it('opens the gate before walking through', () => {
    expect(createHistory(createRun(repairProgram)).stateAt(4).status).toBe('success');
  });
  it('exposes a deterministic descent window after the lever is touched', () => {
    const history = createHistory(createRun(repairProgram));
    expect(toView(history.stateAt(2)).gateProgress).toBe(0);
    expect(toView(history.stateAt(3)).gateProgress).toBe(0.5);
    expect(toView(history.stateAt(4)).gateProgress).toBe(1);
  });
});
