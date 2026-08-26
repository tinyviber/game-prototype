import { describe, expect, it } from 'vitest';
import { createDamRun, createDamStep, initialDamState } from '../../src/probes/dam/sim';
import { createHistory } from '../../src/services/history';
import type { DamConfig } from '../../src/probes/dam/types';

describe('Dam That Breathes — first-match rule scan', () => {
  it('the first rule whose threshold matches wins, even if a later rule also matches', () => {
    const config: DamConfig = {
      rules: [
        { below: 100, opening: 20 },
        { below: 60, opening: 80 },
      ],
      initialLevel: 48,
      initialOpening: 0,
    };
    const step = createDamStep(config);
    const next = step(initialDamState(config), 1, undefined);
    // level (48) satisfies BOTH rules; array order picks the first, not the tighter threshold.
    expect(next.opening).toBe(20);
  });

  it('falls back to the previous opening when no rule matches', () => {
    const config: DamConfig = { rules: [{ below: 10, opening: 90 }], initialLevel: 48, initialOpening: 42 };
    const step = createDamStep(config);
    const next = step(initialDamState(config), 1, undefined);
    expect(next.opening).toBe(42);
  });
});

describe('Dam That Breathes — gate is a forward-monotonic latch', () => {
  // A constant 60%-open sluice settles the reservoir into the 4-6 RPM band and holds it there.
  const config: DamConfig = { rules: [{ below: 1000, opening: 60 }], initialLevel: 48, initialOpening: 0 };
  const history = createHistory(createDamRun(config));

  it('tick 10 is truthfully still shut — the 8-tick streak cannot possibly have accumulated yet', () => {
    expect(history.stateAt(10).gate).toBe(false);
  });

  it('once the wheel hums steady for 8 ticks the gate opens, and every later tick stays open', () => {
    let firstOpenTick = -1;
    for (let t = 1; t <= 200; t++) {
      if (history.stateAt(t).gate) {
        firstOpenTick = t;
        break;
      }
    }
    expect(firstOpenTick).toBeGreaterThan(0);
    expect(history.stateAt(firstOpenTick - 1).gate).toBe(false);
    for (let t = firstOpenTick; t <= firstOpenTick + 30; t++) {
      expect(history.stateAt(t).gate).toBe(true);
    }
  });
});

describe('Dam That Breathes — burst is a terminal latch', () => {
  it('a permanently-shut sluice floods the reservoir past the burst level and then freezes', () => {
    const config: DamConfig = { rules: [], initialLevel: 48, initialOpening: 0 };
    const history = createHistory(createDamRun(config));

    let burstTick = -1;
    for (let t = 1; t <= 150; t++) {
      if (history.stateAt(t).burst) {
        burstTick = t;
        break;
      }
    }
    expect(burstTick).toBeGreaterThan(0);

    const atBurst = history.stateAt(burstTick);
    const muchLater = history.stateAt(burstTick + 20);
    // Frozen, not merely flagged: burst stops the fold entirely (level does not keep changing).
    expect(muchLater).toEqual(atBurst);
  });
});

describe('Dam That Breathes — a run owns its authored rule snapshot', () => {
  it('does not let later rule editing rewrite an existing history', () => {
    const rules = [{ below: 100, opening: 20 }];
    const config: DamConfig = { rules, initialLevel: 48, initialOpening: 0 };
    const history = createHistory(createDamRun(config));

    rules[0]!.opening = 80;

    expect(history.stateAt(1).opening).toBe(20);
  });
});
