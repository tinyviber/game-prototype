# DEEPSEEK_POST_CODEX_REVIEW.md — Adversarial Architecture Review of Codex's Round 3

**Reviewer role:** Independent adversarial falsifier. **Law:** no architecture conclusion may rest on document-internal logic alone; every load-bearing claim is traced back to the demo `index.html` / simulation source.

**Baseline:** `ec213dbdcab5034163ca6610fb00185dbd6ec983` (Claude, "Round 2", committed). **Codex state:** uncommitted working-tree edits to the 5 `analysis/*.md` files (`git diff` = 581 insertions / 437 deletions). `experiments/DISCERNMENT_SHORTLIST.md` is unchanged and treated as ground-truth input.

---

## 1. Executive Verdict

> **Codex's Round 3 is a correct, evidence-grounded de-commitment from a factually-wrong baseline — it correctly reverses "topology is never observed" and "unified Directive IR holds", but it does not land: it leaves the topology boundary as one unresolved lump, adds speculative policy enums that no demo exercises, silently drops the latch semantics the baseline was trying (badly) to model, and writes a circular gate. Verdict category: `NEEDS ANOTHER ARCHITECTURE PASS` — a short, probe-executing pass, not a full re-architecture.**

---

## 2. What Codex Actually Changed

Full `git diff ec213db..working-tree -- analysis/` yields the following substantive deltas (not cosmetics):

| # | Baseline (Round 2, committed) | Codex (Round 3, working tree) | Direction |
|---|---|---|---|
| 1 | `PRIMITIVE_EXTRACTION` / `ADVERSARIAL_REVIEW`: **"Signal/Wire as topology-graph is KILLED — never observed."** Flat rule/query wiring is the whole story. | **Reopened `Structure/Topology` as an unresolved candidate** backed by Mimic Moss, Programming Spider, Circuit Golem, Prism Burrow. | **Reversal (correct)** |
| 2 | `ADVERSARIAL_REVIEW` §1 verdict: **"Paradigm A holds"** (one `Directive` data shape, two modes); **"Paradigm B (heterogeneous adapters) is rejected."** | **"A universal authoring representation and shared compiler are not established."** Candidate 5 (Heterogeneous Adapters) is now "the safest authoring stance." | **Reversal (correct)** |
| 3 | `PRIMITIVE_EXTRACTION`: **"Echo/Replay … Verdict: KILLED"** — pure composition, no atom. | **"composition pattern observed; service boundary unresolved"** — replay is an *optional History/Replay/Snapshot service*. | **Softening (correct)** |
| 4 | `MINIMAL_FRAMEWORK_RECOMMENDATION`: closed **5-primitive set** (`Clock`, `StateCell`, `Directive`, `GuardedTransition`, `Log`) + a shared **"Directive Compiler"** layer B. | **"Provisional vocabulary under test"** — "candidates, not a certified minimal set"; **no primitive count is claimed**; compiler is "optional and typed." | **De-commitment** |
| 5 | `StateCell.scope: 'per-tick' | 'run'` (write-once latch flag). | **Rejected.** Replaced by `SimulationState(t)` vs `RunMetaState` (achievements/unlocks/run identity) split. | **Replacement (see §4-3)** |
| 6 | `Log` is a 5th **primitive** with `authority: 'observational' | 'fold'`. | `Log` downgraded to an **optional engine service**; "not a gameplay atom." | **Downgrade (correct)** |
| 7 | One-level `StateCell(derived)` (no derived-chains) as a settled law. | `Query`/`DerivedView` vs identity-bearing derived state is **an open mechanism choice**. | **Reopen (correct)** |
| 8 | Sequence progression implied by `GuardedTransition.ok` + modulo default. | Explicit `SequencePolicy.advance × termination` and `ScanPolicy.selection × conflict` enums. | **Addition (§4-2, over-specified)** |
| 9 | Implementation stance: **"ship 5 primitives + compiler."** | **"Do not begin probes until the matrix has evidence-backed decisions."** + 5 named probes. | **Gate reversal (§4-1, circular)** |

**Net reading:** Codex did not *advance* the architecture toward a decision; it *walked back* an over-confident, under-sampled decision and correctly re-scoped the problem. That is the right thing to do, but it is a regression in *confidence*, not a gain in *resolution*.

---

## 3. Previous Issues Matrix

Tracking the Round 2 issues that a post-review pass was expected to resolve.

