import type { CapType, Color, NodeId, Pulse, SporeConfig } from './types';

export function isMushroom(id: NodeId): boolean {
  return id.startsWith('M');
}

export function isSocket(id: NodeId): boolean {
  return id.startsWith('D');
}

function invert(color: Color): Color {
  return color === 'R' ? 'B' : 'R';
}

export function applyCap(cap: CapType, color: Color): Color {
  return cap === 'PRISM' ? invert(color) : color;
}

export interface Arrival {
  readonly to: NodeId;
  readonly color: Color;
}

/**
 * Advances every in-flight pulse by one tick, splitting them into "still travelling" and
 * "arrived this tick". Spore's simulation groups arrivals by target and resolves collisions;
 * this helper deliberately makes no winner selection based on array order.
 */
export function advancePulses(pulses: readonly Pulse[]): { traveling: Pulse[]; arrivals: Arrival[] } {
  const traveling: Pulse[] = [];
  const arrivals: Arrival[] = [];
  for (const pulse of pulses) {
    const ticksRemaining = pulse.ticksRemaining - 1;
    if (ticksRemaining <= 0) arrivals.push({ to: pulse.to, color: pulse.color });
    else traveling.push({ ...pulse, ticksRemaining });
  }
  return { traveling, arrivals };
}

/** Spawns this tick's chant beat (if one is due): one broadcast color fanned out to every
 * currently-wired spout. Bespoke to Spore — see REPORT.md "Topology verdict". */
export function spawnBeat(config: SporeConfig, tick: number): Pulse[] {
  const beatIndex = Math.floor((tick - 1) / config.beatEveryTicks);
  if ((tick - 1) % config.beatEveryTicks !== 0 || beatIndex >= config.sequence.length) return [];
  const color = config.sequence[beatIndex]!;
  const spawned: Pulse[] = [];
  for (const spout of config.spouts) {
    const to = config.wires[spout];
    if (to) spawned.push({ from: spout, to, color, ticksRemaining: config.hopTicks });
  }
  return spawned;
}

/**
 * Forwards a signal that just arrived at a mushroom onward through its cap and outgoing wire.
 * Returns `null` if the mushroom has no outgoing wire — the signal fizzles and is dropped.
 */
export function forwardThroughMushroom(config: SporeConfig, mushroom: NodeId, incoming: Color): Pulse | null {
  const cap = config.caps[mushroom]!;
  const color = applyCap(cap, incoming);
  const nextHop = config.wires[mushroom];
  if (!nextHop) return null;
  return { from: mushroom, to: nextHop, color, ticksRemaining: config.hopTicks + config.dwellTicks[cap] };
}
