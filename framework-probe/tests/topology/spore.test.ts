import { describe, expect, it } from 'vitest';
import { createSporeStep, initialSporeState, sporeIntentAt } from '../../src/probes/spore-telegraph/sim';
import { createHistory } from '../../src/services/history';
import type { SporeConfig } from '../../src/probes/spore-telegraph/types';

const dwellTicks = { RELAY: 0, PRISM: 0, SNAIL: 3 };

describe('Spore Telegraph — RELAY and PRISM caps', () => {
  it('RELAY passes the beat color straight through to the socket', () => {
    const config: SporeConfig = {
      sequence: ['R'],
      expected: ['R', 'B', 'B'],
      spouts: ['S0'],
      caps: { M0: 'RELAY' },
      wires: { S0: 'M0', M0: 'D0' },
      beatEveryTicks: 1,
      hopTicks: 1,
      dwellTicks,
    };
    const history = createHistory(initialSporeState(), createSporeStep(config), sporeIntentAt);
    expect(history.stateAt(2).filled[0]).toBe(false); // still travelling: S0->M0 hop, M0->D0 hop
    expect(history.stateAt(3).filled[0]).toBe(true);
  });

  it('PRISM inverts the color it forwards', () => {
    const config: SporeConfig = {
      sequence: ['B'],
      expected: ['R', 'B', 'B'],
      spouts: ['S0'],
      caps: { M0: 'PRISM' },
      wires: { S0: 'M0', M0: 'D0' },
      beatEveryTicks: 1,
      hopTicks: 1,
      dwellTicks,
    };
    const history = createHistory(initialSporeState(), createSporeStep(config), sporeIntentAt);
    // blue broadcast, inverted to red by the prism, matches expected[0] = 'R'
    expect(history.stateAt(3).filled[0]).toBe(true);
  });
});

describe('Spore Telegraph — SNAIL adds dwell delay relative to RELAY', () => {
  it('a SNAIL-capped path arrives dwellTicks.SNAIL ticks later than an equivalent RELAY path', () => {
    const config: SporeConfig = {
      sequence: ['R'],
      expected: ['R', 'R', 'B'],
      spouts: ['S0', 'S1'],
      caps: { M0: 'RELAY', M1: 'SNAIL' },
      wires: { S0: 'M0', M0: 'D0', S1: 'M1', M1: 'D1' },
      beatEveryTicks: 1,
      hopTicks: 1,
      dwellTicks,
    };
    const history = createHistory(initialSporeState(), createSporeStep(config), sporeIntentAt);
    expect(history.stateAt(3).filled).toEqual([true, false, false]);
    expect(history.stateAt(5).filled).toEqual([true, false, false]); // SNAIL still en route
    expect(history.stateAt(6).filled).toEqual([true, true, false]); // +3 dwell ticks arrives here
  });
});

describe('Spore Telegraph — a wrong-color arrival slams the door shut', () => {
  it('ends the run and freezes state, rather than letting the simulation continue', () => {
    const config: SporeConfig = {
      sequence: ['R'],
      expected: ['B', 'B', 'B'],
      spouts: ['S0'],
      caps: {},
      wires: { S0: 'D0' },
      beatEveryTicks: 1,
      hopTicks: 1,
      dwellTicks,
    };
    const history = createHistory(initialSporeState(), createSporeStep(config), sporeIntentAt);
    const atSlam = history.stateAt(2);
    expect(atSlam.ended).toBe(true);
    expect(atSlam.won).toBe(false);
    expect(atSlam.failedSocket).toBe(0);
    expect(history.stateAt(5)).toEqual(atSlam); // terminal latch: frozen, not just flagged
  });
});

describe('Spore Telegraph — an unwired output fizzles instead of arriving', () => {
  it('never fills any socket and never ends the run', () => {
    const config: SporeConfig = {
      sequence: ['R', 'B', 'B', 'R', 'B'],
      expected: ['R', 'B', 'B'],
      spouts: ['S0'],
      caps: {},
      wires: {}, // S0 has no outgoing wire at all
      beatEveryTicks: 2,
      hopTicks: 2,
      dwellTicks,
    };
    const history = createHistory(initialSporeState(), createSporeStep(config), sporeIntentAt);
    const late = history.stateAt(50);
    expect(late.filled).toEqual([false, false, false]);
    expect(late.ended).toBe(false);
    expect(late.won).toBe(false);
  });
});

describe('Spore Telegraph — an already-filled socket bounces off a second correct arrival', () => {
  it('stays filled without side effects, and the run only completes once every socket is filled', () => {
    const config: SporeConfig = {
      sequence: ['R'],
      expected: ['R', 'B', 'B'],
      spouts: ['S0', 'S1'], // both spouts wired to the SAME socket
      caps: {},
      wires: { S0: 'D0', S1: 'D0' },
      beatEveryTicks: 1,
      hopTicks: 1,
      dwellTicks,
    };
    const history = createHistory(initialSporeState(), createSporeStep(config), sporeIntentAt);
    const atArrival = history.stateAt(2);
    expect(atArrival.filled).toEqual([true, false, false]);
    expect(atArrival.ended).toBe(false); // sockets 1 and 2 are still unfilled
  });
});

describe('Spore Telegraph — same-tick arrivals preserve pulse creation order', () => {
  it('uses the RELAY color from the first-created pulse before the PRISM color', () => {
    const config: SporeConfig = {
      sequence: ['R'],
      expected: ['R', 'B', 'B'],
      spouts: ['S0', 'S1'],
      caps: { M0: 'RELAY', M1: 'PRISM' },
      wires: { S0: 'M0', M0: 'D0', S1: 'M1', M1: 'D0' },
      beatEveryTicks: 1,
      hopTicks: 1,
      dwellTicks,
    };
    const history = createHistory(initialSporeState(), createSporeStep(config), sporeIntentAt);

    const atSameTickArrival = history.stateAt(3);

    expect(atSameTickArrival.filled).toEqual([true, false, false]);
    expect(atSameTickArrival.ended).toBe(false);
    expect(atSameTickArrival.failedSocket).toBeNull();
  });
});

describe('Spore Telegraph — filling every socket wins and freezes', () => {
  it('sets won + ended once all three sockets are correctly filled', () => {
    const config: SporeConfig = {
      sequence: ['R'],
      expected: ['R', 'R', 'R'],
      spouts: ['S0', 'S1', 'S2'],
      caps: {},
      wires: { S0: 'D0', S1: 'D1', S2: 'D2' },
      beatEveryTicks: 1,
      hopTicks: 1,
      dwellTicks,
    };
    const history = createHistory(initialSporeState(), createSporeStep(config), sporeIntentAt);
    const atWin = history.stateAt(2);
    expect(atWin.won).toBe(true);
    expect(atWin.ended).toBe(true);
    expect(history.stateAt(10)).toEqual(atWin);
  });
});
