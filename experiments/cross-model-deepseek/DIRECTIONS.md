# DIRECTIONS.md — Stage 2: Six Locked Orthogonal Directions

Model: `deepseek` | Batch: `cross-model-deepseek` | Date: 2026-08-25

> Selection criterion applied: **maximum pairwise causal divergence**.
> Each finalist must rest on a fundamentally different *player decision* and *causal architecture*.
> These 6 directions are **LOCKED**. Stage 3 implements exactly these, nothing else.

---

## The 6 Locked Directions

### Demo 01 — The Gravity Amendment (Vector A: Environmental Law Mutation)

| | |
|---|---|
| **World problem** | A cavern sealed by a two-key gate. The boulder is stranded on a shelf; the water pool is useless; the exit glimmers behind a shut gate. |
| **Player decision** | *When* to amend the law of falling, and *to what*: the player writes a timed law-list (`t=0 → EAST`, `t=10 → DOWN`, `t=20 → WEST`). |
| **Causal architecture** | ONE rule (the gravity vector) → re-simulates the ENTIRE environment every tick. Water re-floods, the boulder re-rolls, everything continuously evolves under the current law. Causality is *global and ambient*: the player does not touch any object directly. |
| **Protagonist causality** | The character's own body is the second key — the gate circuit only closes while the explorer stands on the character-plate. The protagonist is part of the machine, not a courier. |
| **Programming representation** | A timed law-list of cards: `[time] [direction]`. Later laws override earlier ones. |
| **Natural computational need** | Sequencing + state: three law changes must be ordered so the boulder's path and the explorer's own route survive the flood. |
| **Divergence fingerprint** | *Ambient-global causality, single-constant mutation, rule timeline.* |

### Demo 02 — March the Oaf (Vector B: Asynchronous Delegation)

| | |
|---|---|
| **World problem** | A blind stone golem must cross a one-cell lane: stones block the way, a pit swallows the careless, a plate must be stepped on, a gate must open, a key must be collected. The golem cannot see any of it. |
| **Player decision** | *Which command queue* to delegate: `WALK k`, `PUSH`, `SMASH`, `WAIT k` — the entire solution is encoded BEFORE the run. |
| **Causal architecture** | An instruction queue → an AUTONOMOUS agent executes it alone → world consequences. The player is causally *absent during execution* (they wind the key and step back). Causality is *delegated and irreversible*. |
| **Protagonist causality** | Only the explorer can wind the crank (the golem has no will); the explorer's queue fully determines the outcome. The payoff: the golem delivers the key to the explorer. |
| **Programming representation** | A command queue of cards — a physical "tape" the golem reads. |
| **Natural computational need** | Sequence + decomposition: order matters (push the stone into the pit BEFORE walking; smash only when adjacent). |
| **Divergence fingerprint** | *One-shot delegation, autonomous executor, no live control during run.* |

### Demo 03 — Echo Canyon (Vector C: Temporal & State Echoes)

| | |
|---|---|
| **World problem** | A chasm with a spirit drawbridge and a spirit door. Both respond ONLY to the explorer's own recorded echo. The totem already hums an old, wrong song. |
| **Player decision** | *How to choreograph a 10-frame tape*: which frames hold the bridge button, which frames run to the door button, so that a live dash across the bridge and a live step through the door both fit the loop. |
| **Causal architecture** | A recorded action → infinite delayed replay → the world is held open by the player's own past self. Causality unfolds ACROSS timesteps and loops; the player and their echo cooperate *asynchronously*. |
| **Protagonist causality** | The echo IS a copy of the protagonist. No other entity exists to press the spirit buttons. The protagonist must physically dash in sync with their own ghost. |
| **Programming representation** | A 10-slot instruction tape (record live, or hand-edit arrows), plus a frame-strip debugger showing exactly when the bridge/door are open. |
| **Natural computational need** | Timing + state scheduling: a fixed 10-frame budget must be split between two obligations. |
| **Divergence fingerprint** | *Self-referential causality across time, loop-synchronized live action, tape programming.* |

### Demo 04 — The Whispering Grotto (Vector D: Sensor-Actuator Networks)

| | |
|---|---|
| **World problem** | A moonlit cave where three invisible motes drift. The exit gate latches only when two motes are herded into a basin. Mote positions are runtime-unknown: sensors are the only eyes. |
| **Player decision** | *Where to deploy* listening stones, lure bells and hum pipes, and *how to wire* IF-HOT-THEN rules between them. The player must discover what the motes are, where they are, and what scares vs. lures them. |
| **Causal architecture** | Sensors read a hidden state → rules fire → actuators push/pull the hidden actors → cascades converge on the basin. Causality is *perceptual → reactive*, with actuator resonance (hysteresis) as the timing glue. |
| **Protagonist causality** | Only the explorer can crawl in and install the apparatus; the explorer reads the readouts and must physically reach the gate once it opens. |
| **Programming representation** | Spatial deployment (click to place) + a rule list `IF sensor HOT → actuator ON`. |
| **Natural computational need** | Conditionals over runtime-unknown input: you cannot hard-code paths because you cannot see the actors. |
| **Divergence fingerprint** | *Perception-first reactive rules, hidden dynamic state, cascade convergence.* |