| # | Issue | Codex status | Evidence (code-verified) |
|---|---|---|---|
| 1 | **Topology/structure was dismissed as "never observed"** | **YES — reopened** | `cross-model-deepseek/demo-06/index.html:73` (`neighs`), `:88-106` (`propagate()` synchronous BFS, `dist` accumulation), `:112` (`dist<=tick` → path length becomes delay). `blind-batch-001/demo-07/index.html:4` (`edges[]` + `tie` mutates + rain checks `edges.includes(...)`). Round 2's sample simply omitted these two demos. |
| 2 | **Unified `Directive` IR claimed to "hold"** | **YES — corrected** | No demo authoring surface is a shared IR. Each of 18 demos hand-rolls its own grammar/parser (`.split(/\s+/)`, per-puzzle regex). Codex's "optional data shape, not a universal IR" is the accurate reading. |
| 3 | **Echo/Replay declared "KILLED" as pure composition** | **PARTIAL** | Codex correctly split the family — pure query+phase offset (`kimi-k3/demo-03:114-129` `posAt(t-D)`), authoritative replay-fold (`deepseek/demo-03:70-93` `SIM.run` from t=0), lockstep two-track (`claude-sonnet-5/demo-03:203-216`), recorded-subsequence-iterated-in-effect (`blind-batch-001/demo-06`). But whether replay is a *service* vs *authority strategy* is still left open, not settled. |
| 4 | **`StateCell.scope: 'run'` conflation** | **PARTIAL — see §4-3** | The modeling complaint is resolved (SimulationState/RunMetaState split is cleaner). But the *actual* problem that motivated `scope:'run'` — **latches under scrub** (`deepseek/demo-05:94` `gate=true` once; `deepseek/demo-02:88` `plate=true` latched; `deepseek/demo-01:144` `latched`) — is not solved, only deferred to the History service. |
| 5 | **`Log` = primitive vs service** | **YES** | `deepseek/demo-05:76-104` proves replay-from-input is valuable; nothing proves every puzzle needs an append-only log. "Optional service" is the right call. |
| 6 | **Query vs derived state** | **PARTIAL** | Correctly reopened (a same-tick aggregate like "both pressed" in `claude-sonnet-5/demo-03:226-227` is not a formula over prior state). Not settled. |
| 7 | **Sequence progression** | **PARTIAL — see §4-2** | Correctly identified that `ok`/modulo cannot decide it (`demo-03` failed PRESS; `kimi-k3/demo-02:115,121` modulo loop vs `deepseek/demo-02:74-114` finite queue). But the `advance` enum is over-specified. |
| 8 | **Scan arbitration** | **PARTIAL — see §4-2** | Correctly identified first-match vs all-match (`deepseek/demo-05:86` `break` vs `deepseek/demo-04:130-133` no-break). But `priority`/`exclusive`/`merge`/`declared-order` are un-evidenced. |
| 9 | **Historical state vs run metadata** | **YES (boundary defined), un-evidenced** | No demo has achievements/unlocks/run-identity. The split is forward-looking modeling, not corpus-grounded. |

**Verdict on "did Codex solve the previous issues":** Codex *correctly identified and corrected the two factual errors* (topology, unified IR), *correctly downgraded Log*, but *deferred rather than resolved* the five genuinely-open mechanism questions, and in two cases (cursor policy, latch model) introduced a new mismatch.

---

## 4. New Problems Introduced by Codex

### 4-1. Circular implementation gate

`FRAMEWORK_ADVERSARIAL_REVIEW.md` §10: *"Framework probes should begin only after the matrix above has evidence-backed decisions."* But every row of that matrix names a probe as its *own* evidence source — e.g. "Moss, Spider, Golem, Prism probe with typed versus shared structures"; "forward-only and scrub-heavy probes." The gate requires probe results as a precondition for running probes. It is self-defeating: the matrix can only be discharged *by* the probes it is gating on. The fix is trivial but necessary — the gate must read "run bounded probes to answer the matrix," not "answer the matrix before probing."

### 4-2. Speculative policy dimensions with no code support

Codex's `SequencePolicy` and `ScanPolicy` enums over-reach the corpus:

- `SequencePolicy.advance`: **`'on-success'` and `'until-success'` are un-evidenced.** Every demo that has a cursor advances unconditionally: Firefly `ci=(ci+1)%cmds.length` (`kimi-k3/demo-02:115,121`), March `qi++` even on `blockedAhead()` → "Thunk!" (`deepseek/demo-02:83,92`), Windup `loop[(tick-1)%loop.length]`, Echo Chamber lockstep `tick-1`. The only observed value is `advance: 'always'`. Retry-until-valid is plausible *future* content but is speculative now, and its livelock bound is pure invention.
- `ScanPolicy.selection`: **only `'first-match'` (`deepseek/demo-05:86` `break`) and `'all-match'` (`deepseek/demo-04:130-133`, `kimi-k3/demo-04:147-148`) are evidenced.** `'priority'` and `'exclusive'` appear nowhere.
- `ScanPolicy.conflict`: **`'reject' | 'merge' | 'declared-order'` — none of the three is exercised.** In the corpus, `all-match` rules write *disjoint* cells (each rule names its own actuator/pot), so no write conflict ever actually occurs. The entire conflict-resolution axis is a hedge against a situation that does not exist in any of the 18 demos.
- Echo Chamber's "failed PRESS consumes a tick" (`demo-03:210-216`) is real but is a **lockstep `tick-1` indexing, not a cursor**. There is no cursor that "fails to advance"; the *position* fails to advance because PRESS is not MOVE. The cleaner counterexample is March's blocked `WALK` (`demo-02:83`), which consumes a tick and advances to the next command — i.e. `advance: 'always'`, again.

These enums are not *wrong*, but they inflate the interface toward a general rule/sequence engine for edge cases the corpus has never produced — the precise "over-abstraction for a few edge cases" failure the review is charged to catch.

### 4-3. The latch problem is dropped, not solved

The baseline's `StateCell.scope:'run'` was a (mis-named) attempt to model **monotonic latches that must survive a scrub-to-earlier-tick**: Dam's `gate` (`demo-05:94`), March's `plate` (`demo-02:88`), Gravity's `latched` (`demo-01:144`). Codex replaced it with `RunMetaState` = achievements/unlocks/run identity — which **no demo has**. The actual latch question ("if I scrub to t=0 and replay, does the gate un-latch?") is re-routed to the still-open History-service question (`MINIMAL_FRAMEWORK_RECOMMENDATION.md` §"History and replay gate"). Net effect: a real, corpus-observed problem was exchanged for a cleaner-but-un-evidenced meta-state model, and the real problem became an unresolved footnote. This is a regression in *coverage*, not an advance.

### 4-4. Structure conflation inside one candidate bucket

Codex bundles four mechanistically unrelated demos as "Structure/Topology":

| Demo | What the code actually does |
|---|---|
| Mimic Moss | genuine runtime traversal: synchronous BFS over `neighs`, `dist` accumulation, color transform, growth (`demo-06:88-106,110-139`) |
| Programming Spider | a **flat set of ≤3 named edges** mutated by `tie`; rain = hardcoded `edges.includes('a-b') && edges.includes('b-goal')` — no traversal (`demo-07:4`) |
| Circuit Golem | a **2-element source→target selector** (two dropdowns read in an if/else) — no graph (`demo-06:163-169`) |
| Prism Burrow | a **one-shot 3-element fold** through `T`, computed once at Run-click, never stepped (`kimi-k3/demo-06:178-181`) |

Only Mimic Moss performs runtime traversal, and even it is bespoke (hardcoded prism source, hardcoded red→blue dye rule, hardcoded flower/fern checks, fixed 40-step loop). Keeping these four in a single candidate invites the very "general graph engine" over-fit that Codex itself warns against (`FRAMEWORK_CANDIDATES.md` Candidate 4 "Known risk"). The honest position — which the evidence supports and Codex stops short of — is that **structure/topology is a level-specific system family, not a reusable primitive, and not even clearly a single standard extension.**

### 4-5. "Shared hypothesis" overstatement

The fixed-step "collect → propose against frozen `SimulationState(t-1)` → arbitrate → commit" discipline is repeatedly called "the strongest **shared** hypothesis" (`FRAMEWORK_ADVERSARIAL_REVIEW.md` §2, `PRIMITIVE_COMPOSITION.md` §1). It is **not shared by any demo**: all 18 demos mutate state in-place inside a `for(tick=…)` loop, with no `Proposal` objects, no arbitration, no frozen prior state, no commit phase (`deepseek/demo-05:83-102`, `deepseek/demo-02:74-114`, `demo-06` propagate loop, etc.). Codex half-admits this ("a recommendation for the framework, not a claim about how every existing demo was written"), but the persistent "shared hypothesis" framing overstates the evidence. The discipline is a *normative* recommendation — a good one — not an *observed* pattern.

