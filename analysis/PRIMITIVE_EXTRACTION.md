# PRIMITIVE_EXTRACTION.md — Round 3 Falsification Pass

**Role:** Evidence & Code Inspector. **Rule:** distinguish executable evidence, design evidence, and framework proposals. A pattern that appears in one demo is not automatically a shared primitive.

**Status:** provisional. Round 2 re-read six load-bearing demos and produced useful hypotheses, but its sample omitted several A-tier counterexamples already present in the shortlist. This pass widens the evidence set before any framework probe or primitive-count decision.

## 1. Corpus re-verification

The Round 2 table remains useful, but it is not the whole corpus. The following additional evidence changes the status of the earlier topology conclusion.

| Demo | Evidence path | Authored object | Runtime behavior | Current evidence status |
|---|---|---|---|---|
| Firefly Lamplighter | `experiments/cross-model-kimi-k3/demo-02/index.html:108-135` | `cmds[]` with `ci` | sequence walk with a repeating cursor and in-place duration bookkeeping | observed sequence case |
| Echo Twin Waltz | `experiments/cross-model-kimi-k3/demo-03` | `segs[]` | pure `posAt(t)` fold, sampled at different times | observed query/replay case |
| Mole Sensor Greenhouse | `experiments/cross-model-kimi-k3/demo-04` | conditional and scheduled rules | whole rule set re-evaluated every frame | observed scan case |
| Prism Burrow | `experiments/cross-model-kimi-k3/demo-06/index.html:98-102,176-182` | `chain[]` | socket order is folded through a color transformation table | observed ordered transform chain |
| The Dam That Breathes | `experiments/cross-model-deepseek/demo-05/index.html:76-104` | `rules[]` and moves | pure replay-style simulation with first matching rule selected | observed replay and first-match case |
| Echo Chamber Bridge | `experiments/cross-model-claude-sonnet-5/demo-03/index.html:68-72` | two command tracks | failed `PRESS` can consume a tick without advancing the intended action | observed progression counterexample |
| Mimic Moss | `experiments/cross-model-deepseek/demo-06/index.html:87-105,130-139` | player-placed `plants[]` | synchronous neighbor traversal, path distance, color transformation, and autonomous sprouting | observed topology/propagation case |
| Programming Spider | `experiments/blind-batch-001/demo-07/index.html:4`; `DESIGN.md:9-23` | `edges[]` built by `tie` | persistent edges remain in the world and later carry rain | observed persistent-edge case |
| Circuit Golem Innards | `experiments/cross-model-claude-sonnet-5/demo-06/index.html:71-85,122-169` | eye-to-arm source mapping | the same event sequence is evaluated through the selected connections | observed connection-map case |

The shortlist independently classifies Mimic Moss and Programming Spider as topology-heavy and Circuit Golem and Prism Burrow as strong structure/transformation evidence (`experiments/DISCERNMENT_SHORTLIST.md:45,62,75,88`). These are not merely narrative similarities: the Moss source executes a layered propagation loop, Spider stores edges, Golem reads editable mapping values, and Prism folds an ordered chain.

**Correction:** Round 2's six-demo sample was too narrow to support a general conclusion about topology. Flat boolean expressions and first-match arrays are real cases, but they do not cover the spatial traversal and persistent structure cases above.

## 2. Findings retained from the earlier pass

### 2.1 Guarded mutation is a useful shape, not a universal law

Many demos have a recognizable proposal shape: inspect state, either produce an effect or reject it, then report an outcome. The shape is useful for transitions and failure feedback. It is not present in the same form everywhere: Echo Twin Waltz is a pure query, Prism Burrow validates a complete chain at Run time, and some demos have no rejection trace at all.

### 2.2 Runtime data can leak into authored data

Firefly mutates a command object's duration during execution and restores it from cached data (`experiments/cross-model-kimi-k3/demo-02/index.html:112-121`). That is evidence for separating authored values from runtime cursor/timer state. It is not evidence that every authored object must use one shared instruction representation.

### 2.3 Replay has multiple shapes

Echo Twin Waltz samples one pure function at two times; Echo Canyon replays a tape and timestamped moves; Echo Chamber Bridge runs two tracks on one clock; Replay Printshop iterates a recorded array inside one effect. These are composition patterns, not proof of one mandatory replay primitive or one mandatory log representation.

## 3. Candidate docket

### 3.1 Sensor and aliasing

