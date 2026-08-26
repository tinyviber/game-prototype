import type { RunDefinition, Tick } from '../core/types';

export interface History<S> {
  stateAt(tick: Tick): Readonly<S>;
  readonly lastComputedTick: Tick;
}

function clone<T>(value: T): T {
  if (value === null || typeof value !== 'object') return value;
  return structuredClone(value);
}

/** Incremental, memoized history for one run-owned definition. */
export function createHistory<S, I>(definition: RunDefinition<S, I>): History<S> {
  const timeline: S[] = [clone(definition.initialState)];
  let computed = 0;

  return {
    stateAt(tick: Tick): Readonly<S> {
      if (!Number.isInteger(tick) || tick < 0) {
        throw new RangeError(`Invalid tick: ${tick}`);
      }
      while (computed < tick) {
        const nextTick = computed + 1;
        const next = definition.step(timeline[computed], nextTick, definition.inputSource(nextTick));
        timeline.push(clone(next));
        computed = nextTick;
      }
      return timeline[tick];
    },
    get lastComputedTick() {
      return computed;
    },
  };
}