---

## 5. Primitive-by-Primitive Attack

Each candidate is tested by the **subtraction test** (remove it; does glue code suffice?) and **addition test** (is a missing concept inflating special-cases?).

### 5.1 `Clock` (fixed-step tick)
- **Evidence:** every demo needs duration/ordering (`deepseek/demo-02:74` tick loop; `kimi-k3/demo-03` `t`/`dt`; `deepseek/demo-05:93` `streak`). Uncontested.
- **Subtraction:** removing it breaks "hold N ticks", "N contiguous in-band", "cumulative overlap". **CORE.** Survives.

### 5.2 `SimulationState(t)` / historical world truth
- **Evidence:** in-place state is ubiquitous; historical *scrubbing* appears in zero demos. The split from `RunMetaState` is forward-looking.
- **Subtraction:** `SimulationState` as "values + structures" is a tautology for "the world object." The *historical indexing* (`(t)`) is the load-bearing part, and it is only needed by the optional History service. **Boundary: correct to keep the *concept*, but it is currently co-located with an un-evidenced meta-state model (§4-3).**

### 5.3 `Directive` / `DirectiveList` (tagged `{op,args}` + mode)
- **Syntactic-laundering test:** is `Directive` a natural shared IR or a tautological wrapper? **Verdict: it is a wrapper, and Codex now says so honestly.** `{op,args}` can encode an action plan, an edge, a color map, or a law, but encoding is not semantics. The evidence shows the *authoring surfaces are heterogeneous and bespoke* (18 distinct hand-rolled parsers). Codex's downgrade from "Paradigm A holds" to "optional data shape" is the correct falsification. **Verdict: NOT a universal IR. Keep as an optional target for sequence/scan authoring only.**

### 5.4 Transition proposals / `GuardedTransition`
- **Evidence:** every mutation in the corpus does factor through "check a precondition, then mutate-or-reject" (`demo-02:83` block check, `blind-batch-001/demo-02` listen/speak guards, `demo-05:89` burst check). This *behavioral shape* is real.
- **BUT** Codex's `Proposal` object (`source`, `outcome`, `consumesTick`, `patch`, `reason`) does **not** exist in any demo — demos mutate directly. The *proposal* is a framework construct for arbitration, not an observed atom. **Verdict: the guard is real and core-shaped; the Proposal/arbitrate/commit machinery is an untested recommendation, not evidence.**

### 5.5 `Query` / `DerivedView` vs identity-bearing derived state
- **Evidence:** `posAt(t)` (`kimi-k3/demo-03:114-125`), `gAt(t)` (`deepseek/demo-01:94-98` `lawAt`), Shiftwater's `stateAt=(base+turn)%3` (`blind-batch-000/demo-06:280`) are clean pure queries. A same-tick aggregate ("both pressed", `demo-03:226-227`) is NOT a pure query over prior state.
- **Verdict:** pure query is sufficient for the law/lookup family and should be **CORE (as a read mechanism)**; identity-bearing derived state has **no evidence** and should not be built until a same-tick aggregate forces it. This is a case where Codex correctly reopened but over-hedged — the subtraction test says "pure query, now."

### 5.6 `Structure/Topology`
- **Addition test:** does a missing topology concept eliminate special-cases? **No.** The four "structure" demos would each be *less* legible under a shared graph API (see §4-4): Spider's two-edge check, Golem's two selectors, Prism's one-shot fold do not want `nodes/edges/adjacency/propagation`. Only Moss traverses, and bespoke. **Verdict: NOT CORE; NOT a standard extension; a level-specific system family.** The one salvageable standard-extension candidate is a **spatial-neighbor query** (`neighs`-style), which is trivial and could serve Moss *and* future grid puzzles — but it is a query, not a topology engine.

### 5.7 `History / Replay / Snapshot`
- **Evidence:** replay-from-input is real (`demo-05:76-104`, `demo-03:70-93`). It is an authority *strategy* for a subset of puzzles, not a universal requirement.
- **Verdict:** **optional engine service**, as Codex concluded. Correct. (The latch/scrub semantics that overlap here remain unresolved, §4-3.)

