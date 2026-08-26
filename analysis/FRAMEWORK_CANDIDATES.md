# FRAMEWORK_CANDIDATES.md — Round 3 Candidate Set

The candidates below are competing organizing strategies, not implementations to start immediately. They share a small provisional vocabulary—clock, simulation state, transition/effect flow, queries, and explicit policies—but they do not assume that every authoring surface is an instruction list.

The strongest shared constraint remains:

```text
collect
→ propose against frozen SimulationState(t - 1)
→ arbitrate
→ commit deterministically
→ expose queries / views
```

Presentation remains downstream of simulation. No candidate requires ECS, and no candidate is treated as the winner before the Round 3 falsification matrix is answered.

## Candidate 1 — Tape Machine

**Identity:** a sequence-oriented action plan is a first-class runtime input, with a cursor and explicit progression policy.

```ts
type ActionPlan = {
  items: Directive[]
  progression: {
    advance: 'always' | 'on-success' | 'until-success'
    termination: 'once' | 'loop' | 'repeat-n' | 'hold'
  }
}
```

The plan can be compiled to `Directive(sequence)`, but the compiler is optional and puzzle-specific. A failed action may consume the tick without changing the cursor. A finite queue does not wrap by default; a loop must be declared. Scan-mode rules are separate and require their own selection and conflict policy.

**Best fit:** Firefly Lamplighter, March the Oaf, Echo Chamber Bridge, and blind-batch-001's command-driven demos.

**Topology fit:** the action plan can construct a structure, but the structure's traversal and propagation semantics must live elsewhere. Programming Spider is therefore a stress test, not a complete fit.

**Known risk:** a cursor-centric kernel can make every authored object look like a command tape and can hide runtime state inside authored data, as Firefly does (`experiments/cross-model-kimi-k3/demo-02/index.html:112-121`).

## Candidate 2 — Replay / History Authority

**Identity:** simulation frames are derived from initial state plus timestamped inputs and versioned authored rules; scrubbing is a History/Replay/Snapshot service.

```ts
type HistoryService = {
  inputs: Array<{ tick: Clock; event: unknown }>
  ruleVersions: Array<{ sinceTick: Clock; artifact: unknown }>
  snapshotEvery?: number
  stateAt(tick: Clock): SimulationState
}
```

This resembles `SIM.run` in the Dam and Echo Canyon experiments (`experiments/cross-model-deepseek/demo-05/index.html:76-104`). It is not required that every puzzle store an explicit append-only `Log`, and replay authority is not automatically a gameplay semantic.

`SimulationState(t)` must replay historically active rule versions. `RunMetaState` is separate: achievements and unlocks persist across a scrub only when an explicit run event records them; the history service must not silently inject metadata into a historical frame.

**Best fit:** Echo Canyon, Dam That Breathes, and puzzles where timeline inspection is itself the lesson.

**Known risks:** replay cost, snapshot policy, hot-edit versioning, and ambiguity about whether a run event belongs to simulation history or metadata. Direct incremental execution is safer for forward-only hot edits.

## Candidate 3 — Query / State Board

**Identity:** named simulation values are committed in ticks, while pure queries or derived views calculate observations over the committed state.

```ts
type Board = {
  state: SimulationState
  queries: Record<string, (s: SimulationState) => unknown>
}
```

This models sensor wiring, law lookup, and readouts naturally. It does not commit to `StateCell(derived)` as the only representation: a query with no identity or history may be cheaper and clearer. A named derived value may still be introduced where identity, caching, or event semantics are real.

**Best fit:** Mole Sensor Greenhouse, Blind Cave Fish, Circuit Golem, and ecology/law puzzles.

**Known risk:** a query-centric presentation can under-specify sequential progression and same-tick event aggregates. The kernel must still provide proposal collection, arbitration, and deterministic commit.

## Candidate 4 — Structure / Topology Kernel

**Identity:** player-authored structures are first-class semantic inputs, and the kernel offers the smallest reusable operations needed to mutate, inspect, and propagate through them.

Candidate structures include:

- a spatial plant topology with adjacency and path delay (Mimic Moss, `experiments/cross-model-deepseek/demo-06/index.html:87-105`);
- persistent edges built by an actor and later traversed by flow (Programming Spider, `experiments/blind-batch-001/demo-07/index.html:4`; `DESIGN.md:9-23`);
- a connection map from sensors to actuators (Circuit Golem, `experiments/cross-model-claude-sonnet-5/demo-06/index.html:71-85,122-169`);
- an ordered transformation chain (Prism Burrow, `experiments/cross-model-kimi-k3/demo-06/index.html:98-102,176-182`).

The candidate does **not** claim these are one graph type. It asks whether a typed `Structure` interface, or several domain-specific structures, is needed beyond arbitrary state plus puzzle-specific queries.

**Best fit:** the four structure-heavy A-tier examples above.

**Known risk:** a generic graph engine could overfit Moss and Spider, misdescribe Golem mappings, and make Prism's chain unnecessarily graph-like. The first probe should be narrow and evidence-driven.

## Candidate 5 — Heterogeneous Semantic Adapters

**Identity:** authoring remains domain-specific—`ActionPlan`, `RuleSet`, `TopologySpec`, `ConnectionMap`, `TransformChain`, or `WorldLaw`—and each adapter emits deterministic proposals/effects into one shared tick discipline.

```text
authoring artifact
  → optional puzzle-specific adapter
  → proposals / queries / structure operations
  → deterministic simulation tick
```

`Directive` is one adapter target, not a universal intermediate representation. This candidate takes seriously that Prism's `chain[]`, Golem's selectors, Spider's edges, and Moss's plants have different player-visible semantics even if their effects eventually reach the same simulation state.

**Best fit:** the full heterogeneous corpus.

**Known risk:** too much adapter freedom could lose shared tooling, diagnostics, and authoring-language growth. The implementation question is what can be shared safely: validation, clocks, proposal contracts, arbitration, and rendering boundaries are stronger candidates than one universal syntax.

## Policy dimensions every candidate must make explicit

### Sequence progression

- `always`: attempt consumes the tick and advances even after failure.
- `on-success`: failure consumes or does not consume time according to the action contract, but the cursor remains until success.
- `until-success`: retry is explicit and must have a diagnostic or bound against livelock.
- termination: `once`, `loop`, `repeat-n`, or `hold`.
- empty and exhausted programs need declared behavior.

Echo Chamber Bridge supplies the direct counterexample to inferring cursor motion from `ok`: a failed `PRESS` can consume a tick without becoming a successful press (`experiments/cross-model-claude-sonnet-5/demo-03/index.html:68-72`). Firefly supplies a repeating actor, while March supplies a finite queue. Both policies belong in the candidate comparison.

### Scan selection and conflict handling

- `first-match`: stop at the first matching rule, as in the Dam cascade (`experiments/cross-model-deepseek/demo-05/index.html:76-90`).
- `all-match`: apply every matching rule when effects are intentionally composable.
- `priority`: select the highest explicit priority, with a deterministic tie rule.
- `exclusive`: reject or diagnose multiple matches in a mutually exclusive group.
- conflict: declare whether patches merge, reject, or use a named order. Never let object-spread or incidental iteration order decide.

## Comparison matrix

| | Tape Machine | Replay/History | Query/State Board | Structure/Topology | Heterogeneous Adapters |
|---|---|---|---|---|---|
| Natural authoring shape | action plan | timeline + events | named values + queries | topology/map/chain | domain-specific artifact |
| Directive role | useful sequence/scan target | optional replay input | optional rule data | not assumed | optional adapter target |
| Progression | explicit cursor policy | event schedule/versioned inputs | adapter-specific | structure mutation policy | adapter-specific |
| Scan arbitration | required for rule lists | part of replay semantics | selector policy | structure/query policy | shared arbitration contract |
| Topology support | external/partial | replayed structure history | query over structure | organizing concern | adapter + shared structure operations |
| History | optional service | organizing service | optional | optional | optional |
| Simulation/meta split | required | required for scrub semantics | required | required | required |
| Main failure mode | instruction-list bias | replay cost and hot-edit ambiguity | weak sequence semantics | over-general graph engine | adapter fragmentation |

## Decision status

Candidates 1–5 remain live. Candidate 4 must appear in every future comparison because the expanded corpus contains runtime topology semantics. Candidate 5 is the safest authoring stance until we know whether structure domains can share an API. The shared fixed-tick proposal/arbitration/commit discipline is the current common ground; the organizing primitive and service boundaries remain unsettled.
