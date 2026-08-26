# DIRECTIONS.md — Stage 2: Six Locked Directions
Batch: `cross-model-ox-alpha` · LOCKED before any prototype code was written.

Selection criterion: **maximum pairwise causal divergence** — each finalist relies on a fundamentally different player decision and causal architecture. Exactly one survivor per diversity vector (A–F).

Protagonist (constant across all six): **Tilo** — a mint-green sapling sprite, big white eyes on a round body, leaf-antenna with an amber bobble, tiny arms and feet; readable at 32–64px; inline SVG only.

---

## demo-01 · The Leaning Grove  — Vector A (Environmental Law Mutation)
- **World problem**: a vine shoot must cross a chasm to reach the Mother Bloom; it grows one cell per breath toward whichever sun-orb glows brightest.
- **Player decision**: author the *law*, not the actor — paint which orb is brightest in each of 16 time phases.
- **Causal architecture**: player edits a persistent world rule → the environment itself executes it continuously (growth simulation). The protagonist never touches the vine.
- **Computational skeleton (hidden)**: program = scheduled policy over time; world = interpreter.
- **Minimum representation**: phase×orb selection grid ("brightness score").
- **Default failing state**: every phase pinned to Orb 1 → shoot climbs into the old rock canopy and wilts visibly.

## demo-02 · Norbert's Night Round  — Vector B (Asynchronous Delegation)
- **World problem**: sleepwalking Norbert must reach the harbor lever before dawn, but Main Street collapsed into a pit, geese nest by the lane, and a cat sleeps on the lever (the lever won't pull with a cat on it).
- **Player decision**: compose his Dream Strip once (step / jump / ring-the-bell / pull), then lose all control for the whole run.
- **Causal architecture**: one-shot delegation — the agent executes autonomously; all intervention must be baked in *before* dawn, including remote actions that move OTHER agents (ring bell → cat leaves lever).
- **Computational skeleton (hidden)**: imperative script + indirect action on second agents; no mid-run branching allowed by the fiction.
- **Minimum representation**: card slots in a horizontal strip.
- **Default failing state**: his old route walks him straight into the landslide pit on card ~7 — tumble, honks, fail.

## demo-03 · The Convergence Bells  — Vector C (Temporal Echoes)
- **World problem**: five bells at different distances toll wavefronts toward a shrine; the shrine wakes only if all five tones arrive on the same tick. One bell sits behind mist that halves its wave speed.
- **Player decision**: schedule each bell's strike tick on a timeline so delayed arrivals converge.
- **Causal architecture**: pure time-axis composition — the player manipulates *when*, never *where* or *what*; causality unfolds across timesteps and must be mentally offset per-bell.
- **Computational skeleton (hidden)**: scheduling async operations to synchronize (barrier alignment).
- **Minimum representation**: strike markers on a tick grid.
- **Default failing state**: everything struck at tick 0 → rings arrive staggered; shrine flickers discord-red; arrival flags printed per row invite repair.

## demo-04 · The Fog Chimes  — Vector D (Sensor–Actuator Networks)
- **World problem**: a moonmoth crosses foggy night gardens along a hidden path; darkness drains its glow until it falls asleep. Reach the Moonflower lit.
- **Player decision**: design a sense→act cascade with a tight budget (3 chime+lamp pairs): WHERE to listen determines what the run can reveal; lamps decide where truth becomes visible.
- **Causal architecture**: runtime-unknown state read by sensors; pings trigger timed actuators; failed runs leave breadcrumbs ONLY where light touched — evidence-driven iterative network repair.
- **Computational skeleton (hidden)**: event binding + observation logging; debugging through instrumentation.
- **Minimum representation**: place-and-pair placement board (chime→lamp link drawn as thread).
- **Default failing state**: naive straight-line placements ping once by accident, light the wrong stretch; moth visibly dims, curls, drops mid-fog — but leaves one glowing clue.

## demo-05 · The Mill Weir  — Vector E (Emergent Flux / Equilibrium)
- **World problem**: storms and droughts sweep a mountain pond day; the millwheel must grind until dusk, the beaver burrow must stay dry, the crest must not spill.
- **Player decision**: write up to two threshold rules for the sluice gate (WHEN gauge ▲/▼ mark N THEN open/close) — then live inside the feedback loop you authored.
- **Causal architecture**: continuous-time equilibrium management; single actuator governed by reactive rules; success demands anticipating lag (hysteresis) rather than reacting late.
- **Computational skeleton (hidden)**: conditional rules driving a control loop; bang-bang control vs hysteresis.
- **Minimum representation**: rule cards with draggable gauge marks.
- **Default failing state**: inherited rule "open as soon as water passes LOW mark" drains the basin after every burst → wheel visibly stalls mid-drought, cobwebs, grain quota missed at dusk.

## demo-06 · The Spore Telegraph  — Vector F (State Metamorphosis & Wiring)
- **World problem**: the chant-totem spits colored spores in fixed rhythm [R,B,B,R,B]; the Great Door opens only for password [B,B,R] arriving at its three sockets. Between them: a fungal switchboard of relay / prism (color-swap) / snail (delay) mushrooms wired by tendril threads.
- **Player decision**: re-route wires AND graft caps under a strict spore budget (3 grafts) — transform signal state in transit instead of carting anything.
- **Causal architecture**: discrete signal routing through transformation nodes; ordering emerges from wiring topology, not from any moving character.
- **Computational skeleton (hidden)**: function composition over a data stream; routing + state mapping.
- **Minimum representation**: drag-wire graph + click-to-graft cap cycling.
- **Default failing state**: honest straight wires, all-relay caps → first spore arrives RED at a BLUE socket; door slams with expected-vs-received glyphs carved side by side.

---

# Pairwise Divergence Matrix

| | A1 Grove | B2 Norbert | C3 Bells | D4 Chimes | E5 Weir | F6 Spore |
|---|---|---|---|---|---|---|
| **Lever pulled** | rewrite world law | delegate once | choose *when* | wire sense→act | balance flux | rewire+transform |
| **Who executes** | the grove itself | Norbert alone | physics of waves | the network | the pond | the switchboard |
| **Time model** | phased growth | one-shot script | convergence deadline | continuous night | continuous weather cycle | rhythmic beats |
| **Info regime** | fully visible | fully visible | delays partly hidden (mist) | path runtime-hidden | future weather scripted | fully visible |
| **Failure texture** | wilt/tangle | tumble/honk/splash | discord flicker | moth sleeps mid-air | stall/flood/spill | door slam |
| **Repair medium** | ghost path of last try | edit dream strip | arrival flags | breadcrumbs from light | live gauge + grain meter | carved glyphs |

No two demos share the primary decision type; no demo is maze navigation or cargo delivery.
