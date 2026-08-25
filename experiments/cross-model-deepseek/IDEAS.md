# IDEAS.md — Stage 1: The 20-Premise Divergent Matrix

Model: `deepseek` | Batch: `cross-model-deepseek` | Date: 2026-08-25

> Blind-ideation log. Generated without inspecting any previous prototype.
> All premises below passed the **Naked Toy Test** *before* any programming interface was imagined:
> *"If all code/programming interfaces were stripped away, is this still an intrinsically fascinating toy or world predicament?"*

---

## Vector A — Environmental Law Mutation
*(The character alters a world rule/physics constant; the environment continuously evolves under the new rule.)*

### A1. The Gravity Amendment — ✅ SELECTED
A buried cavern where "down" is not fixed. The explorer rewrites the law of falling for the whole cave: water re-floods, boulders re-roll, the explorer's own footing changes. The exit gate is a two-key lock: the boulder must be coaxed onto its plate by three consecutive law changes, and the explorer's own body must complete the circuit on a second plate.
- **Naked Toy**: Flipping gravity in a cave full of water and boulders is fun with zero code. Water that suddenly pours sideways is a toy by itself.
- **Pruning**: kept — the single-rule-changes-everything fantasy is the purest form of Vector A.

### A2. The Boiling Whisper
The explorer alters the freezing point of water; a flooded valley becomes a walkable ice bridge, but the air above becomes lethal vapor, forcing a timed second mutation.
- **Naked Toy**: Ice bridge forming under your feet is lovely.
- **Pruning**: REJECTED — two coupled constants create a tuning-minigame; the causal chain is harder to read physically in a small prototype. Gene banked: "one constant flip reclassifies every object in the world."

### A3. The Shadow Edict
A city of permanent noon; the explorer declares "shadows are solid" and the world's shade becomes architecture — walkable, but it also roofs the city and blocks the sun.
- **Naked Toy**: Solid shadows are a beautiful mental toy.
- **Pruning**: REJECTED — shadow geometry is hard to render readably at toy fidelity; risk of "decorative character setup". Gene banked: "an ambient quantity (light) becomes a material."

### A4. The Wind Charter
The explorer rewrites "wind pushes" into "wind attracts"; sails, seed pods and smoke all re-route.
- **Naked Toy**: A kite-flying town where the wind law is negotiable.
- **Pruning**: REJECTED — functionally similar to A1 but with less visceral visibility (air currents are invisible; water/boulders are not). Kept the gene: "the world's transport medium is a mutable constant."

---

## Vector B — Asynchronous Delegation
*(The character programs, configures, or teaches an autonomous agent, then steps back as it acts independently.)*

### B1. March the Oaf — ✅ SELECTED
A blind, enormous stone golem on a one-cell lane. The explorer queues commands (walk, push, smash, wait), winds the golem's key, and steps back to watch it obey — or bonk. Stones block the path; a pit swallows the careless; a plate must be stepped on; the golem cannot see any of it.
- **Naked Toy**: A giant idiot who follows instructions literally is inherently funny and tense — will it walk into the pit?
- **Pruning**: kept — the purest "set it and step back" delegation fantasy. The one-dimensional lane is a physical *tape*.

### B2. The Whisper Trains
The explorer schedules little carts onto a rail loop; carts run forever while the explorer does something else in the same world.
- **Naked Toy**: Watching your schedule run forever is satisfying.
- **Pruning**: REJECTED — the "explorer does something else" half usually degenerates into courier gameplay. Gene banked: "schedule-and-walk-away".

### B3. The Drumming Golems
Three stone drummers; the explorer writes a rhythm; gates open only on the beat.
- **Naked Toy**: Drum machines in a cave.
- **Pruning**: REJECTED — rhythm *is* a timing representation, which collides with Vector C; also "beat-window" gameplay drifts into reflex timing.

### B4. The Spore Sower
The explorer programs a planting robot's season: dig, seed, water, harvest; the farm feeds a market.
- **Naked Toy**: A robot farmer is charming.
- **Pruning**: REJECTED — no physical stakes; the feedback loop is a resource graph, which risks homework-ification. Gene banked: "program a whole season, then nap."

---

## Vector C — Temporal & State Echoes
*(Action recording, delayed reaction chains, causality unfolding across multiple timesteps.)*

