# FRAMEWORK_ADVERSARIAL_REVIEW.md

**Participants:** Subagent-Alpha (Evidence & Code Inspector) · Subagent-Beta (Radical Paradigm Brainstormer) · Subagent-Gamma (Minimalist / Occam's Razor) · Subagent-Delta (Adversarial Red-Team) · Orchestrator (tiebreak only when the four cannot converge).

Consensus is not the goal of this document. Where a disagreement survives the argument, it is left open and flagged.

---

## Section 1 — Does a Universal `Program` Abstraction Exist?

Tested against: Firefly Lamplighter (autonomous loop), Echo Twin Waltz (single-script + phase offset), Mole Sensor Greenhouse (scarce sensing + policy), The Prism Burrow (visible function composition).

**[Subagent-Beta, opening]** I want Paradigm C on the table seriously, not as a strawman: *program-as-dynamic-world-entity*. Replay Printshop already stores a program (`s.record`) as a `StateCell` value and later executes it. If the program can live *inside* world state, why do we need a separate "Program" concept at the kernel level at all? Collapse Program into State.

**[Subagent-Alpha, rebuttal]** Because in every one of these four demos, "the program" and "the thing the program manipulates" are edited through different UIs on different schedules. Prism Burrow's `chain[]` is picked once, before any tick occurs, and is never touched again during simulation — it behaves like a *compile-time constant*, not a live world entity anything could reach in and mutate at runtime. Mole Sensor's `cont[]`/`sched[]` are parsed once per Run click, then read-only for the whole 40-tick run. Nothing in this corpus has the world *editing the player's program back*. Paradigm C solves a problem that is not in evidence. I will not certify a kernel commitment against zero observed need.

**[Subagent-Beta]** Fair — I'm not asking for self-modifying code semantics. I'm asking whether "Program" needs to be a *distinct primitive* from `StateCell`, or whether it's just "a `StateCell` whose value happens to be shaped like a `Directive[]`." Replay Printshop already proves the second reading is sufficient and cheaper.

**[Subagent-Gamma]** Agreed, and this is consistent with `PRIMITIVE_COMPOSITION.md` §1.6's collapse of `LawCell` — the pattern here is the same: don't add a primitive when an existing one, used in a particular way, already covers it. `Directive` is data; a `StateCell(stored)` can hold that data; nothing new is required for Paradigm C's one real precedent.

**[Subagent-Delta]** Then test Paradigm A (Unified IR) against the actual friction point: Echo Twin Waltz's `segs=[{a,b,op}]` is *syntactically* identical in shape to a `Directive(sequence)` list — but its *execution semantics* are not sequence-mode at all. Nothing ever advances a `pc` through `segs`. `posAt(tt)` re-walks the entire list from scratch for an arbitrary `tt`, forwards or backwards, every single call. If "Unified IR" means one shared *data shape*, fine. If it means one shared *execution engine*, Echo Twin Waltz already falsifies it — you cannot run this "program" with a program-counter-stepper without rewriting it.

**[Subagent-Alpha]** Confirmed from the source — `posAt` is a pure fold with no memoization, no counter, called twice per frame (`hx=posAt(t)`, `ex=posAt(t-D)`). Delta is right that a single fixed "engine" forcing PC-advancement onto this data would break it.

**[Subagent-Gamma]** This is not actually a problem for the primitive set — it's a problem for Beta's original framing of "one Program abstraction." The resolution: `Directive` is one **data shape** (tagged tuple list). It supports **two declared interpretations** — `sequence` (PC-consumed) and `scan` (re-evaluated whole) — and, as `PRIMITIVE_COMPOSITION.md` §1.6 already shows, a *third* way to consume the same shape: as the fold-target of a `StateCell(derived)` query (`Log.replay(t)`/`posAt`-style). That's not a third *mode* needing a new flag — it's "any deterministic sequence-mode program can be queried at arbitrary `t` via replay if the puzzle's authority is `fold`." Echo Twin Waltz simply never bothers to expose sequence-consumption at all; it only ever uses the query form. Nothing new needed.

**[Subagent-Delta]** I'll accept that — provided someone proves Mole Sensor Greenhouse doesn't need a *fourth* thing. Its rule text uses **regex shape** to guess whether a line is a `cont` (conditional) or `sched` (timed) rule — `if s1 < 50 -> water p1` vs `at 6 -> water p3 for 4`. That's not a clean tagged `Directive`; that's grammar inference bolted onto a shared textarea.

**[Subagent-Alpha]** Correct and worth stating plainly: the **authoring surface** (free text, regex-classified) is sloppier than the **kernel data shape** it compiles to. Once parsed, both `cont[]` items and `sched[]` items are perfectly ordinary `Directive`s in `scan` mode — `{op:'water_if', args:{sensor,thr,pot}}` and `{op:'water_at', args:{t,pot,dur}}`. The mess is in the *compiler* (regex classification), not in the kernel primitive. A Unified IR does not require a unified *surface syntax* — Paradigm A only has to hold at the `Directive` data-shape level, which it does.

**[Subagent-Beta]** Then log a real, non-cosmetic authoring-layer finding: today, every single demo in the 40-demo corpus reinvents its own bespoke micro-grammar and its own regex parser. None of them share a compiler. That is the literal opposite of "the language grows with the player" (root docs, `coding-game 4D Product Description.md` §5). A Unified IR is *necessary but not sufficient* — the framework also needs one shared authoring-surface compiler that different puzzles configure (which ops are legal, which modes are available) rather than each puzzle hand-rolling `.split(/\s+/)` and ad hoc regexes from scratch.

**Section 1 Verdict (Alpha + Gamma + Delta converge, Beta partially dissents on scope):**
**Paradigm A holds, precisely stated:** one `Directive` **data shape** (tagged tuple list, two consumption modes: `sequence`, `scan`), consumable a third way as a pure replay/derived query when a puzzle opts into `fold`-authority. **Paradigm B (fully heterogeneous adapters, no shared concept) is rejected** — it would forfeit any cross-puzzle authoring-language growth and is not required by any demo's actual execution semantics. **Paradigm C (program-as-mutable-world-entity) is rejected as a kernel foundation** — zero corpus evidence of the world editing the player's program at runtime — but its one real precedent (Replay Printshop) is fully and cheaply covered by "a `StateCell` may hold `Directive`-shaped data."
**Open dissent (Beta, not resolved here, forwarded to `MINIMAL_FRAMEWORK_RECOMMENDATION.md`):** the kernel-level IR being unified does not make the 40 existing bespoke parsers unified — that is a separate, real authoring-tooling debt this analysis does not fully discharge.

---

## Section 2 — State Mutation & Causal Flow: the Final Doctrine

Stress test: Dam That Breathes (continuous fluid/ecology + one-way latch) simultaneously with Echo Canyon (multi-timeline ghost interference).

**[Subagent-Delta, opening the attack]** Both demos already ship a real kernel — `SIM.run(program, moves, maxT)`, DOM-free, re-executed from tick 0 on *every* call. Dam calls it from `setInterval`, from the `Step` button, and from every keydown. Quantify the cost before anyone calls this free.

**[Subagent-Alpha, quantifying]** Confirmed by direct read: Dam's loop is `for(tick=0; tick<(maxT||300) ...)`. On a single keypress, `stepOnce(Math.max(1,tick+1))` re-runs the *entire* history since tick 0. Across a full 300-tick playthrough driven by `setInterval` (one call per tick), total work is `1+2+3+...+300 ≈ 45,000` inner-loop iterations — each iteration is a handful of float ops and array scans over a `rules` array of length ~1-3. This is sub-millisecond on any real hardware at this corpus's scale. **The cost is real but not currently a disaster.**

**[Subagent-Delta]** "Not currently" is doing a lot of work in that sentence. State the actual scaling law: replay-from-scratch is **O(T) per query, O(T²) for a full stepped run of length T**. The corpus caps `maxT` at a few hundred everywhere I've checked. Nothing here has been tested past that. If a future puzzle wants continuous, unbounded, idle-game-style time (T → tens of thousands), O(T²) becomes a real stall, and worse, it becomes a real *memory* problem if `moves`/`events` grow unbounded and are never pruned.

**[Subagent-Beta]** Standard event-sourcing answer: periodic snapshotting. Checkpoint the committed `World` every K ticks; replay only forward from the nearest checkpoint instead of from t=0. This bounds the cost to O(K) per query regardless of T. It is not implemented anywhere in the corpus today, but it is well-understood and cheap to bolt on.

**[Subagent-Gamma]** Accepted as a **named, required companion mechanism**, not a hand-wave — any framework recommendation that adopts fold-authority for a puzzle whose `maxT` is not small and fixed **must** specify a snapshot interval. This goes into the risk register (`MINIMAL_FRAMEWORK_RECOMMENDATION.md`), not swept under "it's fine."

**[Subagent-Delta, second attack — state pollution]** Now the sharper question: with *derived* cells (Convergence Bells' ring radius, Dam's `outflowOf(level, opening)`), what stops one derived cell from reading another derived cell mid-tick and getting a stale or half-updated value — the classic FRP glitch?

**[Subagent-Gamma]** This is exactly why `PRIMITIVE_COMPOSITION.md` §1.2 bans derived-from-derived chaining. Enforce, per tick: **Phase A** — collect all firings from every `DirectiveList` (both modes) using only the *previous* tick's committed stored cells. **Phase B** — evaluate every `GuardedTransition` against that same frozen prior-state (a "Command/Effect-Buffer": guards never see each other's in-flight results this tick). **Phase C** — commit all `ok` results, in one fixed, declared order. **Phase D** — recompute every `derived` cell, once, purely from the cells just committed in Phase C. No cell of either kind is ever read mid-computation in an inconsistent state, and no dependency graph or topological sort is needed because derivation is capped at exactly one level.

