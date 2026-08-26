# FRAMEWORK_CANDIDATES.md

**Role:** Subagent-Beta (Radical Paradigm Brainstormer), checked by Alpha/Gamma for genuine heterogeneity. Three candidates below share the same 5-primitive vocabulary (`PRIMITIVE_COMPOSITION.md`) but differ in **which primitive is the organizing center of the kernel** — this is what makes them architecturally distinct rather than reskins of one engine.

---

## Candidate 1 — "The Tape Machine" (imperative / VM-centric)

**One-sentence identity:** the world is a fetch-execute loop; `Directive(sequence)` and its program counter are the primary object, everything else hangs off it.

**Core data structures**
```ts
type World = {
  cells: Record<string, StateCell>
  lists: DirectiveList[]           // one per actor; each carries its own pc (sequence) or none (scan)
  log: { authority: 'observational'; entries: TraceEntry[] }   // default: NOT authoritative
}
```

**Kernel loop**
```ts
function tick(world: World, t: Clock): World {
  const firings = world.lists.flatMap(l =>
    l.mode === 'sequence' ? [{list: l, directive: l.items[l.pc], tick: t}]
                           : l.items.map(d => ({list: l, directive: d, tick: t})))
  let w = world
  const trace: TraceEntry[] = []
  for (const f of firings) {
    const r = transitionFor(f.directive.op)(w, f)
    w = r.world; trace.push(r.trace)
    if (f.list.mode === 'sequence' && r.ok) f.list.pc = (f.list.pc + 1) % f.list.items.length
  }
  return { ...w, log: { authority: 'observational', entries: [...w.log.entries, ...trace] } }
}
```
Mutation is **direct**: `transitionFor` writes straight into `w.cells`. The log is a side-channel, off by default. A puzzle *opts in* to `authority: 'fold'` only if it specifically needs scrubbing.

**Authoring implication:** the player-facing surface is literally "a numbered list of steps," matching `blind-batch-001`'s shipped convention almost verbatim. `scan`-mode lists render as "always-on rules" beside the numbered list.

**Best fit:** Firefly Lamplighter, March the Oaf, all of `blind-batch-001` — anything where "my program is a to-do list" is the natural mental model.
**Worst fit:** Echo Canyon / Dam-style puzzles that want free timeline scrubbing — under Candidate 1 that costs a per-puzzle opt-in and a hand-written replay path, not a kernel guarantee.
**Known weakness:** nothing stops an author from doing what Firefly Lamplighter did — mutating countdown state in place inside a `Directive` object — because direct mutation is the default discipline and the kernel does not forbid it.

---

## Candidate 2 — "The Ledger" (event-sourced / reducer-centric)

**One-sentence identity:** the world is never stored; it is always *recomputed* from an authoritative log — matching what `cross-model-deepseek`'s `SIM.run` already does in shipped code.

**Core data structures**
```ts
type Log = { rules: DirectiveList[]; events: Array<{ tick: Clock; op: string; args: any }> }
function stateAt(log: Log, uptoTick: Clock): World {
  let w = initialWorld()
  for (let t = 0; t <= uptoTick; t++) {
    const firings = collectFirings(log.rules, log.events, t)      // scan-mode rules + any sequence-mode event due at t
    for (const f of firings) w = transitionFor(f.op)(w, f).world  // pure; no persistent World object outside this loop
  }
  return w
}
```
There is no `World` that survives between calls — `stateAt(log, T)` is a pure function, called fresh every time the UI needs a frame (exactly `SIM.run(rules, moves, maxT)`'s real signature). Scrubbing a time slider to any `T` (forward *or* backward) is the same call with a different argument — **no special-case rewind code required**, at the cost of O(T) work per query.

**Authoring implication:** the player edits `log.rules` (their program) and the log of "what I actually pressed" is recorded as timestamped events; "run" and "scrub" are the same operation at different `T`. A visible time-slider is a free, universal UI feature, not per-puzzle work.

**Best fit:** Echo Canyon, Dam That Breathes, anything where "let the kid drag time back and forth to see what happened" is pedagogically valuable — directly serves the product principle that execution must be spatially/temporally observable.
**Worst fit:** long-running or high-resolution puzzles — O(T) per query becomes O(T²) across a full stepped playthrough; at the corpus's observed scale (`maxT` in the hundreds) this is sub-millisecond, but it is a real, not hypothetical, scaling cliff (see `FRAMEWORK_ADVERSARIAL_REVIEW.md` §4 Combo 2 and §5).
**Known weakness:** editing `log.rules` **mid-run** is semantically ambiguous — replaying from t=0 with the *new* rules silently rewrites history that already happened under the *old* rules. Candidate 2 does not resolve this by itself (see adversarial review).

---

## Candidate 3 — "The Cellular Board" (dataflow / cell-centric)

**One-sentence identity:** the world is a labeled spreadsheet; most boxes are formulas, a few boxes are "my character's stuff," and a `Directive` is just the specific shape of value that instruction-holding cells happen to contain.

**Core data structures**
```ts
type Board = { cells: Record<string, StateCell> }
// an "actor position" cell is StateCell<stored>, but its GuardedTransition is triggered
// by looking up an instruction-shaped cell (a Directive list) at the current Clock —
// sequential movement is demoted to a special case of cell derivation, not the kernel's center.
```

**Kernel loop:** there is no fetch-execute step distinct from cell recomputation. Every tick:
1. All `stored` cells with a pending guarded write (including "the character consults its instruction-cell for this tick") commit, in a fixed declared order.
2. All `derived` cells recompute, once, from the freshly committed `stored` cells (one level only — §1.2's anti-glitch rule).

**Authoring implication:** the player mostly names and wires boxes (`doorOpen = sensor XOR toggle`); "my program" for a moving character is just one more named box whose formula happens to be "read my instruction-tape cell at time t." This mental model is a direct match for Mole Sensor Greenhouse / Blind Cave Fish / Circuit Golem's wiring-dropdown authoring surface, which already works this way without calling it that.

**Best fit:** wiring/sensor/ecology/law-mutation puzzles — Mole Sensor Greenhouse, Dam's rule cascade, Convergence Bells.
**Worst fit:** blind sequential delegation (March the Oaf) — describing "walk 3, push, smash, wait 2" as a spreadsheet formula is a strictly worse mental model than "a numbered list of steps"; nothing is gained and clarity is lost.
**Known weakness:** derived-cell purity (no cell may depend on another derived cell) must be enforced by the kernel, not by convention, or the classic FRP evaluation-order glitch returns.

---

## Comparison Table

| | Tape Machine | Ledger | Cellular Board |
|---|---|---|---|
| Organizing primitive | `Directive(sequence)` + PC | `Log(fold)` | `StateCell(derived)` |
| Default mutation discipline | direct | replay-fold | commit-then-derive, one level |
| Scrubbing/rewind | opt-in, per-puzzle | free, universal, O(T)/query | free for derived cells only; stored-cell history needs its own log |
| Best player mental model for... | delegation/sequence puzzles | echo/replay/debugging puzzles | wiring/sensor/ecology puzzles |
| Engine LOC order of magnitude | smallest | small + replay-cost bookkeeping | small + derivation-order discipline |
| Corpus precedent already shipped | `blind-batch-001` (all 9) | `cross-model-deepseek` (`SIM.run`) | `cross-model-kimi-k3` demo-04, `cross-model-claude-sonnet-5` demo-04/06 |

All three are carried forward, unweighted, into `FRAMEWORK_ADVERSARIAL_REVIEW.md` for red-team combat.
