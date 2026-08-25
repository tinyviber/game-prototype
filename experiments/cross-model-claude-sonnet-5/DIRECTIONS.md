# DIRECTIONS.md — 6 Locked Orthogonal Directions

MODEL_LABEL: claude-sonnet-5
Stage: 2 (final selection, locked before any prototyping began)

Selection criterion: **maximum pairwise causal divergence** — no two demos may share a decision architecture, a feedback shape, or a programming representation. One direction per Diversity Vector (A–F) guarantees this by construction; within each vector the strongest, least-redundant `[KEEP]` premise from [IDEAS.md](IDEAS.md) was chosen.

The **same protagonist**, a small mint-green explorer with an antenna and two big eyes (nicknamed **Pip** in design notes, never named on-screen), anchors all six demos. Pip's causal role changes completely each time: law-setter, trainer, time-traveler-by-proxy, network-wirer, ecosystem-steward, and body-mechanic.

---

## demo-01 — Gravity Well Gardener (Vector A: Environmental Law Mutation)

**Causal architecture:** Pip does not move a character through space — Pip authors a *timed sequence of gravity-direction changes* that becomes the physical law of the garden plot. A seed's vine grows one cell per tick strictly along whatever gravity currently points, bending its future path only when the law itself changes. The player's decision is entirely about **when to flip the rule**, never about steering an avatar.

**What makes it orthogonal to the others:** The "program" is a law-timeline, not an agent's behavior — success or failure is a geometric consequence of physics, not of any entity's choices.

---

## demo-02 — Windup Sentries (Vector B: Asynchronous Delegation & Helpers)

**Causal architecture:** Pip configures a short **repeating patrol loop** for one or more wind-up toy soldiers, winds them up, and then Pip is *removed from the loop entirely* — the soldiers execute in real time against a wave of incoming crows with zero further player input until the wave ends.

**What makes it orthogonal to the others:** This is the only demo where the player must commit fully in advance and then simply *watch* real-time autonomous execution play out to a pass/fail result — no mid-run adjustment is possible, unlike every other demo here.

---

## demo-03 — Echo Chamber Bridge (Vector C: Temporal & State Echoes)

**Causal architecture:** Pip writes **two parallel instruction tracks** — one for "Echo" (a ghost of a previous attempt) and one for "You" (the live pass) — both ticking on a single shared clock from t=0. A twin-plate gate opens only if both tracks land their `PRESS` action on the *identical tick*. The player's decision is purely about **relative timing/synchronization across two simultaneous programs**, not about spatial pathing or logic gates.

**What makes it orthogonal to the others:** It is the only demo with two independently-programmed tracks racing on one clock; failure is a *timing mismatch* between two programs rather than a wrong rule, wrong wire, or wrong equilibrium.

---

## demo-04 — Blind Cave Fish Sensor Network (Vector D: Sensor-Actuator Networks)

**Causal architecture:** Pip cannot see into the dark cavern where a cave-bear roams. Fixed sensors already exist; the player's only lever is a small **boolean expression** (AND/OR/NOT over sensor readings) that drives a door actuator. The player never observes the bear directly — only inferred, filtered truth.

**What makes it orthogonal to the others:** This is the only demo where the player has *zero direct visibility* into the state they are reasoning about — the entire decision is made through a proxy logic layer over unseen ground truth.

---

## demo-05 — Pond Algae Equilibrium (Vector E: Emergent Ecological / Flux Systems)

**Causal architecture:** Pip sets a **persistent threshold-feedback rule** (a small hysteresis controller: raise/lower a nutrient valve at two thresholds) governing a two-population predator/resource loop (algae vs. fish) that unfolds over many simulated day-cycles. Success is a *stable equilibrium*, not a single terminal event — the same rule can look fine for ten days and then spiral into collapse on day eleven.

**What makes it orthogonal to the others:** It is the only demo whose "win condition" is dynamic stability over time rather than a discrete reachability/timing/logic event — the player is tuning a continuous control law, not sequencing discrete actions.

---

## demo-06 — Circuit Golem Innards (Vector F: State Metamorphosis & Wiring)

**Causal architecture:** Pip opens the chest panel of an already-existing, already-acting guardian golem and edits its **internal sensor→gate→actuator wiring** (which of its own eyes drives which of its own arms, through which logic gate). The golem's crossed wiring is the initial flawed state; the player is not building a new system but *repairing/rewiring an entity's own already-embodied logic*.

**What makes it orthogonal to the others:** Unlike demo-04 (deploying sensors to read an *external* unseen system), here the sensors, gates, and actuators all belong to *one visible, already-running body* — the player is debugging an organism's own nervous system, not building a network around a hidden world-state.

---

## Divergence Matrix (sanity check)

| Demo | Program shape | What fails when wrong | Player never does... |
|---|---|---|---|
| 01 Gravity Well | Timed law-change sequence | Vine hits a wall it can't grow through | ...control an avatar directly |
| 02 Windup Sentries | Cyclic patrol loop, committed upfront | A crow slips through an uncovered gap | ...intervene once running |
| 03 Echo Chamber | Two parallel tick-synced tracks | Two plates light up on different ticks | ...act with only one track |
| 04 Cave Sensor Net | Boolean expression over hidden state | Door state contradicts real unseen danger | ...see the danger directly |
| 05 Pond Equilibrium | Two-threshold feedback controller | Slow oscillation blooms into collapse | ...take a single one-shot action |
| 06 Golem Innards | Rewired internal gate map | Golem blocks/frees the wrong side, or blocks its own ally | ...control the golem from outside |

All six directions and demos below were locked before any HTML/JS implementation began.
