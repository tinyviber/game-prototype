import type { StepFn, Tick } from './types';

/** Advances exactly one tick from a known prior state. A thin, named wrapper around `step`
 * so call sites read "advance the simulation" rather than invoking a bare function value. */
export function advance<S, I>(prev: Readonly<S>, tick: Tick, intent: I, step: StepFn<S, I>): S {
  return step(prev, tick, intent);
}

export type { IntentSource, RunDefinition, StepFn, Tick } from './types';
