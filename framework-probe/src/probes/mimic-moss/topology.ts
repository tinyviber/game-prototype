import type { Color, Plant, Point } from './types';

export interface LitCell {
  readonly color: Color;
  readonly dist: number;
}

function key(x: number, y: number): string {
  return `${x},${y}`;
}

export function neighborsOf(p: Point): Point[] {
  return [
    { x: p.x + 1, y: p.y },
    { x: p.x - 1, y: p.y },
    { x: p.x, y: p.y + 1 },
    { x: p.x, y: p.y - 1 },
  ];
}

export function invert(color: Color): Color {
  return color === 'R' ? 'B' : 'R';
}

/**
 * Synchronous relaxation from a single fixed-color source through player-placed plants: a
 * cell's distance is 1 + its best lit neighbor's distance (shortest distance wins, red breaks
 * ties), and a dye plant inverts whatever color it receives. This does NOT depend on tick —
 * "path length becomes delay" is applied afterwards by the caller via `dist <= tick`, which is
 * what makes this a plain post-tick read rather than persisted simulation state.
 *
 * Kept private to Moss: Spore Telegraph propagates pulses along directed wires with per-node
 * dwell delays — different enough rules that a shared "propagation" module would couple two
 * unrelated mechanics.
 */
export function computeLitMap(
  plants: readonly Plant[],
  source: Point & { color: Color },
  relaxationSteps: number,
): Map<string, LitCell> {
  let lit = new Map<string, LitCell>([[key(source.x, source.y), { color: source.color, dist: 0 }]]);
  for (let step = 0; step < relaxationSteps; step++) {
    const next = new Map(lit);
    for (const plant of plants) {
      const cellKey = key(plant.x, plant.y);
      if (next.has(cellKey)) continue;
      let best: LitCell | undefined;
      for (const n of neighborsOf(plant)) {
        const candidate =
          n.x === source.x && n.y === source.y ? { color: source.color, dist: 0 } : lit.get(key(n.x, n.y));
        if (!candidate) continue;
        if (!best || candidate.dist < best.dist || (candidate.dist === best.dist && candidate.color === 'R')) {
          best = candidate;
        }
      }
      if (best) {
        next.set(cellKey, { color: plant.type === 'dye' ? invert(best.color) : best.color, dist: best.dist + 1 });
      }
    }
    lit = next;
  }
  return lit;
}
