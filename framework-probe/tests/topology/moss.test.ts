import { describe, expect, it } from 'vitest';
import { computeLitMap } from '../../src/probes/mimic-moss/topology';
import { createMossStep, initialMossState } from '../../src/probes/mimic-moss/sim';
import { replay } from '../../src/core/kernel';
import type { MossConfig, Plant } from '../../src/probes/mimic-moss/types';

const baseConfig = {
  bounds: { width: 100, height: 100 },
  seed: 1,
  sproutEveryTicks: 1_000_000, // effectively disabled unless a test overrides it
  sproutChance: 0,
  matureDistance: 3,
  relaxationSteps: 20,
};

describe('Mimic Moss — topology (computeLitMap)', () => {
  it('path length becomes delay: distance grows by 1 per hop from the source', () => {
    const plants: Plant[] = [
      { x: 1, y: 0, type: 'moss' },
      { x: 2, y: 0, type: 'dye' },
      { x: 3, y: 0, type: 'moss' },
    ];
    const lit = computeLitMap(plants, { x: 0, y: 0, color: 'R' }, 10);
    expect(lit.get('1,0')).toEqual({ color: 'R', dist: 1 });
    // a dye plant inverts whatever color it receives
    expect(lit.get('2,0')).toEqual({ color: 'B', dist: 2 });
    // downstream of the dye, plain moss just passes the (now inverted) color through
    expect(lit.get('3,0')).toEqual({ color: 'B', dist: 3 });
  });
});

describe('Mimic Moss — flower requires RED first, then BLUE, in that order', () => {
  // Two branches from one source: a short plain-moss branch (arrives RED, early) and a longer
  // dyed branch (arrives BLUE, later) — both terminate adjacent to the flower.
  const redThenBluePlants: Plant[] = [
    { x: 1, y: 0, type: 'moss' },
    { x: 2, y: 0, type: 'moss' }, // flower neighbor, RED, dist 2
    { x: 0, y: -1, type: 'moss' },
    { x: 1, y: -1, type: 'moss' },
    { x: 2, y: -1, type: 'dye' },
    { x: 3, y: -1, type: 'moss' }, // flower neighbor, BLUE, dist 4
  ];
  const config: MossConfig = {
    ...baseConfig,
    plants: redThenBluePlants,
    source: { x: 0, y: 0, color: 'R' },
    flower: { x: 3, y: 0 },
    fern: { x: 50, y: 50 },
  };

  it('blooms once red has arrived before blue, and the bloom latches monotonically', () => {
    const step = createMossStep(config);
    const intentAt = () => ({});
    let firstBloomTick = -1;
    for (let t = 1; t <= 30; t++) {
      if (replay(initialMossState(config), step, intentAt, t).bloomed) {
        firstBloomTick = t;
        break;
      }
    }
    expect(firstBloomTick).toBeGreaterThan(0);
    for (let t = firstBloomTick; t <= firstBloomTick + 10; t++) {
      expect(replay(initialMossState(config), step, intentAt, t).bloomed).toBe(true);
    }
  });

  it('never blooms if blue arrives before red (order-sensitive, not just "both colors seen")', () => {
    const blueThenRedPlants: Plant[] = [
      { x: 1, y: 0, type: 'moss' },
      { x: 2, y: 0, type: 'dye' }, // flower neighbor, BLUE, dist 2 (arrives first)
      { x: 0, y: -1, type: 'moss' },
      { x: 1, y: -1, type: 'moss' },
      { x: 2, y: -1, type: 'moss' },
      { x: 3, y: -1, type: 'moss' }, // flower neighbor, RED, dist 4 (arrives second)
    ];
    const swapped: MossConfig = { ...config, plants: blueThenRedPlants };
    const step = createMossStep(swapped);
    const final = replay(initialMossState(swapped), step, () => ({}), 30);
    expect(final.bloomed).toBe(false);
  });
});

describe('Mimic Moss — the fern is a hazard that resets in-progress color memory', () => {
  it('same-tick fern activation wins over flower-neighbor color reception', () => {
    const config: MossConfig = {
      ...baseConfig,
      bounds: { width: 4, height: 4 },
      plants: [
        { x: 1, y: 0, type: 'moss' }, // flower neighbor, lit on tick 1
        { x: 0, y: 1, type: 'moss' }, // fern neighbor, lit on tick 1
      ],
      source: { x: 0, y: 0, color: 'R' },
      flower: { x: 2, y: 0 },
      fern: { x: 0, y: 2 },
    };
    const step = createMossStep(config);

    const atTickOne = step(initialMossState(config), 1, {});

    expect(atTickOne.spores).toBeGreaterThan(0);
    expect(atTickOne.firstColor).toBeNull();
    expect(atTickOne.secondColor).toBeNull();
  });

  it('wipes accumulated first/second color once lit, even after bloom (latch survives, memory does not)', () => {
    const plants: Plant[] = [
      { x: 1, y: 0, type: 'moss' },
      { x: 2, y: 0, type: 'moss' }, // flower neighbor, RED, dist 2
      { x: 0, y: -1, type: 'moss' },
      { x: 1, y: -1, type: 'moss' },
      { x: 2, y: -1, type: 'dye' },
      { x: 3, y: -1, type: 'moss' }, // flower neighbor, BLUE, dist 4 -> bloom by tick 4
      // A long straight feeder that only reaches the fern's doorstep at distance 8.
      { x: 0, y: -2, type: 'moss' },
      { x: 0, y: -3, type: 'moss' },
      { x: 0, y: -4, type: 'moss' },
      { x: 0, y: -5, type: 'moss' },
      { x: 0, y: -6, type: 'moss' },
      { x: 0, y: -7, type: 'moss' },
      { x: 0, y: -8, type: 'moss' }, // fern neighbor, dist 8
    ];
    const config: MossConfig = {
      ...baseConfig,
      plants,
      source: { x: 0, y: 0, color: 'R' },
      flower: { x: 3, y: 0 },
      fern: { x: 0, y: -9 },
    };
    const step = createMossStep(config);
    const intentAt = () => ({});

    const beforeFernLights = replay(initialMossState(config), step, intentAt, 6);
    expect(beforeFernLights.bloomed).toBe(true);
    expect(beforeFernLights.spores).toBe(0);

    const afterFernLights = replay(initialMossState(config), step, intentAt, 8);
    expect(afterFernLights.spores).toBeGreaterThan(0);
    expect(afterFernLights.firstColor).toBeNull(); // memory wiped...
    expect(afterFernLights.bloomed).toBe(true); // ...but the latch does not un-bloom
  });
});

