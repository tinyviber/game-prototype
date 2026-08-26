import type { IntentSource, RunDefinition, StepFn, Tick } from '../../core/types';
import { computeLitMap, neighborsOf } from './topology';
import type { Direction, MossConfig, MossIntent, MossState } from './types';

const DIRS: Record<Direction, { dx: number; dy: number }> = {
  U: { dx: 0, dy: -1 },
  D: { dx: 0, dy: 1 },
  L: { dx: -1, dy: 0 },
  R: { dx: 1, dy: 0 },
};

function snapshotMossConfig(config: MossConfig): MossConfig {
  return {
    plants: config.plants.map((plant) => ({ ...plant })),
    source: { ...config.source },
    flower: { ...config.flower },
    fern: { ...config.fern },
    bounds: { ...config.bounds },
    relaxationSteps: config.relaxationSteps,
  };
}

export function initialMossState(): MossState {
  return {
    spores: 0,
    firstColor: null,
    secondColor: null,
    bloomed: false,
    explorerX: 0,
    explorerY: 0,
  };
}

function inBounds(config: MossConfig, x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x < config.bounds.width && y < config.bounds.height;
}

export function createMossStep(config: MossConfig): StepFn<MossState, MossIntent> {
  const snapshot = snapshotMossConfig(config);
  return (prev, tick, intent) => {
    const lit = computeLitMap(snapshot.plants, snapshot.source, snapshot.relaxationSteps);
    const litNow = (x: number, y: number) => {
      const cell = lit.get(`${x},${y}`);
      return cell && cell.dist <= tick ? cell : undefined;
    };

    const fernLit = neighborsOf(snapshot.fern).some((n) => litNow(n.x, n.y));
    let spores = prev.spores;
    if (fernLit) spores = Math.max(spores, 5);
    else if (spores > 0) spores -= 1;

    let firstColor = prev.firstColor;
    let secondColor = prev.secondColor;
    if (spores > 0) {
      // Spores clamp the flower shut: any color memory it was building is wiped.
      firstColor = null;
      secondColor = null;
    } else {
      for (const n of neighborsOf(snapshot.flower)) {
        const cell = litNow(n.x, n.y);
        if (!cell) continue;
        if (firstColor === null) firstColor = cell.color;
        else if (cell.color !== firstColor && secondColor === null) secondColor = cell.color;
      }
    }
    // Monotonic latch: red-then-blue ever having arrived is remembered forever.
    const bloomed = prev.bloomed || (firstColor === 'R' && secondColor === 'B');

    let { explorerX, explorerY } = prev;
    if (intent.move) {
      const { dx, dy } = DIRS[intent.move];
      const nx = explorerX + dx;
      const ny = explorerY + dy;
      const blockedByDormantFlower = nx === snapshot.flower.x && ny === snapshot.flower.y && !bloomed;
      if (inBounds(snapshot, nx, ny) && !blockedByDormantFlower) {
        explorerX = nx;
        explorerY = ny;
      }
    }

    return { spores, firstColor, secondColor, bloomed, explorerX, explorerY };
  };
}

export function createMossRun(config: MossConfig): RunDefinition<MossState, MossIntent> {
  const snapshot = snapshotMossConfig(config);
  return {
    initialState: initialMossState(),
    step: createMossStep(snapshot),
    inputSource: mossIntentAt([]),
  };
}

export function mossIntentAt(moveLog: readonly { readonly tick: Tick; readonly move: Direction }[]): IntentSource<MossIntent> {
  const snapshot = moveLog.map((entry) => ({ ...entry }));
  return (tick) => ({ move: snapshot.find((entry) => entry.tick === tick)?.move });
}
