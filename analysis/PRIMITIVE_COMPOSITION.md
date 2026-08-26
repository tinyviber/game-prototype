# PRIMITIVE_COMPOSITION.md

**Role:** Subagent-Gamma (Minimalist / Occam's Razor). Input: the 5 surviving seeds from `PRIMITIVE_EXTRACTION.md` §4, plus the `LawCell` probation case. Output: a closed, formal primitive set (target ≤6, landed at **5**) and proof that 12 observed mechanic families are compositions of it, not new atoms.

---

## 1. The 5 Irreducible Core Primitives (formal spec)

### 1.1 `Clock`
```
type Clock = integer   // monotonic, starts at 0, advances by exactly 1 per kernel step
```
**Necessity proof:** remove it and "hold for N ticks" (Windup Sentries' patrol cycle), "N contiguous ticks in-band" (Dam's `streak`), "1.00s of cumulative overlap" (Echo Twin Waltz's `overlap`) all lose the notion of duration/ordering. Nothing else in the set can express "before/after."

### 1.2 `StateCell`
```
type StateCell<T> =
  | { kind: 'stored';  value: T }                                  // mutated only by a GuardedTransition
  | { kind: 'derived'; formula: (clock: Clock, stored: StoredView) => T }  // recomputed on every read, never mutated directly
type World = { cells: Record<string, StateCell<any>> }
```
**Restriction that matters:** a `derived` cell may read `Clock` and *stored* cells only — **never another derived cell**. One level of derivation, no chains. This single rule is what prevents the classic FRP "glitch"/evaluation-order hazard (Round-1 Paradigm-C weakness) without needing a dependency graph or topological sort.
**Necessity proof:** without `stored`, no world fact (position, inventory, resource level) can persist across ticks. Without `derived`, quantities like Convergence Bells' ring radius (`r = 6 + v·(clockT - start)`) or Gravity Dial Hollow's `gAt(t)` would have to be smuggled in as fake "stored" cells manually kept in sync — exactly the bug class that produced Firefly Lamplighter's in-place countdown mutation (`PRIMITIVE_EXTRACTION.md` §2).

### 1.3 `Directive`
```
type Directive = { op: string; args: Record<string, number|string|boolean> }
type DirectiveList = {
  id: string
  mode: 'sequence' | 'scan'
  items: Directive[]
  pc?: number            // meaningful only when mode === 'sequence'
}
```
- **sequence**: kernel fires `items[pc]` this tick against a matching `GuardedTransition`, then advances `pc` (optionally `% items.length` for looping — Firefly/Windup Sentries pattern).
- **scan**: kernel fires *every* item in `items` this tick (Mole Sensor's `cont[]`/`sched[]`, Dam's rule cascade).
**Necessity proof both directions:** forcing `scan`-shaped puzzles into `sequence` mode means unrolling a static condition into an ever-growing re-checked instruction stream — authoring cost blows up for no expressive gain (Blind Cave Fish's 2-line wiring would need to be reconstructed as an infinite polling loop). Forcing `sequence`-shaped puzzles into `scan` mode discards "next" — March the Oaf's blind pre-scripted queue (`WALK`/`PUSH`/`SMASH`/`WAIT` consumed in strict order with no runtime feedback) has no well-defined "condition" to scan for; its entire premise is that the character *cannot sense* the world, so nothing exists to scan against. Neither mode subsumes the other.

### 1.4 `GuardedTransition`
```
type Firing = { list: DirectiveList; directive: Directive; tick: Clock }
type TraceEntry = { tick: Clock; source: string; op: string; ok: boolean; reason?: string }
type GuardedTransition = (world: World, firing: Firing) =>
  | { ok: true;  world: World; trace: TraceEntry }
  | { ok: false; world: World /* unchanged */; trace: TraceEntry }
```
**Necessity proof:** every single mutation found across all 40 demos — with or without an explicit `say()` log — factors through "check a precondition, then mutate-or-reject." Firefly's arrival check (`if(d<4)`), Prism Burrow's permutation check, Dam's burst check (`if(level>BURST)`), blind-batch-001's adjacency guards: same shape every time. This is the one true *behavioral* atom; everything else in the set is passive data around it.

### 1.5 `Log`
```
type Log =
  | { authority: 'observational'; entries: TraceEntry[] }                    // side-channel audit trail; State is source of truth
  | { authority: 'fold'; entries: TraceEntry[]; replay: (uptoTick: Clock) => World }  // Log IS the source of truth
```
**Necessity proof this is a primitive, not a detail of `GuardedTransition`:** `cross-model-deepseek`'s `SIM.run(rules, moves, maxT)` empirically re-derives *all* of `{level, opening, streak, gate, px}` from scratch on every single invocation — the log (rules + timestamped moves) is the only thing that persists between calls; there is no mutable `World` object living between ticks at all. This is a different, load-bearing architectural commitment from kimi's direct-mutation style (`fx += ...` persists in place), not a cosmetic variant. Which mode a puzzle picks changes its rewind cost from O(1) (observational, no rewind) to O(T) per query (fold) — a real, user-facing capability difference (see `FRAMEWORK_ADVERSARIAL_REVIEW.md` §2).

### 1.6 `LawCell` — probationary 6th primitive, self-collapses
Proposed to explain `gAt(t)`/`posAt(t)`/ring-radius. Test: is `gAt(t)` (gravity-law lookup over `segs=[{a,b,g}]`) expressible as `StateCell(derived)`? Yes — it is a formula of `Clock` alone, no stored dependency, trivially derived. Is `posAt(t)` (Echo Twin Waltz) expressible the same way? Yes — it is `StateCell(derived)` whose formula happens to fold over a **`Directive` list with an always-true guard** (no rejection is possible; every segment always applies within its range). Is the general case — "replay a whole `Directive(sequence)` program to answer 'state at any t'" — reducible? Yes: that is exactly `Log{authority:'fold'}.replay(t)`, already in the set.
**Verdict: `LawCell` does not survive as a 6th primitive.** It is fully absorbed as `StateCell(derived)` for closed-form cases and as `Log.replay(t)` for anything requiring a walk over guarded history. **Final count: 5.**

---

## 2. Orthogonality Proof (pairwise)

| | Clock | StateCell | Directive | GuardedTransition | Log |
|---|---|---|---|---|---|
| **Clock** | — | indexes derived formulas; does not store values | indexes `pc`/scan timing; does not hold instructions | provides `tick` for `TraceEntry`; does not gate anything | indexes entries; does not interpret them |
| **StateCell** | | — | can *hold* a Directive-shaped value (Replay Printshop) but is not itself ordered/tagged | is what a transition reads/writes; carries no behavior of its own | is what a trace's `before/after` would diff; a cell cannot append to a log itself |
| **Directive** | | | — | is *fired* by a transition; carries no guard logic itself | is what a `source`/`op` trace field names; a directive list cannot self-record |
| **GuardedTransition** | | | | — | is the only thing permitted to produce a `TraceEntry`; a log cannot decide ok/not-ok itself |
| **Log** | | | | | — |

No cell in the table collapses two primitives into each other — each has a capability the others structurally lack. This closes the orthogonality requirement.

---

## 3. Twelve Mechanic Families — Composition Table

| # | Family | Composition (primitives used) | Evidence |
|---|---|---|---|
| 1 | Sequential command walk | `Directive(sequence)` + `StateCell(stored: position)` + `GuardedTransition(move)` | Firefly Lamplighter, March the Oaf, all `blind-batch-001` |
| 2 | Adjacency/state-gated world mutation | `GuardedTransition` alone, composed with #1's position cell | `blind-batch-001` (all 9), Clay Transcriber |
| 3 | Carried memory / inventory | `StateCell(stored, actor-namespaced scalar or bounded array)` + `GuardedTransition` (capacity guard on write, presence guard on read) | Echo Concierge, Cloud Doctor, Phase Clockmaker |
| 4 | Runtime-only-known conditional branch | `StateCell(stored: alias index)` + `Directive(scan)` + `GuardedTransition` | Mole Sensor Greenhouse, Blind Cave Fish Sensor Network |
| 5 | Cyclic repetition / loop | `Directive(sequence)` with `pc_next = (pc+1) % length` — a `Clock`-relative addressing mode, no new primitive | Firefly Lamplighter, Windup Sentries |
| 6 | Declarative wiring / logic gates | `Directive(scan)` + `StateCell(derived: boolean formula)` | Blind Cave Fish, Circuit Golem Innards |
| 7 | Finite resource budget / overflow fail | `StateCell(stored, bounded scalar)` + `GuardedTransition` (capacity breach ⇒ fail trace) | Phase Clockmaker, Ink Cleaner, Last Light Irrigation |
| 8 | Scheduled one-off trigger (`at T → X`) | `Directive(scan)` with a single-shot guard `clock == T` — degenerate case of #6 | Mole Sensor's `sched[]`, Ladybug Ledger's `releases[]` |
| 9 | Piecewise law-over-time (gravity, inflow, wave) | `StateCell(derived)` folding a `Directive` list with an always-true guard | Gravity Dial Hollow (`gAt`), Dam's `inflow(t)`, Convergence Bells' ring radius |
| 10 | Multi-actor temporal echo / replay | ≥2 `Directive(sequence)` lists sharing one `Clock` (in lockstep or offset), cross-referenced inside each other's `GuardedTransition` guard | Echo Twin Waltz, Echo Canyon, Echo Chamber Bridge |
| 11 | Continuous coupled dynamics (predator-prey, ecology) | ≥2 `StateCell`s (stored, always-true-guard transition) whose update formula reads each other's *previous-tick* committed value only | Ladybug Ledger, Pond Algae Equilibrium |
| 12 | Nested / higher-order program (record-then-replay-as-subroutine) | `StateCell(stored)` whose value **is** a `Directive` array, later iterated inside another `GuardedTransition`'s effect | Replay Printshop (`s.record` → `replay` command) |

No family in this table required inventing a 6th primitive or a mode not already declared in §1. This is the composability proof the Orchestrator asked Gamma and Alpha to jointly certify.