Mole Sensor's selector values are stored indices dereferenced inside a rule expression (`experiments/cross-model-kimi-k3/demo-04`). This supports the narrow claim that a scarce sensor selector can be represented as state plus a query. It does not decide how topology propagation or other structure queries should be represented.

**Status:** reduced in this narrow family; not a general statement about all observation systems.

### 3.2 Echo/replay

The corpus supports shared clocks, phase offsets, timestamped inputs, pure historical queries, and recorded sub-sequences. None of these requires naming an `Echo` atom. However, whether replay belongs in the kernel or in an optional History/Replay service remains open.

**Status:** composition pattern observed; service boundary unresolved.

### 3.3 Signal, wire, and topology

There are at least two materially different families:

1. **Flat rule/query wiring:** named values and boolean expressions or first-match scans, as in Blind Cave Fish, the Dam, and the Mole Sensor.
2. **Runtime structure semantics:** player-authored topology is traversed or persists as causal world state, as in Mimic Moss and Programming Spider. Circuit Golem's mapping and Prism Burrow's ordered chain are further structure-shaped authoring cases.

The earlier claim that wiring can be reduced to flat expression scans is therefore too broad. The evidence establishes a **Structure/Topology candidate** with possible operations such as adjacency, connectivity, propagation, path distance, mapping lookup, and ordered transformation. It does not yet establish that all of those operations share one reusable API.

**Status:** topology/structure is an unresolved semantic candidate. Do not silently compile it into an instruction list, and do not prematurely commit to a general graph-rewriting engine.

### 3.4 Inventory and carrying

Clay Transcriber, Cloud Doctor, and Echo Concierge show scalar or bounded-array state written and read by transitions (`experiments/blind-batch-001/demo-03`, `demo-08`, `demo-02`). A general reverse-query relation store is not evidenced by those demos.

**Status:** ordinary namespaced state is sufficient for the observed cases; keep reverse relational queries out of the initial scope.

### 3.5 Structure/Topology candidate dossier

| Evidence | What is actually computed | What remains unproven |
|---|---|---|
| Mimic Moss | `neighs()` plus repeated propagation from the prism; `dist` controls arrival and plant type changes color; plants can sprout later | whether a reusable topology service or a puzzle-specific query is the smaller abstraction |
| Programming Spider | `edges[]` is mutated by `tie`; the world renders and evaluates the resulting edge set | whether general connectivity is needed beyond the current hard-coded edge checks |
| Circuit Golem | source selectors map eyes to arms during a repeated event sequence | whether connection maps share semantics with spatial graphs |
| Prism Burrow | `chain[]` is folded through `T` and each intermediate color is observable | whether an ordered transform chain belongs to Structure or to a separate domain type |

This dossier is enough to reopen the question, not enough to settle the answer.

## 4. Provisional vocabulary under test

These are candidates, not a certified minimal set:

1. `Clock` / fixed-step time.
2. `SimulationState(t)` for historical per-tick world facts.
3. Transition proposals and effects, with optional guards and explicit outcomes.
4. Optional `Directive` data for action plans and rule sets, interpreted through explicit sequence or scan policies.
5. Pure `Query` / `DerivedView` versus identity-bearing derived state — unresolved.
6. `Structure/Topology` — unresolved candidate supported by the expanded corpus.
7. `History/Replay/SnapshotService` — optional engine capability, not yet a gameplay atom.
8. `RunMetaState` for achievements, unlocks, run identity, and other facts that should persist independently of historical scrubbing.

The next pass must decide which entries are kernel semantics, typed data, authoring representations, or engine services. No primitive count is claimed here.

## 5. Round 3 falsification questions

- Can Mimic Moss propagation, Spider edges, Golem mappings, and Prism chains share a narrow structure contract without forcing them into graph terminology?
- Can action plans and rule sets use `Directive` without making topology, mapping, or transformation-chain authoring look like instruction lists?
- Is a pure query cleaner than an identity-bearing derived cell for values such as `posAt(t)`, `gAt(t)`, and current light propagation?
- Are progression, termination, and scan arbitration part of the kernel contract or authoring policy?
- Is history/replay required for gameplay semantics, or is it an opt-in service around an incremental simulation?
- Which state is historically scrubbed, and which `RunMetaState` survives independently of the displayed tick?

Until these questions are answered with evidence and probes, framework work should use the vocabulary above as a hypothesis set only.