### 5.8 `RunMetaState` (achievements/unlocks)
- **Evidence:** zero demos. The *concept* is sound (progression must survive scrub), but the *shape* is invented. The real, observed "survives-scrub" facts are **latches**, which `RunMetaState` does not model. **Verdict: keep the name reserved, but the immediate gap is the latch model, not the achievement model.**

---

## 6. A-Tier Compatibility Matrix (13 Demos)

Columns: authored object / persisted state / per-tick logic / autonomous mechanism / observation / level-specific logic / kernel change. Ratings: `NATURAL | ACCEPTABLE | AWKWARD | KERNEL BREAK`.

| Demo | Authored | Persist | Per-tick | Autonomous | Observe | Level-specific | Kernel | Rating |
|---|---|---|---|---|---|---|---|---|
| 1. Shiftwater Bridge (`blind-batch-000/demo-06`) | move plan `U D L R` | `turn`, static `base` | advance `turn`; check landing | none (grid is pure fn of turn) | tile states `(base+turn)%3` | phase cycle, beacon | none | **NATURAL** |
| 2. Echo Concierge (`blind-batch-001/demo-02`) | move/listen/speak seq | `s.memory` (carried tone) | guard → mutate `memory` | none | carried tone, gate state | tone→gate match | none | **NATURAL** |
| 3. Replay Printshop (`blind-batch-001/demo-06`) | record/move/replay seq | `s.record[]` | iterate `record` in effect | none | paper beat | 3-beat rhythm | none (needs "state can hold a sequence") | **NATURAL** |
| 4. Programming Spider (`blind-batch-001/demo-07`) | move/tie seq | `edges[]` (≤3) | mutate edges; check `includes` | none | web state, rain | hardcoded `a-b`+`b-goal` win | none (edges = named state) | **NATURAL** |
| 5. Windup Sentries (`claude-sonnet-5/demo-02`) | `loop[]` patrol | `berries`, schedule | `loop[(tick-1)%len]` | soldier auto-paces | crow/berry | 6-tick crow schedule | none | **NATURAL** |
| 6. Echo Chamber Bridge (`claude-sonnet-5/demo-03`) | two programs | two `pos` | lockstep `tick-1` both tracks | none | press lights, gate | plate positions | none (needs shared clock + "always" advance) | **NATURAL** |
| 7. Circuit Golem (`claude-sonnet-5/demo-06`) | two dropdown selectors | none (config) | event schedule → arm state | none | tally | 2×2 source→target map | none (map = config value) | **NATURAL** |
| 8. Gravity Amendment (`deepseek/demo-01`) | `laws[]` (t,dir) | boulder/water/char | `lawAt(t)` → move objects | boulder/water fall/flow | positions, gate | world-law fold + latches | none (law = query + state) | **NATURAL** |
| 9. Whispering Grotto (`deepseek/demo-04`) | stones/bells/pipes + `rules[]` | mote positions, resonance | sensor→rule→actuator (all-match), mote step | motes greedy-move to/from targets | sensor heat, pool count | attract/repel dynamics | none (all-match scan + continuous state) | **NATURAL** |
| 10. Dam That Breathes (`deepseek/demo-05`) | `rules[]` + move | `level`, `streak`, `gate` | first-match rule → flux ODE → streak | river pulses | level, RPM, gate | burst/failure, band | replay authority = optional service | **NATURAL** |
| 11. Mimic Moss (`deepseek/demo-06`) | `plants[]` (spatial) | lit map, sprout growth | `propagate()` BFS + `dist<=tick` | light propagates, moss sprouts | lit cells, colors | prism/dye/fern/flower + path-delay | **unresolved structure query** | **ACCEPTABLE** |
| 12. Prism Burrow (`kimi-k3/demo-06`) | `chain[]` (3 picks) | none (computed once) | fold `colors` through `T` | none | segment colors | color-transform table | none (pure fold) | **NATURAL** |
| 13. Echo Twin Waltz (`kimi-k3/demo-03`) | `segs[]` + offset D | none (pure) | `posAt(t)`, `posAt(t-D)` | none (echo is derived) | plate overlap | overlap threshold | none (pure query + phase) | **NATURAL** |

**Result: 12/13 NATURAL, 1/13 ACCEPTABLE (Mimic Moss), 0 AWKWARD, 0 KERNEL BREAK.** The single non-natural demo is precisely the one that broke Round 2's flat-rule conclusion. This confirms: the framework does **not** need a topology kernel; it needs a *level-specific escape hatch* (bespoke propagation code) plus at most a thin spatial-neighbor query.

