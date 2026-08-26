import type { RunDefinition, Tick } from '../../core/types';

export interface History<S> {
  /** Returns the state at `tick` as a read-only view — the same shallow-readonly strength a
   * `StepFn` receives its `prev` with. Mutating it is a type error; the timeline stays clean. */
  stateAt(tick: Tick): Readonly<S>;
}

function snapshotInitialState<S>(initialState: S): S {
  return initialState !== null && typeof initialState === 'object' ? structuredClone(initialState) : initialState;
}

/**
 * The runtime timeline primitive. Binds one run definition at creation and memoizes every
 * computed state: forward playback (`stateAt(previous + 1)`) costs exactly one step call,
 * repeated or backward reads never recompute, and reads past the cached range extend the
 * timeline incrementally instead of replaying from tick 0. Memoization guarantees recompute
 * behavior only — object identity of returned states is an implementation detail, not part
 * of the contract. Later authoring changes can neither swap the bound step/input source nor
 * mutate the retained initial state.
 */
export function createHistory<S, I>(definition: RunDefinition<S, I>): History<S> {
  const snapshot = Object.freeze({
    initialState: snapshotInitialState(definition.initialState),
    step: definition.step,
    inputSource: definition.inputSource,
  }) satisfies RunDefinition<S, I>;
  const timeline: S[] = [snapshotInitialState(definition.initialState)];

  return {
    stateAt(tick: Tick): Readonly<S> {
      if (!Number.isInteger(tick) || tick < 0) throw new RangeError(`tick must be a non-negative integer, got ${tick}`);
      for (let t = timeline.length; t <= tick; t++) {
        timeline.push(snapshot.step(timeline[t - 1]!, t, snapshot.inputSource(t)));
      }
      return timeline[tick]!;
    },
  };
}

/** State at `targetTick` in a single call, without keeping the timeline alive. */
export function replay<S, I>(definition: RunDefinition<S, I>, targetTick: Tick): Readonly<S> {
  return createHistory(definition).stateAt(targetTick);
}
