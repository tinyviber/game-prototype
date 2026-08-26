/** A fixed discrete simulation instant. Tick 0 is the reset state. */
export type Tick = number;

/** Pure state transition. Wall-clock time and presentation never enter this contract. */
export type StepFn<S, I> = (previous: Readonly<S>, tick: Tick, intent: I) => S;

/** Supplies one authored intent for a tick. */
export type IntentSource<I> = (tick: Tick) => I;

/** The immutable definition captured by one Run. */
export interface RunDefinition<S, I> {
  readonly initialState: S;
  readonly step: StepFn<S, I>;
  readonly inputSource: IntentSource<I>;
}
