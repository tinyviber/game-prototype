# PRIMITIVE_COMPOSITION.md — Provisional Composition Catalogue

**Role:** Minimalist / Occam's Razor. This document records what the current corpus can compose and what Round 3 still has to falsify. It is not an orthogonality proof or a settled primitive list.

## 1. Shared simulation contract under test

The strongest commonality across the corpus is a causal discipline, not a single player-facing program shape:

```text
collect authored intents
→ evaluate proposals against frozen SimulationState(t - 1)
→ select and arbitrate competing effects
→ commit accepted effects deterministically
→ expose pure queries / derived views
→ update explicit RunMetaState events
```

Presentation observes the committed state and views. It does not decide game truth. The discipline is compatible with incremental execution and with an optional replay service; it does not require one of those authority strategies for every puzzle.

## 2. Provisional semantic vocabulary

### 2.1 `Clock`

```ts
type Clock = number // fixed-step tick index
```

Duration, ordering, delay, and scheduled events need a common time coordinate. The exact relationship between wall time and simulation ticks is an engine policy, but puzzle semantics should consume the fixed-step clock rather than renderer timing.

### 2.2 `SimulationState(t)` and `RunMetaState`

```ts
type SimulationState = {
  tick: Clock
  values: Record<string, unknown>
  structures: Record<string, unknown>
}

type RunMetaState = {
  runId: string
  achievements: Record<string, boolean>
  unlocks: Record<string, boolean>
  explicitEvents: Array<{ tick: Clock; kind: string; data: unknown }>
}
```

`SimulationState(t)` is historical world truth. Scrubbing to tick `t` must show the state computed for `t`; it may be changed only by the simulation's declared transitions. `RunMetaState` is separate: achievements, unlocks, run identity, and other progression facts may persist while the displayed simulation tick changes, but only an explicit run event may update it. Run metadata must not write back into historical simulation state implicitly.

This distinction replaces the earlier idea of making every stored cell carry a scrub-immune scope. Whether an achievement is awarded from an event, and whether a rule version belongs to simulation history or run metadata, remain design decisions that need explicit contracts.

### 2.3 Optional `Directive` data

```ts
type Directive = {
  op: string
  args: Record<string, number | string | boolean>
}

type SequencePolicy = {
  advance: 'always' | 'on-success' | 'until-success'
  termination: 'once' | 'loop' | 'repeat-n' | 'hold'
}

type DirectiveList = {
  id: string
  mode: 'sequence' | 'scan'
  items: Directive[]
  sequence?: SequencePolicy
  scan?: ScanPolicy
}
```

`Directive` is a useful tagged data shape for action plans and rule sets. It is not a requirement that TopologySpec, ConnectionMap, TransformChain, or WorldLaw authoring be rendered as an instruction list.

The policy fields are explicit because transition success, cursor advancement, time consumption, and program termination are different decisions:

- `advance: 'always'` can model an attempted action that consumes a tick even when its guard fails.
- `advance: 'on-success'` can model retry-until-valid behavior.
- `advance: 'until-success'` is a retry policy that needs an explicit bound or diagnostic for possible livelock.
- `once`, `loop`, `repeat-n`, and `hold` distinguish finite tapes from repeating actors and waiting programs.

An empty sequence, an exhausted finite sequence, and a held sequence need defined behavior; modulo arithmetic must never silently choose that behavior.

### 2.4 Scan selection and arbitration

```ts
type ScanPolicy = {
  selection: 'first-match' | 'all-match' | 'priority' | 'exclusive'
  conflict: 'reject' | 'merge' | 'declared-order'
}
```

This vocabulary is provisional, but the distinction is required by the evidence. The Dam's rule cascade selects the first matching threshold (`experiments/cross-model-deepseek/demo-05/index.html:76-90`); it is not equivalent to firing every matching rule. Other puzzles may intentionally apply all matches, choose the highest priority, or reject mutually exclusive matches. If two accepted proposals write the same cell, conflict handling must be declared rather than inherited from object-spread order or iteration order.

### 2.5 Transition proposals

```ts
type Proposal = {
  source: string
  outcome: 'success' | 'failure'
  consumesTick: boolean
  patch: Record<string, unknown>
  reason?: string
}
```

`GuardedTransition` remains a useful proposal shape for state-gated actions, but it is not the only behavior in the corpus. A pure query, a chain fold, and a topology propagation pass do not all need the same guard/trace wrapper. In particular, `outcome`, `consumesTick`, cursor advancement, and termination must not be inferred from one boolean field.

### 2.6 `Query` / `DerivedView` versus identity-bearing derived state

The earlier `StateCell(derived)` model is one possible implementation. A pure query may be cleaner when a value has no identity, storage, invalidation policy, or historical event of its own:

```ts
type Query<S, V> = (state: Readonly<S>, clock: Clock) => V
```