**[Subagent-Alpha, checking this against real code]** This four-phase discipline is *not* what any existing demo actually implements — it is closest in spirit to what Echo Chamber Bridge does *by hand-written convention*: `echoPos`/`livePos` are both updated from local variables before the joint `if(echoPressed && livePressed)` check runs later in the same synchronous loop body, so the two lanes never see each other's *post*-tick state while deciding their own tick's outcome. It works today because the author happened to sequence the code that way. Nothing in that file *enforces* it — a third lane, or a same-tick cross-effect, could break the ordering by accident. The four-phase discipline promotes an accidental-but-correct convention into a structural guarantee.

**[Subagent-Delta]** Then which of the three named mutation models from the Orchestrator's brief survives? Score them straight:
- *Direct Mutation with Event Hooks* — cheapest, but nothing stops the Firefly-style bug (mutable countdown smuggled into instruction data) and nothing enforces the four-phase discipline; same-tick multi-actor conflicts are only as safe as the author's hand-ordering.
- *Pure State Transition Reducer* `(World, Action) → (World', Events[])` — this is one tick of the four-phase discipline, done right, IF the kernel enforces "read only prior-tick state" during Phase B. Cost is the O(T)/O(T²) replay tax **only if** the reducer is also required to be re-run from t=0 every time (Ledger-style); it does *not* have to be — a reducer can also be called incrementally, `World_t = reduce(World_{t-1}, firings_t)`, without ever discarding `World_{t-1}`.
- *Command/Effect-Buffer Patch* — this is not a competing third option; it is the correct **internal shape of Phase B/C** inside either of the above. It is the mechanism, not an alternative to the mechanism.

