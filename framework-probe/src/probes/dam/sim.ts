import type { IntentSource, StepFn, Tick } from '../../core/types';
import type { DamConfig, DamIntent, DamState, ThresholdRule } from './types';

const AREA = 4;
const BAND_LO = 4;
const BAND_HI = 6;
const STREAK_NEED = 8;
const BURST_LEVEL = 100;
const OUTFLOW_COEFFICIENT = 0.1;

/** Deterministic river pulse — a pure function of tick, never `Math.random()`. */
function inflow(tick: Tick): number {
  return 5 + 1.5 * Math.sin((2 * Math.PI * tick) / 70);
}

/**
 * First-match wins: rules are scanned in authored order and the scan stops at the first one
 * whose threshold the current level satisfies. This is the entire arbitration mechanism —
 * no priority field, no "all matching rules combine" pass. If nothing matches, the sluice
 * holds its previous opening.
 */
function scanRules(rules: readonly ThresholdRule[], level: number, previousOpening: number): number {
  for (const rule of rules) {
    if (level < rule.below) return rule.opening;
  }
  return previousOpening;
}

export function initialDamState(config: DamConfig): DamState {
  return {
    level: config.initialLevel,
    opening: config.initialOpening,
    outflow: 0,
    streak: 0,
    gate: false,
    burst: false,
  };
}

export function createDamStep(config: DamConfig): StepFn<DamState, DamIntent> {
  return (prev, tick) => {
    if (prev.burst) return prev; // terminal latch: a burst dam does not keep simulating

    const opening = scanRules(config.rules, prev.level, prev.opening);
    const outflow = Math.max(0, (opening / 100) * OUTFLOW_COEFFICIENT * prev.level);
    const rawLevel = prev.level + (inflow(tick) - outflow) / AREA;
    const burst = rawLevel > BURST_LEVEL;
    const level = Math.max(0, rawLevel);

    const inBand = outflow >= BAND_LO && outflow <= BAND_HI;
    const streak = inBand ? prev.streak + 1 : 0;
    const gate = prev.gate || streak >= STREAK_NEED;

    return { level, opening, outflow, streak, gate, burst };
  };
}

export const damIntentAt: IntentSource<DamIntent> = () => undefined;
