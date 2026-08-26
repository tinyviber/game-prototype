import { describe, expect, it } from 'vitest';
import { createHistory } from '../../runtime/history';
import { createRun, defaultProgram, initialState, repairProgram, step } from './sim';

describe('level 3 pocket of light', () => {
  it('rejects an empty pocket at the far gate', () => {
    const state = createHistory(createRun(defaultProgram)).stateAt(4);
    expect(state.status).toBe('failed');
    expect(state.message).toContain('empty pocket');
  });
  it('observes, carries, and applies the runtime glyph', () => {
    const state = createHistory(createRun(repairProgram)).stateAt(5);
    expect(state.status).toBe('success');
    expect(state.pocket).toBe('amber');
  });
  it('distinguishes a wrong glyph from an empty pocket', () => {
    const state = step({ ...initialState, position: 3, pocket: 'blue' }, 1, 'apply');
    expect(state.status).toBe('failed');
    expect(state.message).toContain('wrong glyph');
  });
});
