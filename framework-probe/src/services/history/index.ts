import { advance } from '../../core/kernel';
import type { RunDefinition, Tick } from '../../core/types';

export interface History<S> {
  /** Returns the true historical state at `tick`, recomputed by replaying from tick 0. */
  stateAt(tick: Tick): S;
}

function snapshotInitialState<S>(initialState: S): S {
  return initialState !== null && typeof initialState === 'object' ? structuredClone(initialState) : initialState;
}

/** Replays one run definition from tick 0; replay is a History service, not a core primitive. */
export function replay<S, I>(definition: RunDefinition<S, I>, targetTick: Tick): S {
  let state = definition.initialState;
  const inputSource = definition.inputSource ?? (() => undefined as I);
  for (let t = 1; t <= targetTick; t++) {
    state = advance(state, t, inputSource(t), definition.step);
  }
  return state;
}

/** Binds a run snapshot once; later authoring changes cannot replace its step or input source. */
export function createHistory<S, I>(definition: RunDefinition<S, I>): History<S> {
  const snapshot = Object.freeze({
    initialState: snapshotInitialState(definition.initialState),
    step: definition.step,
    inputSource: definition.inputSource,
  }) satisfies RunDefinition<S, I>;
  return {
    stateAt(tick: Tick): S {
      return replay(snapshot, tick);
    },
  };
}
