import type { Tick } from './types';

/** A pure read of simulation state. Queries run after a tick commits and never mutate. */
export type Query<S, V> = (state: S, tick: Tick) => V;

/**
 * Runs a named bag of explicit queries against one state, producing exactly the view a
 * renderer needs. The projection is authored at each level-specific entry point, so a
 * renderer never needs to know that probe's simulation state shape.
 */
export function view<S, Q extends Record<string, Query<S, unknown>>>(
  state: S,
  tick: Tick,
  queries: Q,
): { [K in keyof Q]: Q[K] extends Query<S, infer V> ? V : never } {
  const out = {} as { [K in keyof Q]: Q[K] extends Query<S, infer V> ? V : never };
  for (const key in queries) {
    const query = queries[key]!;
    out[key] = query(state, tick) as (typeof out)[typeof key];
  }
  return out;
}
