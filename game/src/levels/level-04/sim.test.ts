import { describe, expect, it } from 'vitest';
import { createHistory } from '../../runtime/history';
import { createRun, defaultProgram, expandedProgram, replayProgram } from './sim';

describe('level 4 useful little loop', () => {
  it('jams on the exact extra move beat', () => {
    const state = createHistory(createRun(defaultProgram)).stateAt(5);
    expect(state.status).toBe('failed');
    expect(state.failureBeat).toBe(5);
  });
  it('accepts the expanded dumb solution', () => {
    const state = createHistory(createRun(expandedProgram)).stateAt(5);
    expect(state.status).toBe('success');
    expect(state.serviced).toBe(2);
  });
  it('replays the recorded physical routine with the same outcome', () => {
    const state = createHistory(createRun(replayProgram)).stateAt(8);
    expect(state.status).toBe('success');
    expect(state.serviced).toBe(2);
    expect(state.capsule).toEqual(['move', 'interact']);
  });
});
