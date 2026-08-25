# Cross-Batch Discernment Shortlist

Date: 2026-08-25

This file is a **human/assistant Discernment input**, not an automated ranking produced by the generating models.

Its purpose is to tell the next architecture-analysis agent **which mechanic genes are worth preserving** before it tries to infer a common game framework.

## Status semantics

- **A — STRONG KEEP**: the demo or mechanic family is strong enough that the future framework should be able to express it naturally, without a bespoke rewrite of the engine.
- **B — KEEP GENE / REWORK**: the current level may not belong in the final game, but it contains a valuable primitive or causal architecture. The framework should avoid making this family awkward or impossible.
- **C — DO NOT OPTIMIZE FOR**: useful research evidence, but do not add framework complexity just to preserve it.

Important: **A/B does not mean ship the current level unchanged.** We are preserving mechanic genes and causal architectures, not prototype code.

---

# 1. blind-batch-000

| Demo | Status | Preserve / reject signal |
|---|---|---|
| 01 Flooded Archive | **B** | Character/courier moving through a cyclic, changing environment; carried state + environmental timing. Current manual-control/program split should be redesigned. |
| 02 Market Parcel Belt | **C** | Matching/lookup worksheet with animation. Do not optimize for this. |
| 03 Echo Corridor | **B** | Information observed earlier and consumed later is valuable; current programming layer is too much a textual restatement of strategy. Preserve **spatially separated information production/consumption**, not the UI. |
| 04 Greenhouse | **C/B-late** | Scheduling/optimization is computationally real but too close to control-panel/educational simulation for the early core. Only preserve generic autonomous-system support. |
| 05 Workshop Queue | **B** | Multi-agent/resource contention and coordination are useful later-game genes. |
| 06 Shiftwater Bridge | **A** | Character program executes through a **mutable world that changes as actions advance time**. Strong Run → Observe → Repair loop. |
| 07 Platform Zero | **B** | Concurrency/resource-locking is valuable later, but too advanced to define early identity. |
| 08 Signal Beacon Line | **C** | Linear dependency-ordering worksheet. Do not optimize for it. |
| 09 Property Exchange | **A/B** | Strong puzzle-first gene: **objects have mutable properties and interactions transform/swap them**. Preserve world-state manipulation beyond movement. |

---

# 2. blind-batch-001

| Demo | Status | Preserve / reject signal |
|---|---|---|
| 01 Electric Repair Mouse | **B** | Character-carried resource/state that changes world on contact. Useful primitive, but the batch overused source→carry→target. |
| 02 Echo Concierge | **A** | Strong natural memory: **runtime information is produced in one place, stored/carried, and consumed elsewhere**. |
| 03 Clay Texture | **B** | Character body/property can become mutable state and be written into world objects. Current level is thin, gene is useful. |
| 04 Phase Clock | **B** | Accumulator/modular/resource state physically embodied; potentially later-game. |
| 05 Ink Cleaner | **A** | Strong **autonomous world propagation**: the world evolves and character actions compete with / interrupt the process. |
| 06 Replay Printshop | **A** | Strong **record → replay → reuse** gene; abstraction/repetition can emerge as a physical ability rather than a lesson. |
| 07 Programming Spider | **A** | Strong **topology mutation / graph construction in the world**; player leaves persistent edges and later processes flow through them. |
| 08 Cloud Doctor | **C/B** | Typed inventory/crafting is valid but current form risks recipe/matching gameplay. Do not optimize specifically for crafting. |
| 09 Magnetic Temple | **A/B** | Character finite body-state + contact-driven physics/world mutation. Preserve stateful interaction, not the exact polarity puzzle. |

Batch-001 meta-finding: **character should mediate causality, but the framework must NOT assume every puzzle is source → acquire state → walk → apply state.**

---

# 3. cross-model-claude-sonnet-5

| Demo | Status | Preserve / reject signal |
|---|---|---|
| 01 Gravity Well Gardener | **B** | Strong naked toy and **world-law timeline**, but Pip is mostly decorative. Preserve law mutation, not this character binding. |
| 02 Windup Sentries | **A** | Strong **commit → autonomous loop execution → observe**. Loop/repetition is physically justified by a wind-up agent. |
| 03 Echo Chamber Bridge | **A** | Strong **multiple independently authored tracks on a shared clock**, with synchronization as the actual puzzle. |
| 04 Blind Cave Sensor Network | **B** | Valuable **sensor → logic → actuator / hidden-state inference** gene, but current version risks becoming a disguised NOT/AND exercise. |
| 05 Pond Algae Equilibrium | **B-late** | Valuable persistent feedback-controller/equilibrium primitive, but UI/feel risks educational simulation. |
| 06 Circuit Golem Innards | **A** | Strong **debug / rewire an already-running embodied system** gene. Excellent visible causal bug and early-game potential. |

---

# 4. cross-model-deepseek