### C1. Echo Canyon — ✅ SELECTED
The canyon's memory totem re-enacts the explorer's own recorded 10-tick walk forever. The explorer must choreograph a loop where their echo holds a spirit bridge button early in the cycle and a spirit door button late in the cycle — then physically dash across the bridge in the correct loop phase and step through the door in its phase. The explorer cooperates with their own past self.
- **Naked Toy**: "My ghost holds the bridge for me" is emotionally legible with zero programming UI.
- **Pruning**: kept — the strongest temporal-fantasy of the batch; the tape editor is a natural programming surface.

### C2. The Causality Rope
The explorer pulls a rope that rewinds the world 5 ticks; they must cooperate with the world's memory of what they did.
- **Naked Toy**: Rewind ropes are fun toys.
- **Pruning**: REJECTED — rewind is an undo mechanism, which reads as forgiveness rather than programming. Gene banked: "the world remembers and re-enacts".

### C3. The Memory Tide
The tide remembers every object's position from the previous day; each new day cooperates with yesterday's arrangement.
- **Naked Toy**: A beach that remembers is poetic.
- **Pruning**: REJECTED — the state-copy is invisible between days; debugging loop is slow (one day = one run). Gene banked: "two states of the same world must cooperate".

### C4. The Loop House
The house re-enacts the explorer's first 10 actions forever; the explorer rides the loop to escape.
- **Naked Toy**: Groundhog-day house.
- **Pruning**: REJECTED — C1 is the same gene with better physical visibility (the echo is an entity you can watch).

---

## Vector D — Sensor-Actuator Networks
*(Deploying sensory apparatus to read runtime-unknown states and trigger systemic cascading reactions.)*

### D1. The Whispering Grotto — ✅ SELECTED
A moonlit cave where three invisible motes drift. The explorer deploys listening stones (sensors), hum pipes (repellers) and lure bells (attractors), and wires IF-HOT-THEN rules between them. Mote positions are runtime-unknown: sensors are the only eyes. The goal is to herd two motes into a basin — by discovering *where* they are and *what scares vs. lures* them.
- **Naked Toy**: Herding invisible animals by sound is intrinsically fascinating.
- **Pruning**: kept — the strongest "you literally cannot see the state" premise; feedback (sensor pings) is the whole interface.