### Demo 05 — The Dam That Breathes (Vector E: Emergent Ecological / Flux)

| | |
|---|---|
| **World problem** | A pulsing mountain river feeds a reservoir behind a dam. The exit gate opens only when the waterwheel spins inside a narrow RPM band for 8 consecutive ticks; the ford down-river is crossable only during low-water windows. |
| **Player decision** | *Which reactive sluice rules* to write: `WHEN level < X → sluice Y%`. Too stingy → burst. Too greedy → stall. The player tunes a continuous equilibrium, not a path. |
| **Causal architecture** | Continuous differential dynamics: inflow pulses → level integrates → outflow → wheel RPM → gate streak. No discrete entities; causality is *flow and equilibrium*. |
| **Protagonist causality** | The explorer must wade the ford during a low window and physically stand at the gate; the timing of the crossing is part of the solution. |
| **Programming representation** | A reactive rule list `WHEN level … → sluice …` (threshold cards, first-match wins). |
| **Natural computational need** | Reactive control over a continuous quantity: the river keeps coming; a single opening is never right forever. |
| **Divergence fingerprint** | *Continuous equilibrium control, differential causality, tuning over sequencing.* |

### Demo 06 — Mimic Moss (Vector F: State Metamorphosis & Wiring)

| | |
|---|---|
| **World problem** | A garden of light-conducting moss. The prism glows red. The key flower opens the tunnel only when it receives red FIRST, then blue. A poison fern blooms and spores if any light touches it. The garden sprouts new moss by itself. |
| **Player decision** | *What topology to grow*: which cells become plain relays, which become dye (red→blue), and where — so that the red signal and the blue signal arrive at the flower in the right ORDER, while never lighting the fern, and while trimming the garden's own sprouts. |
| **Causal architecture** | Signal propagation along a network the player grows: light floods 1 hop/tick; path LENGTH encodes delay; dye nodes transform state. Causality is *topological and metamorphic* — nothing is carried, everything is transformed in place. |
| **Protagonist causality** | The explorer is the gardener: only the explorer plants seeds and prunes, and the explorer must physically walk into the tunnel once the flower blooms. |
| **Programming representation** | Direct spatial wiring: click to plant plain moss / dye moss / prune; light propagation is the interpreter. |
| **Natural computational need** | Combinational logic + timing: order of arrival is decided by branch length; shorts (fern contact) are bugs to prune. |
| **Divergence fingerprint** | *Topological state transformation, signal ordering by length, living self-growing circuit.* |

---

## Pairwise Divergence Matrix (why these 6 are mutually orthogonal)

| | 01 Gravity | 02 Oaf | 03 Echo | 04 Grotto | 05 Dam | 06 Moss |
|---|---|---|---|---|---|---|
| **01 Gravity** | — | rule-timeline vs command-queue | global re-simulation vs personal replay | law editing vs rule wiring | discrete laws vs continuous flow | timed laws vs spatial topology |
| **02 Oaf** | delegate to a *rule* vs delegate to an *agent* | — | one-shot queue vs looping tape | blind executor vs blind observer (sensors) | command steps vs equilibrium tuning | agent vs no agent (signal only) |
| **03 Echo** | world evolves vs self replays | agent executes vs self executes | — | timed choreography vs reactive triggers | loop timing vs continuous control | tape (time) vs wire (space) |
| **04 Grotto** | edit physics vs read hidden state | give orders vs deploy sensors | choreograph vs react | — | discrete events vs continuous flows | sensor→actuator vs pure propagation |
| **05 Dam** | discrete law vs differential law | sequence vs control | personal timing vs system timing | react to hidden motes vs react to a gauge | — | continuous value vs discrete colors |
| **06 Moss** | one global law vs local growth | commands vs wiring | time-tape vs space-wire | conditional network vs combinational circuit | flow tuning vs signal ordering | — |

**Structural claim:** no two demos share (a) the same player decision type, (b) the same causality grain (discrete-event / continuous-flow / signal-propagation / self-replay), or (c) the same programming representation (law-list / command-queue / tape / rule-wiring / threshold-rules / spatial-layout). Six archetypes, six causal engines, six interfaces.
