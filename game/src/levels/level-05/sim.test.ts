import { describe, expect, it } from 'vitest';
import { createHistory } from '../../runtime/history';
import { createRun, defaultBindings, correctBindings } from './sim';
import { toView } from './view';

describe('level 5 crossed wires', () => {
  it('makes the crossed left wire hit the wall immediately', () => {
    const state = createHistory(createRun(defaultBindings)).stateAt(1);
    expect(state.status).toBe('failed');
    expect(state.wallHit).toBe(true);
    expect(state.actuator).toBe('rightArm');
  });
  it('lets both sensors reach their matching arms', () => {
    const state = createHistory(createRun(correctBindings)).stateAt(2);
    expect(state.status).toBe('success');
    expect(state.actuator).toBe('rightArm');
  });
  it('exposes the chosen wiring before any sensor fires', () => {
    const state = createHistory(createRun(correctBindings)).stateAt(0);
    expect(toView(state).bindings).toEqual(correctBindings);
  });
});