**[Subagent-Gamma, ruling]** Delta's third bullet resolves the Orchestrator's three-way framing: **Command/Effect-Buffer is not a peer of the other two — it is the required internal discipline of a single tick, adopted by both.** The real, remaining choice is only: does `World_{t-1}` persist and get incrementally reduced (cheap, no free scrub), or is `World_t` always recomputed from `(initial, full log)` (Ledger-style, free scrub, O(T) tax)? Both are legitimate, **per-puzzle** choices over the *same* five primitives — this is exactly why `FRAMEWORK_CANDIDATES.md` keeps Candidate 1 and Candidate 2 as separate entries rather than merging them.

**Section 2 Verdict:** Adopt the four-phase tick discipline (collect → propose-against-frozen-prior-state → commit-in-fixed-order → recompute one-level derived cells) as **mandatory kernel law**, regardless of which authority mode (`observational`+incremental vs `fold`+replay-from-log) a given puzzle chooses. Fold-authority's O(T)/O(T²) cost is real and must ship with mandatory snapshotting once `maxT` stops being small; this is a named risk, not a solved problem — see `MINIMAL_FRAMEWORK_RECOMMENDATION.md` §"Open Risks."

---

## Section 3 — De-Sugaring, Live: the `LawCell` Self-Collapse

(`Sensor`, `Echo/Replay`, `Signal/Wire`, `Inventory/Carrying` were tried and killed with cited evidence in `PRIMITIVE_EXTRACTION.md` §3 — not re-litigated here. This section records the one place Gamma's own Round-1 proposal did not survive Delta's attack.)

**[Subagent-Gamma, Round-1 position, restated for the record]** I originally proposed keeping a 6th primitive, `LawCell` — pure `f(Clock) → value`, no guard, no mutation — specifically to house `gAt(t)`, `posAt(t)`, and Convergence Bells' ring-radius formula, on the grounds that these need O(1)-ish scrubbing in both directions and a `GuardedTransition`-replay felt like overkill for a formula this simple.

