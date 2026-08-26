import type { IntentSource, StepFn, Tick } from './types';

/** Advances exactly one tick from a known prior state. A thin, named wrapper around `step`
 * so call sites read "advance the simulation" rather than invoking a bare function value. */
export function advance<S, I>(step: StepFn<S, I>, prev: S, tick: Tick, intent: I): S {
  return step(prev, tick, intent);
}

/**
 * Folds `step` from tick 1 through `targetTick`, always starting at `initial`. This is the
 * kernel's only replay strategy: there is no snapshotting and no caching. Tick T is defined
 * as "whatever pure folding from tick 0 produces" — services such as History build on this,
 * they do not reimplement it.
 */
export function replay<S, I>(
  initial: S,
  step: StepFn<S, I>,
  intentAt: IntentSource<I>,
  targetTick: Tick,
): S {
  let state = initial;
  for (let t = 1; t <= targetTick; t++) {
    state = step(state, t, intentAt(t));
  }
  return state;
}
