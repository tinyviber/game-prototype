# IDEAS.md — Divergent Premise Matrix

MODEL_LABEL: claude-sonnet-5
Stage: 1 (raw ideation, blind to prior batches)

Each premise is checked against the **Naked Toy Test**: *if all code/programming UI vanished, is this still an intrinsically fascinating toy or world predicament?*

Legend: `[KEEP]` survives pruning as a strong candidate · `[ALT]` valid but redundant with a stronger sibling · `[CUT]` fails Naked Toy Test or collapses into a rejected trope (worksheet, maze, delivery, decoration).

---

## Vector A — Environmental Law Mutation

**1. Gravity Well Gardener** — Plant a seed; set the *direction* gravity currently points inside a walled garden plot. Roots/vines grow one cell per tick strictly along the current gravity vector, bending around rocks only if the law changes mid-growth. Naked toy: watching a vine snake through a garden under an invisible force field, like a magnetic maze toy. `[KEEP]`

**2. Tide Clock Village** — Set the tide's period/height law for a bay; boats and stranded crabs respond over cycles. Fascinating tide-pool sim, but the "correct docking window" reduces to timing arithmetic once codified. `[ALT]` (redundant with #1's rule-mutation architecture, weaker naked-toy hook).

**3. Thermostat Tundra** — Set a freeze-point law; rivers freeze/thaw, bridges appear/vanish. Good toy, but mechanically near-identical to #1 (single scalar law → spatial consequence). `[ALT]`

**4. Wind Vane Valley** — Set a persistent wind direction; seeds drift to reforest a shape. Naked toy is decent, but easily degrades into "guide the dot through the maze," a rejected trope. `[CUT]`

## Vector B — Asynchronous Delegation & Helpers

**5. Windup Sentries** — Wind up toy soldiers with a short repeating patrol loop, then step back while crows try to sneak past in real time to steal berries. Naked toy: a wind-up-toy defense diorama — inherently charming and legible without any code. `[KEEP]`

**6. Trained Fireflies** — Teach fireflies a one-line reactive rule ("glow when dark"), release them into a cave to light a path. Charming, but reduces to a single always-on reflex with little decision depth once released. `[ALT]`

**7. Puppet Foreman** — Configure a woodcutter robot's priority rule, then leave to do something else while it works, returning to find it chopped the wrong trees. Strong toy, but overlaps heavily with #5's "configure → step back → autonomous execution" architecture. `[ALT]`

**8. Loyal Golem Recipe** — Teach several golems a shared rule book; they race to build a wall simultaneously. Fun but is really #7 multiplied — redundant causal shape. `[CUT]`

## Vector C — Temporal & State Echoes

**9. Echo Chamber Bridge** — A recorded pass of yourself ("Echo") replays in lockstep with a fresh live pass; a gate needs both a past-self plate and a live-self plate pressed on the *same tick*. Naked toy: a two-timeline synchronization puzzle, intrinsically strange and fascinating even as a stopwatch game. `[KEEP]`

**10. Seed Memory Vine** — Today's watering pattern determines tomorrow's growth shape, revealed only the next day. Interesting but low interactivity per session — mostly a slow-motion diary. `[ALT]`

**11. Message Relay Cliffs** — Shout a message that echoes between canyon walls with delay, arriving at NPCs at staggered times. Cute, but risks collapsing into a plain rhythm-timing minigame rather than a world predicament. `[ALT]`

**12. Photograph Ghosts** — Past positions get stamped onto photo plates that reanimate as ghost actors. Mechanically identical to #9 (record → replay self across time). `[CUT]` (duplicate architecture)

## Vector D — Sensor-Actuator Networks

**13. Blind Cave Fish Network** — A cave-bear roams an unseen dark chamber; only indirect sensors report its presence. Wire sensor readings (with NOT/AND/OR) to a door actuator so it opens only when it is actually safe — the naive direct wiring is inverted from intuition and gets you hurt. Naked toy: a "clap-on lamp gone wrong" logic toy — legible and eerie without code. `[KEEP]`

**14. Weather Vane Farm** — Sensors read rain/sun/wind to drive irrigation/shade actuators. Good toy, but the "keep crops alive" loop is closer to a resource-meter worksheet once the novelty of unknown weather wears off. `[ALT]`

**15. Seismic Mole Tunnels** — Seismographs gate tunnel doors based on tremor patterns to avoid cave-ins. Strong, but mechanically a re-skin of #13 (indirect signal → gated actuator). `[ALT]`

**16. Pressure Plate Zoo Sorting** — Sort unknown-weight animals through gated plates. This is a disguised "sort by type" conveyor worksheet — a rejected trope. `[CUT]`

## Vector E — Emergent Ecological / Flux Systems

**17. Pond Algae Equilibrium** — Set a persistent feedback rule for a nutrient valve (thresholds, not one-shot actions) governing an algae/fish predator-prey loop across many simulated days; naive intuition ("more nutrients help fish") causes a bloom-and-death-spiral. Naked toy: a living ecosystem terrarium that blooms, clears, or collapses — fascinating on its own as a simulation toy. `[KEEP]`

**18. Ant Colony Flow Rates** — Balance foraging/return pheromone rules against colony starvation. Strong, but structurally the same predator/resource-balance shape as #17. `[ALT]`

**19. River Delta Silt** — Barriers reshape river flow and silt deposition over time. Beautiful toy, but decision space is closer to #1's spatial-law-mutation (single rule reshapes geometry) than to a true multi-agent flux balance. `[ALT]`

**20. Beehive Thermoregulation** — Bees fan vs. cluster based on a threshold rule to hold hive temperature stable across a day/night cycle. Great toy, essentially a single-variable twin of #17 without the two-population interaction depth. `[ALT]`

## Vector F — State Metamorphosis & Wiring

**21. Alchemy Vat Wiring** — Route ingredient flows through transformation vats (heat/cool/mix) to reach a target substance. Good toy, but risks reading as a generic "pipe routing" trope once ingredients feel like cargo. `[ALT]`

**22. Chameleon Choir** — Creatures change color/song based on neighbors' state (cellular-automaton style); player sets the propagation rule to make the whole choir converge on a pattern. Fascinating emergent-pattern toy on its own (like a living Lights Out / Conway's Life). `[ALT]` (kept as strong backup; ultimately narrower "decision" than #23).

**23. Circuit Golem Innards** — A malfunctioning guardian golem's chest panel opens to reveal its own internal sensor→gate→arm wiring (crossed wires make it block the wrong side and refuse to ever let its own ally, Pip, through). Player rewires the golem's *own body*, not an external mechanism. Naked toy: peering inside a broken toy robot to find the crossed wire — universally satisfying "aha," no code required. `[KEEP]`

**24. Metamorphosis Loom** — Insects pass through egg→larva→moth stages governed by an editable state-transition rule; wrong rule leaves creatures stuck. Interesting, but overlaps with #23's "edit an entity's internal rule" shape and is less visually legible in real time. `[ALT]`

---

## Pruning Summary

- Explicitly cut (fail Naked Toy Test or collapse into rejected tropes): **#4 (maze-in-disguise), #8 (redundant multiplier of #7), #12 (duplicate of #9), #16 (sort-conveyor worksheet)**.
- Marked `[ALT]`: strong ideas kept as a bench in case a `[KEEP]` fails prototyping, but not chosen for Stage 3 due to structural overlap with a stronger sibling in the same vector.
- Six `[KEEP]` premises — one per vector, chosen for maximum pairwise causal divergence — are locked into [DIRECTIONS.md](DIRECTIONS.md).
