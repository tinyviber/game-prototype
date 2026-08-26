import type { RunDefinition, Tick } from '../../core/types';

export interface History<S> {
  /** Returns the state at `tick`, extending an internal memoized timeline as needed. */
  stateAt(tick: Tick): S;
}

function snapshotInitialState<S>(initialState: S): S {
  return initialState !== null && typeof initialState === 'object' ? structuredClone(initialState) : initialState;
}

/**
 * The runtime timeline primitive. Binds one run definition at creation and memoizes every
 * computed state: forward playback (`stateAt(previous + 1)`) costs exactly one step call,
 * repeated or backward reads are O(1) cache hits, and reads past the cached range extend
 * the timeline incrementally instead of replaying from tick 0. Later authoring changes can
 * neither swap the bound step/input source nor mutate the retained initial state.
 */
export function createHistory<S, I>(definition: RunDefinition<S, I>): History<S> {
  const snapshot = Object.freeze({
    initialState: snapshotInitialState(definition.initialState),
    step: definition.step,
    inputSource: definition.inputSource,
  }) satisfies RunDefinition<S, I>;
  const timeline: S[] = [snapshotInitialState(definition.initialState)];

  return {
    stateAt(tick: Tick): S {
      if (!Number.isInteger(tick) || tick < 0) throw new RangeError(`tick must be a non-negative integer, got ${tick}`);
      for (let t = timeline.length; t <= tick; t++) {
        timeline.push(snapshot.step(timeline[t - 1]!, t, snapshot.inputSource(t)));
      }
      return timeline[tick]!;
    },
  };
}

/** State at `targetTick` in a single call, without keeping the timeline alive. */
export function replay<S, I>(definition: RunDefinition<S, I>, targetTick: Tick): S {
  return createHistory(definition).stateAt(targetTick);
}