| Demo | Status | Preserve / reject signal |
|---|---|---|
| 01 The Gravity Amendment | **A** | Strong **global world-law mutation**: changing one law causes multiple world subsystems to re-simulate; protagonist can also be part of the machine. |
| 02 March the Oaf | **B/A** | Strong **blind literal executor / delegated command queue**. Slight risk of becoming conventional coding-game movement, but delegation gene is valuable. |
| 03 Echo Canyon | **A** | Strong **persistent past-self / self-referential replay** fantasy. Preserve the autonomous echo; avoid making live reflex timing essential. |
| 04 The Whispering Grotto | **A** | One of the strongest families: **hidden dynamic state → deployed sensing → rules → autonomous actuators → emergent convergence**. |
| 05 The Dam That Breathes | **A/B-late** | Strong **continuous/flux system + reactive control + dramatic physical failure**. Likely mid/late game, but framework compatibility is important. |
| 06 Mimic Moss | **A** | One of the strongest families: **topology is computation; signals propagate; nodes transform state; path length becomes delay; world can grow/change autonomously**. |

---

# 5. cross-model-kimi-k3

| Demo | Status | Preserve / reject signal |
|---|---|---|
| 01 Gravity Dial Hollow | **B** | Useful **continuous physical law as a piecewise function of time**. DeepSeek Gravity Amendment is the stronger overall representative, but this adds dwell-time / integration semantics. |
| 02 Firefly Lamplighter | **A/B** | Charming **autonomous repeating helper + spatial coverage + cumulative dwell**. Overlaps Windup Sentries but adds continuous proximity/coverage rather than attack timing. |
| 03 Echo Twin Waltz | **A** | Strong distinct echo primitive: **one script replayed by multiple actors with configurable phase offsets**. This should remain expressible even if other echo demos use separate tracks. |
| 04 Mole Sensor Greenhouse | **A/B** | Valuable **scarce sensors + runtime-hidden state + reactive/open-loop policy wiring**. Current caregiving shell can be replaced. |
| 05 The Ladybug Ledger | **B-late** | Valuable **scheduled interventions into an autonomous stock-and-flow system**; current ecology may feel like a simulation panel, so preserve event scheduling/system dynamics rather than this exact level. |
| 06 The Prism Burrow | **A** | Strong early/mid puzzle: **ordered visible state transformations / function composition**, with every intermediate state observable in the world. |

---

# 6. Strong mechanic families the framework must not fight

The following are **not proposed engine classes yet**. They are research-derived causal families that the next analysis must decompose into smaller primitives.

1. **Actor execution**
   - protagonist executes authored actions
   - helper executes delegated actions
   - blind/literal executor
   - one program may drive one or more actors

2. **Time and schedules**
   - discrete ticks
   - timed events
   - action duration / dwell duration
   - piecewise world-law schedules
   - event calendars
   - shared clocks
   - phase offsets

3. **Replay / duplication / temporal selves**
   - record behavior
   - replay behavior
   - persistent loop
   - multiple tracks
   - same track with offset
   - past-self as autonomous actor

4. **State**
   - actor-carried state
   - actor body/property state
   - object state
   - world/global state
   - hidden state
   - finite/discrete state
   - continuous numeric state

5. **Interaction / guards**
   - contact / adjacency
   - sensing / observation
   - predicates / preconditions
   - event-triggered actions
   - state transfer / transformation

6. **Autonomous world processes**
   - propagation/spread
   - agent loops
   - environmental evolution
   - ecology/stock-flow
   - continuous flux
   - autonomous growth

7. **Signals and networks**
   - graph/topology construction
   - persistent edges
   - signal propagation
   - node transformation
   - sensor→rule→actuator networks
   - path length / propagation delay

8. **World-law mutation**
   - global rule/constant mutation
   - local rule mutation
   - rule over time
   - re-simulation under changed law

9. **Composition / abstraction**
   - ordered transformations
   - reusable action sequences
   - recording/replay as abstraction
   - function-like composition without requiring literal functions in the UI

10. **Feedback / observability**
    - program change must create visible causal difference
    - intermediate state should be inspectable where possible
    - failure should persist in the world long enough to diagnose
    - debug text is secondary to world evidence

---

# 7. Anti-requirements for the future framework

Do **not** infer from the current demos that the engine should be:

- a grid-maze engine;
- a command-queue engine;
- a source→carry→target engine;
- a logistics/factory engine;
- a node-editor engine;
- a physics engine first;
- a single fixed programming-language interpreter;
- an ECS/general-purpose game engine just because it can express everything;
- a giant universal DSL before we know what the player-facing programming language should become.

The architecture analysis must search for the **smallest reusable semantic substrate** that can express the A/B mechanic families with shallow adapters.

The key question is not:

> “How can one engine implement all 36 demos exactly?”

It is:

> “What minimum set of world, time, state, causality, execution, observation, and programming primitives can generate the strongest mechanic families without forcing every level into the same interaction shape?”
