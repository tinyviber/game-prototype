export interface ThresholdRule {
  readonly below: number;
  readonly opening: number;
}

export interface DamConfig {
  readonly rules: readonly ThresholdRule[];
  readonly initialLevel: number;
  readonly initialOpening: number;
}

export interface DamState {
  readonly level: number;
  readonly opening: number;
  readonly outflow: number;
  /** Consecutive ticks the wheel has spent inside the RPM band. Resets to 0 the instant it leaves. */
  readonly streak: number;
  /** Monotonic latch: once the wheel has hummed steady for STREAK_NEED ticks, the gate stays open. */
  readonly gate: boolean;
  /** Monotonic latch: once the reservoir bursts, the simulation freezes (terminal failure). */
  readonly burst: boolean;
}

export type DamIntent = void;