Examples include `posAt(t)`, gravity lookup, and a view of the currently lit Moss cells. An identity-bearing derived value may still be useful for a named sensor or a renderer-facing readout. The corpus does not yet justify choosing one model everywhere. Same-tick facts such as “both presses succeeded” may need an explicit tick result or event aggregate rather than a formula that reads another derived value.

### 2.7 `Structure/Topology` candidate

The expanded evidence requires a structure-shaped candidate to remain in the analysis:

- Mimic Moss traverses player-authored neighboring plants with synchronous propagation; distance controls arrival and plant type changes color (`experiments/cross-model-deepseek/demo-06/index.html:87-105`).
- Programming Spider creates persistent edges by a body action and later lets rain use the resulting web (`experiments/blind-batch-001/demo-07/index.html:4`; `DESIGN.md:9-23`).
- Circuit Golem evaluates editable eye-to-arm connection mappings (`experiments/cross-model-claude-sonnet-5/demo-06/index.html:71-85,122-169`).
- Prism Burrow folds an ordered transformation chain through a color table (`experiments/cross-model-kimi-k3/demo-06/index.html:98-102,176-182`).

These may be separate typed domains rather than one graph API. The candidate is therefore a question about reusable semantics, not a mandate to build a general graph engine.

### 2.8 History / Replay / Snapshot service

DeepSeek's `SIM.run` demonstrates that replay-from-input is a useful authority strategy (`experiments/cross-model-deepseek/demo-05/index.html:76-104`). It does not prove that an append-only `Log` is a gameplay atom. History, replay, snapshots, rule-versioning, and trace collection should be treated as optional engine services until a probe shows that a puzzle cannot be expressed without them.

## 3. Composition catalogue

| Family | Composition observed | Status after Round 3 |
|---|---|---|
| Sequential command walk | optional `Directive(sequence)` + state + transition proposals | well-supported, policy details required |
| Failed action that consumes time | transition outcome + `consumesTick:true` + unchanged cursor | directly required by Echo Chamber Bridge (`experiments/cross-model-claude-sonnet-5/demo-03/index.html:68-72`) |
| Finite, looping, or repeated execution | sequence data + explicit termination policy | required distinction; not inferred from modulo |
| Continuous rule scan | `Directive(scan)` or a RuleSet + explicit selection/arbitration | well-supported, but first/all/priority are distinct |
| First-match threshold cascade | ordered rules + `selection:'first-match'` | observed in Dam |
| Boolean wiring | named state + pure query | observed in Blind Cave Fish and related demos |
| Sensor aliasing | stored selector + dereferencing query | observed in Mole Sensor |
| Piecewise law over time | pure query or rule fold over clock | observed; Query versus derived state remains open |
| Multi-actor temporal echo | shared clock + multiple tracks or historical query | composition pattern; History service boundary open |
| Continuous coupled dynamics | state updates from the same frozen prior state | supported by ecology/flux demos; effect conflict policy required |
| Persistent edge construction | transition mutates a structure value; later query/propagation reads it | observed in Programming Spider; general structure API open |
| Topology propagation and path delay | structure traversal + distance-aware query/effect | observed in Mimic Moss; reusable service open |
| Connection mapping | authored map + event-driven query | observed in Circuit Golem; relation to topology open |
| Ordered transformation chain | authored chain + deterministic fold + visible intermediates | observed in Prism Burrow; domain boundary open |
| Recorded sub-sequence | state value holds data later iterated by an effect | observed in Replay Printshop; not a separate replay atom |

This table demonstrates reuse patterns, not universal reduction. The four structure families are the reason the earlier flat-rule-only conclusion is withdrawn.

## 4. Falsification matrix

| Question | Evidence to inspect | Failure condition |
|---|---|---|
| Is Structure/Topology reusable? | Moss, Spider, Golem, Prism source and design | one shared contract forces unrelated domains into misleading graph semantics |
| Is Directive a universal authoring IR? | action plans versus topology, mapping, and chain UIs | player-authored structures lose their natural representation or require tautological `{op,args}` wrappers |
| Is Log core? | incremental runs versus `SIM.run` replay and scrub requirements | gameplay semantics depend on logging even when no history feature is requested |
| Query or derived state? | `posAt`, `gAt`, Moss light view, same-tick aggregates | formulas need identity/history/event semantics that a pure query cannot supply, or derived cells add ceremony with no benefit |
| How does sequence progress? | Firefly, March, Echo Chamber | failed actions, finite queues, retry, and loop behavior cannot be represented explicitly |
| How does scan arbitration work? | Dam and multi-rule probes | matching rules have ambiguous selection or implicit patch-order selection |
| What survives scrubbing? | historical state versus achievements/unlocks | a displayed historical tick changes or persists without an explicit event and boundary |

## 5. Current status

The fixed-step, frozen-prior-state, deterministic-commit discipline is the strongest shared kernel hypothesis. `Clock`, simulation state, proposal/effect flow, authoring representations, structure semantics, queries, and history services must still be separated by evidence. The primitive count remains undecided, and framework probes should wait until the matrix above has explicit answers.
