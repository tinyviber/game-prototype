# FRAMEWORK_ADVERSARIAL_REVIEW.md — Round 3 Falsification Pass

**Participants:** Evidence & Code Inspector · Radical Paradigm Brainstormer · Minimalist · Adversarial Red Team · Orchestrator.

**Status:** the earlier five-item vocabulary is a hypothesis, not a decision. Round 3 exists because the previous sample omitted A-tier structure-heavy demos and because several execution policies were hidden inside pseudo-code. The purpose of this document is to record attacks, evidence, and pass conditions.

## 1. Attack: does one player-facing Program exist?

The earlier sample contained Firefly, Echo Twin Waltz, Mole Sensor, and Prism Burrow. The expanded sample adds:

- Mimic Moss: `plants[]` is a spatial authored structure traversed by synchronous propagation (`experiments/cross-model-deepseek/demo-06/index.html:87-105`).
- Programming Spider: `edges[]` is built by `tie` and persists in the world (`experiments/blind-batch-001/demo-07/index.html:4`; `DESIGN.md:9-23`).
- Circuit Golem: dropdowns alter eye-to-arm source mappings (`experiments/cross-model-claude-sonnet-5/demo-06/index.html:71-85,122-169`).
- Prism Burrow: socket order is an ordered transformation chain folded through `T` (`experiments/cross-model-kimi-k3/demo-06/index.html:98-102,176-182`).

These objects are not naturally the same player-visible thing. A tagged `{op,args}` representation can encode any one of them, but that fact alone does not show that a universal instruction IR is useful. It can become a tautological wrapper that hides the semantic distinction between an action plan, a topology, a connection map, and a transformation chain.

**Current finding:** `Directive` remains a useful optional data shape for sequence and scan authoring. A shared simulation discipline may survive, but a universal authoring representation and shared compiler are not established. Shared semantics do not imply one shared program representation.

**Pass condition for a future shared compiler:** it must preserve the natural authoring semantics of all four structure cases, expose typed validation, and avoid forcing every authored artifact into an instruction-list mental model.

## 2. Attack: what is actually shared by the kernel?

The useful common contract is causal ordering:

```text
collect intents
→ evaluate proposals against frozen SimulationState(t - 1)
→ apply selection and conflict arbitration
→ commit accepted effects in a declared deterministic order
→ expose query / derived views
→ emit explicit RunMetaState events
```

This discipline prevents same-tick read-after-write accidents. It also makes sequence progression a separate policy: a failed operation may consume a tick without advancing its cursor. It makes scan selection a separate policy: a first-match cascade is not an all-match list.

The four-phase discipline is a recommendation for the framework, not a claim about how every existing demo was written. Echo Chamber Bridge happens to coordinate local values correctly; Mimic Moss recomputes propagation inside its own loop; neither source proves a reusable kernel contract by itself.

**Current finding:** frozen-prior-state proposals, explicit arbitration, deterministic commit, and presentation/simulation separation are the strongest shared hypotheses. The authoring shape, query mechanism, history service, and structure API remain open.

## 3. Attack: topology and structure are real runtime semantics

The previous flat-expression reading fails against the expanded corpus:

| Demo | Executable evidence | Semantic pressure |
|---|---|---|
| Mimic Moss | `neighs()` and repeated `propagate()`; `dist` controls visibility and plant type transforms color (`experiments/cross-model-deepseek/demo-06/index.html:73,87-105,110-139`) | adjacency, traversal, path delay, transformation, and growth |
| Programming Spider | `edges[]` mutates when `tie` succeeds and the resulting edge set controls rain flow (`experiments/blind-batch-001/demo-07/index.html:4`; `DESIGN.md:19-23`) | persistent relation construction by an embodied actor |
| Circuit Golem | `leftArmSrc` and `rightArmSrc` select source eyes at runtime (`experiments/cross-model-claude-sonnet-5/demo-06/index.html:71-85,163-169`) | editable connection mapping |
| Prism Burrow | `chain` is folded through `T`, with intermediate colors shown (`experiments/cross-model-kimi-k3/demo-06/index.html:98-102,176-182`) | ordered transformation composition |

**Current finding:** `Structure/Topology` is a required candidate in the comparison, not an adopted abstraction. A narrow structure capability may be enough; a general graph-rewriting engine is not justified yet. It is also unresolved whether spatial topology, connection maps, and transform chains share one type or need separate domain types.

**Falsification test:** implement or model the smallest common operations for these four cases. If the shared interface requires graph-specific language for Golem or Prism, keep typed structures and shared tick semantics instead of forcing one topology API.

## 4. Attack: is `Log` a gameplay primitive or an engine service?

DeepSeek's Dam and Echo Canyon demonstrate replay-from-input through a pure `SIM.run` shape (`experiments/cross-model-deepseek/demo-05/index.html:76-104`). This proves replay is valuable. It does not prove that every puzzle needs an append-only log, or that history must be the source of simulation truth.