---

## 7. Anti-Homogenization Review

**Question: does `DirectiveList`/`SequencePolicy` pressure designers to flatten topology/environment-law puzzles into "instruction sequence" puzzles?**

- **Residual risk is real but bounded.** Codex explicitly blocks the worst failure (`FRAMEWORK_CANDIDATES.md`: "It is not a requirement that TopologySpec… be rendered as an instruction list"). But the *vocabulary itself* still centers `Directive`/`SequencePolicy`/`ScanPolicy` as the only *named* authoring shapes, while `TopologySpec`, `ConnectionMap`, `TransformChain`, `WorldLaw` are named only as "possible artifacts" with no sketch. A designer reading the recommendation still sees a sequence/scan engine first.
- **Observed pressure in the corpus is already the opposite direction of the risk:** the demos that *are* command lists (March, Firefly, Spider, Concierge) are genuinely command-list puzzles; the demos that *are not* (Moss, Grotto, Dam, Gravity) do **not** use `Directive` at all — they use spatial arrays, rule sets, and law tables. So the framework's own evidence does not force homogenization *if* the recommendation keeps `Directive` optional. Codex keeps it optional — the anti-homogenization requirement is **met in letter but only barely met in emphasis.**
- **Syntactic-laundering verdict:** Codex's `Directive` is **not** laundered as a universal IR (it correctly calls it optional), so the specific laundering failure is avoided. The remaining laundering risk is the *policy enums* (`advance`/`selection`/`conflict`), which impose sequence/scan vocabulary on behaviors (`on-success` retry, `exclusive` match) that exist nowhere — a mild form of the same disease, applied to the execution model instead of the authoring surface.

**Conclusion:** anti-homogenization is *defended* but not *active*. The one concrete safeguard ("topology/chain/map are not instruction lists") is present; it is not backed by equal-weight modeling of the non-instruction artifacts, which is exactly where the next pass should spend its effort.

---

## 8. Minimality Review

### 8.1 Subtraction test (what can be cut without loss)

| Concept | Cut? | Cost of glue |
|---|---|---|
| `ScanPolicy.selection: 'priority'|'exclusive'` | **cut** | zero — un-evidenced |
| `ScanPolicy.conflict` (all three values) | **cut** | zero — all-match writes disjoint cells today |
| `SequencePolicy.advance: 'on-success'|'until-success'` | **cut (keep 'always')** | zero — only 'always' observed |
| `SequencePolicy.termination: 'repeat-n'|'hold'` | **cut (keep 'once'|'loop')** | zero — un-evidenced |
| `RunMetaState` (achievements/unlocks) | **defer** | replaced by a *latch* model (§4-3), which is the real gap |
| `Structure/Topology` as a candidate primitive | **demote to level-specific** | Moss writes bespoke `propagate()`; Spider/Golem/Prism write bespoke logic |
| `Log` as primitive | **already cut by Codex** | correct |
| `Directive` as universal IR | **already cut by Codex** | correct |

Net: Codex's set can shed ~5 enum values + demote one candidate with **zero** loss of expressiveness. What remains — `Clock`, state, guarded mutation, pure query, optional sequence/scan-with-first/all-match, optional replay service, a level-specific structure escape hatch — is a defensible minimal core.

### 8.2 Addition test (what missing concept would erase special-cases)

| Candidate addition | Would it erase special-cases? |
|---|---|
| **Topology/graph engine** | **No.** Only Moss traverses, and bespoke. A general graph API would *add* ceremony to Spider/Golem/Prism (§4-4). Reject. |
| **A thin spatial-neighbor query** (`neighs`/adjacency over a grid) | **Marginal yes** — serves Moss and future grid puzzles; it is a query, not an engine. Worth a probe. |
| **An `Observation`/same-tick aggregate primitive** | **Yes, weakly** — "both pressed" (`demo-03`) and "pool count ≥2" (`demo-04`) are aggregates over the *current* tick that pure prior-state queries cannot express cleanly. This is the one genuinely missing concept, and it is cheap. |
| **A latch-under-scrub model** | **Yes** — resolves the §4-3 gap and directly serves Dam/March/Gravity, the only three demos with monotonic one-way facts. |

**Conclusion:** the corpus needs *at most* two small additions (same-tick aggregate; latch semantics) and *no* new big primitive. Codex did not identify either addition explicitly; both sit un-named inside its "Query vs derived state" and "History service" open questions.