**[Subagent-Delta, attack]** Overkill by what measure? Walk `gAt(t)`: `segs=[{a,b,g}]`, unconditional range membership, no rejection possible. That is a `Directive(sequence)` list where **every guard trivially returns true**. Feed it to `Log{authority:'fold'}.replay(t)` and you get exactly `gAt(t)`'s behavior, for free, with the machinery that already has to exist for Echo Canyon anyway. Name one thing `LawCell` can compute that `StateCell(derived)` — a plain formula of `Clock` and already-committed stored cells — cannot.

**[Subagent-Gamma, testing it honestly]** ...I cannot. `posAt(tt)` is `StateCell(derived)`'s formula folding over a `Directive` list with an always-true guard. Convergence Bells' `r = 6 + v·(clockT - start)` is a `StateCell(derived)` formula with no fold at all — a one-line arithmetic expression of `Clock` and a stored `start` cell. Both are strictly instances of the 5-primitive set already on the table, wearing different notation.

**[Subagent-Alpha, confirming from source]** Verified — nothing in `gAt`, `posAt`, or the ring-radius formula reads or writes anything a `derived StateCell` (per `PRIMITIVE_COMPOSITION.md` §1.2's one-level rule) cannot already express.

**[Subagent-Gamma, concession]** `LawCell` is withdrawn. **Final primitive count: 5, not 6.** This is a genuine reduction earned by the argument, not a target hit by fiat — I went in defending 6 and the evidence took one away.

---

## Section 4 — Red-Team Combo Attacks on the 3 Candidates

### Combo 1 — Echo Chamber Bridge × Replay Printshop mashup
*Hypothetical:* two lanes on a shared clock (Echo Chamber Bridge), where one lane's program is itself a **recorded sub-sequence replayed inline** (Replay Printshop's `for(k of s.record) pull(k)`), and the joint PRESS condition must see the sub-replay's *net* effect on the same tick it completes.

- **Candidate 1 (Tape Machine):** survives directly. Each lane is a `DirectiveList`; the sub-replay is a `StateCell(stored)` holding a `Directive[]`, consumed inside one `GuardedTransition`'s effect (already how Replay Printshop works today). The four-phase discipline (Section 2) guarantees the sub-replay's net effect is visible to the joint gate check in the same Phase-C commit. **No kernel change required.**
- **Candidate 2 (Ledger):** also survives, but the sub-replay must itself be logged as discrete timestamped events (not "one opaque effect"), or scrubbing the shared timeline mid-sub-replay produces an undefined intermediate state (are we "3 pulls into the recorded sequence" at tick T, or not?). This is extra authoring discipline Candidate 2 must impose that Candidate 1 does not need.
- **Candidate 3 (Cellular Board):** awkward. A "sub-replay inside one formula tick" does not fit "derived cells recompute in one level, once" cleanly — the sub-replay wants its *own* multi-step internal causality, which is exactly the sequential-actor case Candidate 3 already conceded as its worst fit.
- **Verdict:** Candidate 1 wins this combo outright; Candidate 2 wins with an extra rule; Candidate 3 strains.

### Combo 2 — Dam's one-way latch vs. time-scrubbing paradox
*Real mechanic, hypothetical extension:* Dam's `gate` is a one-way latch (`if(streak>=8 && !gate){gate=true}`) — once true, it stays true for the rest of *that run*, even if `streak` later drops. Now add the aspirational "scrub backward" feature explicitly named in the brief. **If the player scrubs the timeline back to a tick before `gate` first latched, should `gate` show `false` (truthful replay) or stay `true` (don't punish inspection)?**