Two authority strategies remain plausible:

- incremental `SimulationState(t)` for forward runs, with optional observational trace;
- a `History/Replay/SnapshotService` for puzzles that need scrubbing, with versioned authored rules and explicit snapshot policy.

**Current finding:** History/Replay/Snapshot is an optional engine service or authority strategy. It becomes a semantic dependency only for puzzles whose mechanic genuinely depends on historical reconstruction.

**Falsification test:** build one forward-only topology puzzle and one scrub-heavy echo puzzle. If the same history contract is required by both, promote it; otherwise keep it optional.

## 5. Attack: pure Query versus derived state

`posAt(t)`, gravity lookup, and current Moss light can be expressed as pure queries over state and clock. A named derived value may still be useful when it has identity, caching, invalidation, or event semantics. A same-tick fact such as “both presses succeeded” cannot be assumed to be available as an ordinary formula over a previous state.

**Current finding:** `Query`/`DerivedView` and identity-bearing derived state are competing mechanisms. The earlier one-level derived-cell restriction is not treated as a settled framework law. The future contract must state whether queries can see tick results, whether they are historical, and whether caching affects semantics.

**Falsification test:** model a pure `posAt`, a named sensor, and a same-tick multi-actor gate. Choose the smallest mechanism that represents all three without hidden evaluation order.

## 6. Attack: sequence progression and termination

The old success-only cursor rule fails the Echo Chamber case: a failed `PRESS` can consume a tick without becoming a successful press (`experiments/cross-model-claude-sonnet-5/demo-03/index.html:68-72`). The old default modulo also fails to distinguish Firefly's repeating actor from March the Oaf's finite command queue.

Progression therefore needs at least these independent dimensions:

```text
advance: always | on-success | until-success
termination: once | loop | repeat-N | hold
```

The engine must define empty programs, exhausted finite programs, retry bounds, and whether a failed action consumes time. `GuardedTransition.ok` cannot decide all of those behaviors.

**Current finding:** progression is an explicit semantic policy. It may be shared infrastructure for Directive-based authoring, but it is not a fixed side effect of transition success.

## 7. Attack: scan selection and write conflicts

The Dam source scans ordered thresholds and stops at the first match (`experiments/cross-model-deepseek/demo-05/index.html:76-90`). A kernel that proposes every matching rule and lets the last patch win does not preserve that behavior.

Required policy dimensions are:

- first-match;
- all-match;
- priority with deterministic ties;
- exclusive groups;
- explicit conflict handling: reject, merge, or declared order.

**Current finding:** scan selection and effect arbitration are first-class policy decisions. Object-spread order, array order, or incidental iteration must not silently choose a winner.

## 8. Attack: historical simulation versus run metadata

A timeline debugger should show the historical `SimulationState(t)` at the selected tick. An achievement such as “opened this run” may persist across scrub, but that persistence is not a property of the historical door cell.

Use two scopes:

```text
SimulationState(t)
  historical facts; read from the selected tick; changed only by declared tick transitions

RunMetaState
  run identity, achievements, unlocks, explicit run events; persists across scrub
```

`RunMetaState` may consume an explicit simulation event, but it must not mutate a historical frame implicitly. Rule versions used for replay belong to the history contract; achievements and unlocks belong to metadata unless the puzzle explicitly makes them simulation facts.

**Current finding:** do not encode scrub immunity as a flag on every state cell. The boundary is a model-level contract that must be explicit in any future history probe.

## 9. Round 3 falsification matrix

| Question | Current status | Required evidence before implementation |
|---|---|---|
| Does topology/structure need a reusable semantic? | unresolved candidate; runtime evidence is real | Moss, Spider, Golem, Prism probe with typed versus shared structures |
| Can all authoring use one Directive representation? | not established; Directive is optional | compare player-facing topology, mapping, chain, action-plan forms |
| Is History/Replay/Snapshot core? | optional service hypothesis | forward-only and scrub-heavy probes with rule-versioning |
| Is pure Query enough, or is derived state needed? | unresolved mechanism choice | pure query, named view, same-tick aggregate probe |
| Which sequence actions advance? | explicit policy required | failed action consumes tick without advance; once/loop/repeat/hold cases |
| How are scan matches selected? | explicit arbitration required | first/all/priority/exclusive plus write-conflict probe |
| What survives scrub? | SimulationState and RunMetaState must be separate | historical truth plus persistent achievement probe |

## 10. Gate status

The fixed-step causal discipline is ready to carry into a future design: frozen prior-state proposals, explicit arbitration, deterministic commit, and presentation separated from simulation. The authoring representation, structure contract, query model, progression vocabulary, scan arbitration, and history/meta boundary are not ready to be frozen. Framework probes should begin only after the matrix above has evidence-backed decisions.