---

## 9. Alternative Architecture, If Needed

**Codex (current):** `Clock + SimulationState + RunMetaState + optional Directive(sequence/scan) + [proposal/arbitrate/commit] + optional History service + unresolved Structure/Topology candidate + speculative SequencePolicy/ScanPolicy enums`.

**Alternative (minimal delta, evidence-trimmed):**

```
Codex:  A + B + C + D  + E  + F
  where A = Clock
        B = SimulationState + RunMetaState
        C = Directive (optional, sequence|scan)
        D = SequencePolicy(advance×termination) + ScanPolicy(selection×conflict)   ← over-specified
        E = optional History/Replay service
        F = unresolved Structure/Topology candidate

Alternative:  A + B + C′ + X  + E  + (F → level-specific)
  where C′ = Directive (optional), modes = sequence(once|loop, advance=always) | scan(first-match|all-match)
        X  = (i) a same-tick Observation/aggregate read, and
             (ii) a monotonic-latch cell (survives-scrub semantics), and
             (iii) a thin spatial-neighbor query (optional extension, not core)
        F  = demoted: Structure/Topology is level-specific authoring + bespoke systems, NOT a candidate primitive
```

**Difference:** one line — *drop the speculative enums, add the two evidence-grounded concepts (same-tick aggregate + latch), demote structure to level-specific, and keep `Directive` strictly optional.* This preserves every A-tier demo's expressiveness (per §6) while removing the un-evidenced surface area. It is the "small amendments" shape, but requires a decision (the structure demotion) that Codex explicitly refused to make.

---

## 10. Implementation Probe Recommendation

Codex's framework is **not** cleared for a general implementation probe, but a **bounded, evidence-gathering probe** is the only way to discharge its own matrix (§4-1). If allowed, probe the **three most heterogeneous A-tier demos**, chosen to force the open questions:

1. **Mimic Moss** (`cross-model-deepseek/demo-06`) — the only runtime-traversal demo. Probe it *twice*: once as bespoke level code, once against a thin neighbor-query extension. Success = the neighbor-query version adds no semantics and removes no legibility; otherwise, structure stays level-specific. **Answers: structure boundary, path-delay timing.**

2. **Echo Chamber Bridge** (`cross-model-claude-sonnet-5/demo-03`) — the two-track/shared-clock/failed-action case. Probe whether "failed PRESS consumes a tick" needs a `Proposal.consumesTick` field at all, or whether lockstep indexing + `advance:'always'` is sufficient. **Answers: cursor model; whether the Proposal machinery is worth building.**

3. **Dam That Breathes** (`cross-model-deepseek/demo-05`) — first-match scan + continuous flux + latch + replay-fold in one demo. Probe the latch-under-scrub question and the first-match/all-match arbitration with a two-matching-rules scenario. **Answers: latch semantics, scan arbitration, replay-as-optional-service.**

These three cover topology (1), cursor/progression (2), and arbitration+scrub (3) — the three unresolved axes — with minimal overlap.

---

## 11. Final Verdict

> **`NEEDS ANOTHER ARCHITECTURE PASS`**

Rationale, strictly:

- Codex's two factual reversals (topology observed; unified IR not established) are **correct and code-verified** — the baseline was wrong and Codex caught it.
- But the pass **stops at correct identification**: it leaves the topology boundary as an unresolved lump, adds speculative cursor/scan policy enums no demo exercises, drops (rather than resolves) the latch-under-scrub problem the baseline was attempting to model, and writes a circular gate that demands probe results as a precondition for probes.
- The stress test (§6) shows 12/13 demos are already NATURAL and the 13th is ACCEPTABLE — so the framework is *close*, and the remaining work is a **short, decision-making pass**, not a re-architecture: (a) demote Structure/Topology to level-specific, (b) trim the enums to the evidenced subset, (c) model same-tick aggregates and monotonic latches explicitly, (d) replace the circular gate with the three bounded probes above.

This is **not** `READY FOR IMPLEMENTATION PROBE` (topology and latch semantics are genuinely unsettled), **not** `READY WITH SMALL AMENDMENTS` (the structure-boundary demotion is a load-bearing architectural decision Codex refuses to make, not a cosmetic edit), and **not** `WRONG ABSTRACTION BOUNDARY` (Codex drew an honest "unresolved" boundary rather than a wrong one). One more evidence-driven pass — with the three probes actually run — is required and sufficient.
