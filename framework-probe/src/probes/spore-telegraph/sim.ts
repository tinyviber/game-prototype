import type { IntentSource, RunDefinition, StepFn } from '../../core/types';
import { advancePulses, forwardThroughMushroom, isMushroom, isSocket, spawnBeat } from './topology';
import type { SporeConfig, SporeIntent, SporeState } from './types';

export function initialSporeState(): SporeState {
  return { pulses: [], filled: [false, false, false], ended: false, won: false, failedSocket: null };
}

export function createSporeStep(config: SporeConfig): StepFn<SporeState, SporeIntent> {
  const snapshot = snapshotSporeConfig(config);
  return (prev, tick) => {
    if (prev.ended) return prev; // terminal latch: a decided door does not keep simulating

    const { traveling, arrivals } = advancePulses(prev.pulses);
    const pulses = [...traveling, ...spawnBeat(snapshot, tick)];

    const filled = [...prev.filled] as [boolean, boolean, boolean];
    let ended = false;
    let won = false;
    let failedSocket: number | null = null;

    const arrivalsByTarget = new Map<string, typeof arrivals>();
    for (const arrival of arrivals) {
      const group = arrivalsByTarget.get(arrival.to) ?? [];
      group.push(arrival);
      arrivalsByTarget.set(arrival.to, group);
    }

    // Spore's visible node labels define processing order; pulse array order never selects a winner.
    const targets = [...arrivalsByTarget.keys()].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    for (const target of targets) {
      if (ended) break;
      const targetArrivals = arrivalsByTarget.get(target)!;
      if (targetArrivals.length > 1) continue; // same-node collision: all competing pulses are destroyed
      const arrival = targetArrivals[0]!;
      if (isMushroom(arrival.to)) {
        const forwarded = forwardThroughMushroom(snapshot, arrival.to, arrival.color);
        if (forwarded) pulses.push(forwarded); // else: fizzles, dropped
      } else if (isSocket(arrival.to)) {
        const idx = Number(arrival.to.slice(1));
        if (filled[idx]) continue; // bounces off an already-filled socket, no effect
        if (arrival.color === snapshot.expected[idx]) {
          filled[idx] = true;
        } else {
          ended = true;
          failedSocket = idx;
        }
      }
    }

    if (!ended && filled.every(Boolean)) {
      ended = true;
      won = true;
    }

    return { pulses, filled, ended, won, failedSocket };
  };
}

export const sporeIntentAt: IntentSource<SporeIntent> = () => undefined;

function snapshotSporeConfig(config: SporeConfig): SporeConfig {
  return {
    sequence: [...config.sequence],
    expected: [...config.expected] as SporeConfig['expected'],
    spouts: [...config.spouts],
    caps: { ...config.caps },
    wires: { ...config.wires },
    beatEveryTicks: config.beatEveryTicks,
    hopTicks: config.hopTicks,
    dwellTicks: { ...config.dwellTicks },
  };
}

export function createSporeRun(config: SporeConfig): RunDefinition<SporeState, SporeIntent> {
  const snapshot = snapshotSporeConfig(config);
  return { initialState: initialSporeState(), step: createSporeStep(snapshot), inputSource: sporeIntentAt };
}
