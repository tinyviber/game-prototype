import { describe, expect, it } from 'vitest';
import { replay } from '../../src/core/kernel';
import { createHistory } from '../../src/services/history';
import { bothPressedThisTick, createEchoStep, echoIntentAt, initialEchoState } from '../../src/probes/echo-chamber/sim';
import type { EchoConfig } from '../../src/probes/echo-chamber/types';

function run(config: EchoConfig, targetTick: number) {
  return replay(initialEchoState(), createEchoStep(config), echoIntentAt(config), targetTick);
}

describe('Echo Chamber Bridge — Case A: unequal path lengths, no WAIT', () => {
  const config: EchoConfig = {
    echoProgram: ['MOVE', 'MOVE', 'MOVE', 'PRESS'],
    liveProgram: ['MOVE', 'MOVE', 'MOVE', 'MOVE', 'MOVE', 'PRESS'],
    echoPlate: 3,
    livePlate: 5,
  };

  it('never opens the gate: presses land on different ticks (4 vs 6)', () => {
    const final = run(config, 6);
    expect(final.gateOpened).toBe(false);
  });
});

describe('Echo Chamber Bridge — Case B: WAIT aligns the shorter path', () => {
  const config: EchoConfig = {
    echoProgram: ['MOVE', 'MOVE', 'MOVE', 'WAIT', 'WAIT', 'PRESS'],
    liveProgram: ['MOVE', 'MOVE', 'MOVE', 'MOVE', 'MOVE', 'PRESS'],
    echoPlate: 3,
    livePlate: 5,
  };

  it('both PRESS on tick 6 and the gate opens on that exact tick', () => {
    const history = createHistory(initialEchoState(), createEchoStep(config), echoIntentAt(config));
    expect(history.stateAt(5).gateOpened).toBe(false);
    const atSix = history.stateAt(6);
    expect(bothPressedThisTick(atSix)).toBe(true);
    expect(atSix.gateOpened).toBe(true);
  });

  it('the gate stays open (monotonic latch) on later ticks even though the per-tick press flags reset', () => {
    const history = createHistory(initialEchoState(), createEchoStep(config), echoIntentAt(config));
    const atEight = history.stateAt(8);
    expect(atEight.gateOpened).toBe(true);
    expect(bothPressedThisTick(atEight)).toBe(false); // transient flag, not carried forward
  });
});

describe('Echo Chamber Bridge — Case C: PRESS off the plate consumes a tick', () => {
  const config: EchoConfig = {
    echoProgram: ['PRESS', 'MOVE', 'MOVE', 'MOVE', 'PRESS'],
    liveProgram: ['WAIT', 'WAIT', 'WAIT', 'WAIT', 'WAIT'],
    echoPlate: 3,
    livePlate: 5,
  };

  it('a PRESS while off-plate does not move the lane and does not count as pressed', () => {
    const history = createHistory(initialEchoState(), createEchoStep(config), echoIntentAt(config));
    const atOne = history.stateAt(1);
    expect(atOne.echoPos).toBe(0);
    expect(atOne.echoPressed).toBe(false);
  });

  it('the next tick executes the next instruction rather than retrying the failed PRESS', () => {
    const history = createHistory(initialEchoState(), createEchoStep(config), echoIntentAt(config));
    // program[1] is 'MOVE', not another 'PRESS' — if it had retried index 0 this would still be 0.
    expect(history.stateAt(2).echoPos).toBe(1);
  });

  it('eventually presses successfully once back on the plate', () => {
    const history = createHistory(initialEchoState(), createEchoStep(config), echoIntentAt(config));
    expect(history.stateAt(5).echoPressed).toBe(true);
  });
});

describe('Echo Chamber Bridge — Case D: finite sequence terminates, never loops', () => {
  const config: EchoConfig = {
    echoProgram: ['MOVE', 'WAIT'],
    liveProgram: [],
    echoPlate: 5,
    livePlate: 5,
  };

  it('holds position past the end of the program instead of wrapping via modulo', () => {
    const history = createHistory(initialEchoState(), createEchoStep(config), echoIntentAt(config));
    expect(history.stateAt(2).echoPos).toBe(1);
    // A modulo-wrapping cursor would replay 'MOVE' again at tick 3 and reach pos 2.
    expect(history.stateAt(3).echoPos).toBe(1);
    expect(history.stateAt(6).echoPos).toBe(1);
  });
});