### D2. The Pressure Whistles
Buried sensors read ground weight; distant valves whistle open; the explorer cannot see the pressure either.
- **Naked Toy**: Weight-triggered machines are classic toys.
- **Pruning**: REJECTED — the hidden state is static (weights don't move), so the network has no *cascade*; D1's moving motes give a living system.

### D3. The Seismic Ear
Triangulate a burrowing creature's path through tremors, then trigger avalanche gates to corral it.
- **Naked Toy**: Blind creature hunting is tense.
- **Pruning**: REJECTED — triangulation is geometric math; risks becoming a worksheet. Gene banked: "read a hidden moving state".

### D4. The Thermal Sniffers
Shifting heat vents; sniffers read temperature and re-route heat to melt gates.
- **Naked Toy**: Heat plumbing.
- **Pruning**: REJECTED — heat flow is a flux system; belongs to Vector E and collides with E1.

---

## Vector E — Emergent Ecological / Flux Systems
*(Balancing continuous flows, pressure dynamics, equilibrium shifts, multi-agent ecologies.)*

### E1. The Dam That Breathes — ✅ SELECTED
A mountain river pulses; the explorer writes reactive sluice rules (WHEN level … THEN open …). Too stingy → the reservoir overflows and the dam bursts. Too greedy → the wheel stalls. The exit gate latches only when the waterwheel spins inside a narrow band for 8 consecutive ticks; and the ford back down-river is crossable only during low-water windows. The whole valley breathes.
- **Naked Toy**: A dam that visibly strains and bursts is a toy with no code at all.
- **Pruning**: kept — continuous equilibrium with dramatic failure; reactive rules are the natural lever.

### E2. The Spore Bloom
One mutation flips an ecosystem's equilibrium; a seed opens only at the balance point.
- **Naked Toy**: Ecology in a jar.
- **Pruning**: REJECTED — without continuous physics the equilibrium is a spreadsheet; E1's water is physical and legible.

### E3. The Two-Species Tide Pool
Tune a feeding rate to stabilize a predator–prey window long enough to cross.
- **Naked Toy**: Classic Lotka–Volterra, but as a toy it's a graph.
- **Pruning**: REJECTED — highest homework risk of the batch.

### E4. The Sand Clock Desert
Windbreaks migrate dunes; a pass opens at equilibrium.
- **Naked Toy**: Sand dunes breathing.
- **Pruning**: REJECTED — slower payoff than water; E1 shows the same gene faster.

---

## Vector F — State Metamorphosis & Wiring
*(Transforming entities, routing signals, dynamic logic gates where the character mediates state transitions without physical carting.)*

### F1. Mimic Moss — ✅ SELECTED
A garden of moss that conducts light. The explorer plants plain moss (passes color) and dye moss (turns red light blue). A poison fern blooms and spores if any light touches it. A key flower opens the tunnel only when it receives red *first*, then blue — so the explorer must wire two branches whose *path lengths* encode the delay, and keep the garden's own sprouting from short-circuiting the logic.
- **Naked Toy**: Growing glowing wires in a garden is a toy; pruning a plant that fights back is a toy.
- **Pruning**: kept — the strongest "no carting; state flows through topology" premise; the path-length-as-delay trick is a real logic-gate moment.

### F2. The Liquid Logic Pond
Water freezes on contact with frost lilies, melts near ember blooms; route a single droplet through a network of state-changing plants.
- **Naked Toy**: A droplet that changes the world as it passes.
- **Pruning**: REJECTED — routing a droplet drifts toward the cargo-transport trope. Gene banked: "a medium changes state on contact".

### F3. The Weaving Loom
Threads change color by contact; weave a cloth that is the key.
- **Naked Toy**: A loom that weaves keys.
- **Pruning**: REJECTED — the final key object is decorative; the state transitions are not load-bearing.

### F4. The Signal Garden
Creatures change species when lit; a chain of transformed creatures becomes a bridge.
- **Naked Toy**: Transformable fauna.
- **Pruning**: REJECTED — creature-state is cute but the metamorphosis is less visible than moss lighting up; F1 wins the gene.

---

## Structural Pruning Filter Log

| Premise | Rejected Because | Surviving Gene (banked) |
|---|---|---|
| A2 Boiling Whisper | two coupled constants → tuning minigame | one constant flip reclassifies all objects |
| A3 Shadow Edict | shadow geometry unreadable at toy fidelity | ambient quantity becomes a material |
| A4 Wind Charter | less visible than A1 | world's transport medium is mutable |
| B2 Whisper Trains | explorer half degenerates into courier | schedule-and-walk-away |
| B3 Drumming Golems | rhythm collides with Vector C | (none) |
| B4 Spore Sower | no physical stakes; resource graph | program a whole season, then nap |
| C2 Causality Rope | rewind reads as forgiveness | world remembers and re-enacts |
| C3 Memory Tide | slow debugging loop between days | two states of one world cooperate |
| C4 Loop House | superseded by C1 | (none) |
| D2 Pressure Whistles | static hidden state → no cascade | (none) |
| D3 Seismic Ear | triangulation → math worksheet | read a hidden moving state |
| D4 Thermal Sniffers | collides with E1 | (none) |
| E2 Spore Bloom | equilibrium without physics = spreadsheet | (none) |
| E3 Tide Pool | highest homework risk | (none) |
| E4 Sand Clock | slower payoff than water | (none) |
| F2 Liquid Logic | droplet routing ≈ transport trope | medium changes state on contact |
| F3 Weaving Loom | key object is decorative | (none) |
| F4 Signal Garden | metamorphosis less visible than F1 | (none) |

**Matrix size: 24 premises → 18 rejected → 6 finalists (one per vector).**

---

## Finalists (locked for Stage 2)

| ID | Premise | Vector |
|---|---|---|
| **A1** | The Gravity Amendment | A — Environmental Law Mutation |
| **B1** | March the Oaf | B — Asynchronous Delegation |
| **C1** | Echo Canyon | C — Temporal & State Echoes |
| **D1** | The Whispering Grotto | D — Sensor-Actuator Networks |
| **E1** | The Dam That Breathes | E — Emergent Ecological / Flux |
| **F1** | Mimic Moss | F — State Metamorphosis & Wiring |