describe('Mimic Moss — spore decay', () => {
  it('spores drain by exactly one per tick once the fern is dark again', () => {
    const config: MossConfig = {
      ...baseConfig,
      plants: [],
      source: { x: 0, y: 0, color: 'R' },
      flower: { x: 60, y: 60 },
      fern: { x: 50, y: 50 }, // isolated: never adjacent to a lit cell
    };
    const step = createMossStep(config);
    const prev = { ...initialMossState(config), spores: 3 };
    const next = step(prev, 5, {});
    expect(next.spores).toBe(2);
  });
});

describe('Mimic Moss — sprouting and explorer movement', () => {
  it('replays sprouting identically when the seed is unchanged', () => {
    const config: MossConfig = {
      ...baseConfig,
      bounds: { width: 8, height: 8 },
      plants: [{ x: 1, y: 0, type: 'moss' }],
      source: { x: 0, y: 0, color: 'R' },
      flower: { x: 7, y: 7 },
      fern: { x: 7, y: 0 },
      seed: 12345,
      sproutEveryTicks: 1,
      sproutChance: 1,
      matureDistance: 1,
      relaxationSteps: 32,
    };
    const step = createMossStep(config);
    const initial = initialMossState(config);

    const firstReplay = replay(initial, step, () => ({}), 12);
    const secondReplay = replay(initial, step, () => ({}), 12);

    expect(firstReplay.plants.length).toBeGreaterThan(config.plants.length);
    expect(secondReplay).toEqual(firstReplay);
  });

  it('adds a plant when a mature sprout is due and its chance allows it', () => {
    const config: MossConfig = {
      ...baseConfig,
      bounds: { width: 4, height: 4 },
      plants: [{ x: 1, y: 0, type: 'moss' }],
      source: { x: 0, y: 0, color: 'R' },
      flower: { x: 3, y: 3 },
      fern: { x: 3, y: 0 },
      sproutEveryTicks: 2,
      sproutChance: 1,
      matureDistance: 1,
      relaxationSteps: 16,
    };
    const step = createMossStep(config);
    const initial = initialMossState(config);

    const beforeDue = step(initial, 1, {});
    const atDueTick = step(beforeDue, 2, {});

    expect(beforeDue.plants).toHaveLength(config.plants.length);
    expect(atDueTick.plants).toHaveLength(config.plants.length + 1);
  });

  it('never sprouts into a cell orthogonally adjacent to the fern', () => {
    const config: MossConfig = {
      ...baseConfig,
      bounds: { width: 4, height: 4 },
      plants: [{ x: 1, y: 1, type: 'moss' }],
      source: { x: 0, y: 1, color: 'R' },
      flower: { x: 3, y: 3 },
      fern: { x: 2, y: 2 },
      seed: 12345,
      sproutEveryTicks: 1,
      sproutChance: 1,
      matureDistance: 1,
    };
    const step = createMossStep(config);
    const initial = initialMossState(config);
    const initialKeys = new Set(config.plants.map((plant) => `${plant.x},${plant.y}`));
    const atTickOne = step(initial, 1, {});
    const newlyAdded = atTickOne.plants.filter((plant) => !initialKeys.has(`${plant.x},${plant.y}`));

    expect(newlyAdded.length).toBeGreaterThan(0);
    for (const plant of newlyAdded) {
      const distance = Math.abs(plant.x - config.fern.x) + Math.abs(plant.y - config.fern.y);
      expect(distance).toBeGreaterThan(1);
    }
  });

  it('keeps the explorer inside all four boundaries', () => {
    const config: MossConfig = {
      ...baseConfig,
      bounds: { width: 2, height: 2 },
      plants: [],
      source: { x: 0, y: 0, color: 'R' },
      // Keep reserved cells out of this focused movement test so they cannot mask
      // the lower/right boundary checks with flower or fern behavior.
      flower: { x: 10, y: 10 },
      fern: { x: 10, y: 10 },
    };
    const step = createMossStep(config);
    let state = initialMossState(config);

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
    const initial = initialMossState(config);

    const blocked = step(initial, 1, { move: 'R' });
    const entered = step({ ...initial, bloomed: true }, 1, { move: 'R' });

    expect({ x: blocked.explorerX, y: blocked.explorerY }).toEqual({ x: 0, y: 0 });
    expect({ x: entered.explorerX, y: entered.explorerY }).toEqual({ x: 1, y: 0 });
  });
});
