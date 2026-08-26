import type { IntentSource, StepFn, Tick } from '../../core/types';
import { computeLitMap, neighborsOf } from './topology';
import type { Direction, MossConfig, MossIntent, MossState, Plant } from './types';

const DIRS: Record<Direction, { dx: number; dy: number }> = {
  U: { dx: 0, dy: -1 },
  D: { dx: 0, dy: 1 },
  L: { dx: -1, dy: 0 },
  R: { dx: 1, dy: 0 },
};

/**
 * Deterministic LCG so replay-from-tick-0 reproduces identical sprouting every time. The RNG's
 * own state must live inside MossState (see REPORT.md "Core changes: RNG-in-state"), otherwise
 * a fresh closure per replay call would silently diverge from a live run's rolls.
 */
function nextRandom(state: number): [roll: number, nextState: number] {
  const next = (state * 1664525 + 1013904223) >>> 0;
  return [next / 4294967296, next];
}

export function initialMossState(config: MossConfig): MossState {
  return {
    plants: config.plants,
    spores: 0,
    firstColor: null,
    secondColor: null,
    bloomed: false,
    explorerX: 0,
    explorerY: 0,
    rngState: config.seed >>> 0,
  };
}

function inBounds(config: MossConfig, x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x < config.bounds.width && y < config.bounds.height;
}

function isReserved(config: MossConfig, x: number, y: number): boolean {
  return (
    (x === config.source.x && y === config.source.y) ||
    (x === config.flower.x && y === config.flower.y) ||
    (x === config.fern.x && y === config.fern.y)
  );
}

function isFernSterileRing(config: MossConfig, x: number, y: number): boolean {
  return Math.abs(x - config.fern.x) + Math.abs(y - config.fern.y) === 1;
}

function pickSproutSpot(from: Plant, occupiedKeys: ReadonlySet<string>, config: MossConfig, roll: number): Plant | null {
  const candidates = neighborsOf(from).filter(
    (n) =>
      inBounds(config, n.x, n.y) &&
      !occupiedKeys.has(`${n.x},${n.y}`) &&
      !isReserved(config, n.x, n.y) &&
      !isFernSterileRing(config, n.x, n.y),
  );
  if (!candidates.length) return null;
  const chosen = candidates[Math.floor(roll * candidates.length) % candidates.length]!;
  return { x: chosen.x, y: chosen.y, type: 'moss' };
}

export function createMossStep(config: MossConfig): StepFn<MossState, MossIntent> {
  return (prev, tick, intent) => {
    const lit = computeLitMap(prev.plants, config.source, config.relaxationSteps);
    const litNow = (x: number, y: number) => {
      const cell = lit.get(`${x},${y}`);
      return cell && cell.dist <= tick ? cell : undefined;
    };

    const fernLit = neighborsOf(config.fern).some((n) => litNow(n.x, n.y));
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
      for (const n of neighborsOf(config.flower)) {
        const cell = litNow(n.x, n.y);
        if (!cell) continue;
        if (firstColor === null) firstColor = cell.color;
        else if (cell.color !== firstColor && secondColor === null) secondColor = cell.color;
      }
    }
    // Monotonic latch: red-then-blue ever having arrived is remembered forever.
    const bloomed = prev.bloomed || (firstColor === 'R' && secondColor === 'B');

    let plants = prev.plants;
    let rngState = prev.rngState;
    if (tick > 0 && tick % config.sproutEveryTicks === 0) {
      const grown: Plant[] = [];
      const occupied = new Set(plants.map((p) => `${p.x},${p.y}`));
      for (const plant of plants) {
        const cell = litNow(plant.x, plant.y);
        if (!cell || cell.dist < config.matureDistance) continue;
        const [roll, afterRoll] = nextRandom(rngState);
        rngState = afterRoll;
        if (roll >= config.sproutChance) continue;
        const [placementRoll, afterPlacement] = nextRandom(rngState);
        rngState = afterPlacement;
        const spot = pickSproutSpot(plant, occupied, config, placementRoll);
        if (spot) {
          grown.push(spot);
          occupied.add(`${spot.x},${spot.y}`);
        }
      }
      if (grown.length) plants = [...plants, ...grown];
    }

    let { explorerX, explorerY } = prev;
    if (intent.move) {
      const { dx, dy } = DIRS[intent.move];
      const nx = explorerX + dx;
      const ny = explorerY + dy;
      const blockedByDormantFlower = nx === config.flower.x && ny === config.flower.y && !bloomed;
      if (inBounds(config, nx, ny) && !blockedByDormantFlower) {
        explorerX = nx;
        explorerY = ny;
      }
    }

    return { plants, spores, firstColor, secondColor, bloomed, explorerX, explorerY, rngState };
  };
}

export function mossIntentAt(moveLog: readonly { readonly tick: Tick; readonly move: Direction }[]): IntentSource<MossIntent> {
  return (tick) => ({ move: moveLog.find((entry) => entry.tick === tick)?.move });
}
