import type { IntentSource, StepFn, Tick } from '../../core/types';
import { replay } from '../../core/kernel';

export interface History<S> {
  /** Returns the true historical state at `tick`, recomputed by replaying from tick 0. */
  stateAt(tick: Tick): S;
}

/**
 * Wraps `core.replay` behind a `stateAt(tick)` surface. Deliberately has no snapshotting or
 * caching: every call re-folds from the initial state, per the probe brief's "first version
 * is pure replay" rule. Generic over any probe's (S, I) — proven necessary by Dam (which
 * requires `stateAt`) and reused as-is by every other probe with zero adaptation.
 */
export function createHistory<S, I>(
  initial: S,
  step: StepFn<S, I>,
  intentAt: IntentSource<I>,
): History<S> {
  return {
    stateAt(tick: Tick): S {
      return replay(initial, step, intentAt, tick);
    },
  };
}
