import { describe, expect, it } from 'vitest';
import { createHistory } from '../../src/services/history';
import { computeLitMap } from '../../src/probes/mimic-moss/topology';
import { createMossRun, createMossStep, initialMossState } from '../../src/probes/mimic-moss/sim';
import type { MossConfig, Plant } from '../../src/probes/mimic-moss/types';

const baseConfig = {
  bounds: { width: 100, height: 100 },
  relaxationSteps: 20,
};

function historyFor(config: MossConfig) {
  return createHistory(createMossRun(config));
}

describe('Mimic Moss — static topology and signal delay', () => {
  it('transforms color at dye nodes and records one tick of delay per hop', () => {
    const plants: Plant[] = [
      { x: 1, y: 0, type: 'moss' },
      { x: 2, y: 0, type: 'dye' },
      { x: 3, y: 0, type: 'moss' },
    ];
    const lit = computeLitMap(plants, { x: 0, y: 0, color: 'R' }, 10);

    expect(lit.get('1,0')).toEqual({ color: 'R', dist: 1 });
    expect(lit.get('2,0')).toEqual({ color: 'B', dist: 2 });
    expect(lit.get('3,0')).toEqual({ color: 'B', dist: 3 });
  });

  it('keeps a configured path static while its signal becomes visible only after its distance', () => {
    const config: MossConfig = {
      ...baseConfig,
      plants: [
        { x: 1, y: 0, type: 'moss' },
        { x: 2, y: 0, type: 'dye' },
        { x: 3, y: 0, type: 'moss' },
      ],
      source: { x: 0, y: 0, color: 'R' },
      flower: { x: 4, y: 0 },
      fern: { x: 50, y: 50 },
    };
    const history = historyFor(config);

    expect(history.stateAt(1).firstColor).toBeNull();
    expect(history.stateAt(2).firstColor).toBeNull();
    expect(history.stateAt(3).firstColor).toBe('B');
    expect(history.stateAt(20).firstColor).toBe('B');
  });

  it('does not let authoring add a plant to an existing run history', () => {
    const plants: Plant[] = [{ x: 1, y: 0, type: 'moss' }];
    const config: MossConfig = {
      ...baseConfig,
      plants,
      source: { x: 0, y: 0, color: 'R' },
      flower: { x: 3, y: 0 },
      fern: { x: 50, y: 50 },
    };
    const history = historyFor(config);

    plants.push({ x: 2, y: 0, type: 'dye' });

    expect(history.stateAt(2).firstColor).toBeNull();
  });
});

describe('Mimic Moss — flower requires RED first, then BLUE, in that order', () => {
  const redThenBluePlants: Plant[] = [
    { x: 1, y: 0, type: 'moss' },
    { x: 2, y: 0, type: 'moss' },
    { x: 0, y: -1, type: 'moss' },
    { x: 1, y: -1, type: 'moss' },
    { x: 2, y: -1, type: 'dye' },
    { x: 3, y: -1, type: 'moss' },
  ];
  const config: MossConfig = {
    ...baseConfig,
    plants: redThenBluePlants,
    source: { x: 0, y: 0, color: 'R' },
    flower: { x: 3, y: 0 },
    fern: { x: 50, y: 50 },
  };

  it('blooms once red has arrived before blue, and the bloom latches monotonically', () => {
    const history = historyFor(config);
    let firstBloomTick = -1;
    for (let t = 1; t <= 30; t++) {
      if (history.stateAt(t).bloomed) {
        firstBloomTick = t;
        break;
      }
    }
    expect(firstBloomTick).toBeGreaterThan(0);
    for (let t = firstBloomTick; t <= firstBloomTick + 10; t++) {
      expect(history.stateAt(t).bloomed).toBe(true);
    }
  });

  it('never blooms if blue arrives before red', () => {
    const blueThenRedPlants: Plant[] = [
      { x: 1, y: 0, type: 'moss' },
      { x: 2, y: 0, type: 'dye' },
      { x: 0, y: -1, type: 'moss' },
      { x: 1, y: -1, type: 'moss' },
      { x: 2, y: -1, type: 'moss' },
      { x: 3, y: -1, type: 'moss' },
    ];
    const history = historyFor({ ...config, plants: blueThenRedPlants });
    expect(history.stateAt(30).bloomed).toBe(false);
  });
});

