import type { Tick } from '../../core/types';

/** A pure projection helper for presentation; it is not a simulation primitive. */
export type Query<S, V> = (state: S, tick: Tick) => V;

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