- **Candidate 2 (Ledger):** this is not a bug, it is a **modeling question the framework must force every puzzle to answer explicitly**. `stateAt(log, T)` is a pure function of `T` — by construction it *will* show `gate=false` before the true latch tick, because that is what genuinely happened. If the design intent is "once unlocked, stays unlocked even while inspecting the past," that fact must be logged as its own separate, permanent, run-level cell (`unlockedEver: true`, set once, never replayed away) **outside** the scrubbable per-tick fold — i.e., two different `StateCell`s at two different scopes (per-tick derived-from-log vs. run-level stored-once), not one cell doing both jobs.
- **Candidate 1 (Tape Machine):** the question barely arises, because nothing is scrubbed by default — `gate` is just a stored cell, forward-only, and "opting into scrubbing" for this puzzle would force the *same* explicit two-scope decision Candidate 2 needs, just deferred until an author actually asks for scrubbing.
- **Candidate 3 (Cellular Board):** identical resolution required — a "run-level achievement" cell must be explicitly modeled as *not* derived from the scrubbable per-tick board, or it will incorrectly flicker as the player scrubs.
- **Verdict:** all three candidates require the **same fix** — a formal distinction between "per-tick fact" (truthfully replayable, can un-happen under scrubbing) and "run-level achievement" (write-once, scrub-immune). This is not a weakness unique to one candidate; it is a **missing concept in the primitive set itself**, surfaced only by this attack. Recorded as a required addition in the final recommendation: `StateCell` needs a documented `scope: 'per-tick' | 'run'` distinction for `stored` cells whose truth must survive scrubbing. This does not raise the primitive count (it is a flag on the existing `StateCell`, exactly like `kind` and the `Directive` `mode` flag), but it must be named explicitly or every latch-style mechanic (Dam's gate, Echo Chamber Bridge's `gateOpened`, Mole Sensor's `bloomed`) is a scrubbing hazard.

### Combo 3 — Mole Sensor hot-edit mid-replay: the history-rewrite hazard
*Real capability the brief explicitly names: "玩家代码中断" (player-code interruption).* Suppose the player edits the `cont[]`/`sched[]` rule text **while a run is mid-flight**, under each candidate's default authority mode.

- **Candidate 2 (Ledger), the sharp case:** `stateAt(log, T)` recomputes **the entire history 0..T** using whatever `log.rules` currently holds. Editing rules mid-run and re-querying **silently rewrites what "already happened"** in ticks 0..T-1 too — a hazard structurally impossible under direct mutation (Candidate 1), where editing rules only ever affects ticks *going forward from now*.
- **[Subagent-Delta]** This is not a corner case, it is the single sharpest asymmetry in this entire review. Ledger's core selling point (uniform, free scrubbing) and this hazard are the *same mechanism* viewed from two angles — the thing that makes rewind free is exactly the thing that makes hot-edit dangerous.
- **[Subagent-Gamma, patch]** The fix is already implied by Combo 2's resolution: the **active ruleset must itself be logged, versioned state**, not an ambient global the replay function silently reads live. Concretely: `log.rules` is never read directly by `stateAt`; instead, rule-set *changes* are themselves timestamped entries in the same log (`{tick, op:'set_rules', args:{rules}}`), and `stateAt(log, T)` uses whichever ruleset-version was active at each historical tick, not whatever is live at query time. This is fully expressible in the existing 5-primitive set — "current active ruleset" is just one more `StateCell(stored)`, mutated by its own `GuardedTransition`, subject to the same fold — but it is an **engine-enforced discipline**, not something safe to leave to author discretion, or every hot-edit silently corrupts history under Candidate 2.
- **Candidate 1 (Tape Machine):** hot-editing `cont[]`/`sched[]` mid-run only ever changes behavior from "now" forward — matches the player's naive intuition ("I changed the rule, it applies from now on") with zero special handling required. This is a genuine, structural advantage of direct mutation over naive replay-fold specifically for this interruption case.
- **Verdict:** Candidate 2 is **not disqualified**, but it is **not safe by default** — it requires the rule-versioning patch above as a mandatory addition, not an optional refinement. Candidate 1 gets this case right for free. This materially informs the final recommendation's decision to keep Candidate 1's authoring/mutation default and reserve Candidate 2's fold-discipline for opt-in, versioned use.

---

## Final Scorecard

| Criterion (1-5, higher=better) | Candidate 1 Tape Machine | Candidate 2 Ledger | Candidate 3 Cellular Board |
|---|---|---|---|
| Combo 1 (nested multi-actor replay) | 5 | 4 | 2 |
| Combo 2 (latch vs. scrub) | 4 (issue deferred, not solved) | 3 (issue immediate, needs patch) | 3 (same patch needed) |
| Combo 3 (hot-edit mid-replay) | 5 (safe by default) | 2 (unsafe without versioning patch) | 4 (mostly safe — few puzzles here author sequential logs) |
| Free scrubbing/time-travel | 2 (opt-in only) | 5 (default, universal) | 3 (derived cells only) |
| Player mental-model fit, sequential puzzles | 5 | 3 | 1 |
| Player mental-model fit, wiring/law puzzles | 2 | 3 | 5 |
| Engine implementation simplicity | 5 | 3 (snapshotting + versioning tax) | 3 |

No single candidate wins outright — this table is the evidentiary basis carried into `MINIMAL_FRAMEWORK_RECOMMENDATION.md`'s synthesis, not a race with one finisher.
