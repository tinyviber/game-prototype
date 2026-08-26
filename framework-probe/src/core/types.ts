/**
 * Core types shared by every probe. Deliberately tiny: a tick counter and the shape of a
 * pure per-tick transition. Nothing here may import PixiJS or any DOM API: simulation code
 * must stay runnable headlessly, which is what the whole test suite relies on.
 */

/** A discrete simulation instant. Ticks start at 1; tick 0 is the initial state before any step runs. */
export type Tick = number;

/**
 * The one mandatory contract every probe's simulation must satisfy:
 * given the previous tick's state and this tick's intent, deterministically produce the next state.
 * No Math.random(), no Date.now(), no reading anything outside (prev, tick, intent).
 */
export type StepFn<S, I> = (prev: Readonly<S>, tick: Tick, intent: I) => S;

/** Supplies the intent for a given tick. Kept as a function (not an array) so probes can
 * synthesize intents (e.g. indexing into an authored program) instead of pre-materializing them. */
export type IntentSource<I> = (tick: Tick) => I;

/** Immutable definition of one authored run. History binds this exact definition. */
export interface RunDefinition<S, I> {
  readonly initialState: S;
  readonly step: StepFn<S, I>;
  readonly inputSource: IntentSource<I>;
}
