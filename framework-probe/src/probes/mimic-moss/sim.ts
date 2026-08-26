import type { IntentSource, RunDefinition, StepFn } from '../../core/types';
import { computeLitMap, neighborsOf } from './topology';
import type { MossConfig, MossIntent, MossState } from './types';

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
  return { spores: 0, firstColor: null, secondColor: null, bloomed: false };
}

export function createMossStep(config: MossConfig): StepFn<MossState, MossIntent> {
  const snapshot = snapshotMossConfig(config);
  return (prev, tick) => {
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

    return { spores, firstColor, secondColor, bloomed };
  };
}

export function createMossRun(config: MossConfig): RunDefinition<MossState, MossIntent> {
  const snapshot = snapshotMossConfig(config);
  return {
    initialState: initialMossState(),
    step: createMossStep(snapshot),
    inputSource: mossIntentAt,
  };
}

export const mossIntentAt: IntentSource<MossIntent> = () => undefined;