describe('Mimic Moss — the fern is a hazard that resets in-progress color memory', () => {
  it('same-tick fern activation wins over flower-neighbor color reception', () => {
    const config: MossConfig = {
      ...baseConfig,
      bounds: { width: 4, height: 4 },
      plants: [
        { x: 1, y: 0, type: 'moss' },
        { x: 0, y: 1, type: 'moss' },
      ],
      source: { x: 0, y: 0, color: 'R' },
      flower: { x: 2, y: 0 },
      fern: { x: 0, y: 2 },
    };
    const atTickOne = createMossStep(config)(initialMossState(), 1, {});

    expect(atTickOne.spores).toBeGreaterThan(0);
    expect(atTickOne.firstColor).toBeNull();
    expect(atTickOne.secondColor).toBeNull();
  });

  it('wipes accumulated color memory once lit, even after bloom', () => {
    const plants: Plant[] = [
      { x: 1, y: 0, type: 'moss' },
      { x: 2, y: 0, type: 'moss' },
      { x: 0, y: -1, type: 'moss' },
      { x: 1, y: -1, type: 'moss' },
      { x: 2, y: -1, type: 'dye' },
      { x: 3, y: -1, type: 'moss' },
      { x: 0, y: -2, type: 'moss' },
      { x: 0, y: -3, type: 'moss' },
      { x: 0, y: -4, type: 'moss' },
      { x: 0, y: -5, type: 'moss' },
      { x: 0, y: -6, type: 'moss' },
      { x: 0, y: -7, type: 'moss' },
      { x: 0, y: -8, type: 'moss' },
    ];
    const config: MossConfig = {
      ...baseConfig,
      plants,
      source: { x: 0, y: 0, color: 'R' },
      flower: { x: 3, y: 0 },
      fern: { x: 0, y: -9 },
    };
    const history = historyFor(config);

    expect(history.stateAt(6).bloomed).toBe(true);
    expect(history.stateAt(6).spores).toBe(0);
    expect(history.stateAt(8).spores).toBeGreaterThan(0);
    expect(history.stateAt(8).firstColor).toBeNull();
    expect(history.stateAt(8).bloomed).toBe(true);
  });
});

describe('Mimic Moss — spore decay and explorer movement', () => {
  it('spores drain by exactly one per tick once the fern is dark again', () => {
    const config: MossConfig = {
      ...baseConfig,
      plants: [],
      source: { x: 0, y: 0, color: 'R' },
      flower: { x: 60, y: 60 },
      fern: { x: 50, y: 50 },
    };
    const next = createMossStep(config)({ ...initialMossState(), spores: 3 }, 5, {});
    expect(next.spores).toBe(2);
  });

  it('keeps the explorer inside all four boundaries', () => {
    const config: MossConfig = {
      ...baseConfig,
      bounds: { width: 2, height: 2 },
      plants: [],
      source: { x: 0, y: 0, color: 'R' },
      flower: { x: 10, y: 10 },
      fern: { x: 10, y: 10 },
    };
    const step = createMossStep(config);
    let state = initialMossState();

    state = step(state, 1, { move: 'L' });
    state = step(state, 2, { move: 'U' });
    state = step(state, 3, { move: 'R' });
    state = step(state, 4, { move: 'D' });
    state = step(state, 5, { move: 'R' });
    state = step(state, 6, { move: 'D' });

    expect({ x: state.explorerX, y: state.explorerY }).toEqual({ x: 1, y: 1 });
  });

  it('blocks a dormant flower but allows entry when bloom is already true', () => {
    const config: MossConfig = {
      ...baseConfig,
      bounds: { width: 3, height: 1 },
      plants: [],
      source: { x: 0, y: 0, color: 'R' },
      flower: { x: 1, y: 0 },
      fern: { x: 2, y: 0 },
    };
    const step = createMossStep(config);
    const initial = initialMossState();

    const blocked = step(initial, 1, { move: 'R' });
    const entered = step({ ...initial, bloomed: true }, 1, { move: 'R' });

    expect({ x: blocked.explorerX, y: blocked.explorerY }).toEqual({ x: 0, y: 0 });
    expect({ x: entered.explorerX, y: entered.explorerY }).toEqual({ x: 1, y: 0 });
  });
});
