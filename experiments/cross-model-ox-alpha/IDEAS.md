# IDEAS.md — Stage 1: 24-Premise Divergent Matrix
Batch: `cross-model-ox-alpha` · Blind exploration · 2026-08-25

Ground rules used while generating (from the product truth files):

- **Naked Toy Test**: "If all code/programming UI were stripped away, is this still an intrinsically fascinating toy or world predicament?"
- No worksheets, no math quizzes in costume, no pure maze navigation, no cargo/delivery pipelines, no decorative protagonist.
- The protagonist (Tilo) must be causally necessary — a mediator of world systems, not an errand runner.

Each premise is tagged with its systemic archetype vector (A–F).

---

## Vector A — Environmental Law Mutation

### 1. The Leaning Grove
A chasm divides a dead grove from the last Mother Bloom. Vine shoots grow one step per breath, always toward whichever sun-orb glows brightest. Tilo cannot touch the vine — she can only re-tune each orb's brightness over time. The grove itself becomes the executing program.
**Toy test**: watching a living rope snake across a canyon toward shifting light is mesmerizing even with zero UI. PASS.

### 2. The Upside Gallery
Boulders sit in a hall where gravity anchors can be pinned to floor tiles: "in this zone, down means toward the anchor." Tilo pins anchors; boulders rain sideways/upward into wall sockets that hold a collapsing ceiling.
**Toy test**: strong physics toy. PASS — held as reserve (overlaps #1's "rewrite local law" lever).

### 3. Weather Choir
Frogs croak only while rain falls; crystal bridge resonates only to their chorus. Tilo schedules cloud-seeding pots. Ecosystem reacts to weather rules.
**Toy test**: pleasant but the causal chain (rain→croak→resonance) is two steps too indirect for a kid to debug visually. FAIL (opaque causality) → PRUNED.

## Vector B — Asynchronous Delegation & Helpers

### 4. Norbert's Night Round
Norbert the gentle sleepwalker walks his old dream-route every night: straight down Main Street, then pull the harbor lever before dawn. But a landslide ate Main Street, geese nest by the lane, and a cat now sleeps on the lever. Tilo edits his Dream Strip once, then dawn comes and he executes it alone — no mid-run corrections possible.
**Toy test**: watching a big soft giant sleepwalk your instructions into trouble is instantly funny and tense. PASS.

### 5. The Golem Apprentice
Program a clay golem's patrol policy (if door open, close it; if lantern dim, refill). It works the whole shift unsupervised.
**Toy test**: solid, but structurally a sibling of #4 (one autonomous agent executing a policy). FAIL (duplicate family) → PRUNED.

### 6. Termite Blueprint
Write pheromone rules ("drop scent when carrying, follow scent when empty") and watch termite mounds self-assemble into a bridge.
**Toy test**: gorgeous emergent toy, but emergence is too slow/noisy for legible per-run debugging at prototype budget. DEFERRED (implementation risk) → PRUNED for this batch.

## Vector C — Temporal & State Echoes

### 7. The Convergence Bells
Five mountain bells ring out; each toll travels as a visible wavefront toward the shrine. The shrine only wakes when all five tones land on the SAME instant — a chord. One bell sits behind slow mist. Tilo schedules each bell's strike tick on a timeline.
**Toy test**: expanding interference rings converging into a golden chord is beautiful; scheduling against invisible delays is a real predicament. PASS.

### 8. Footprint Yesterday
Tilo walks the level once leaving glowing footprints; time rewinds and the footprints replay as solid light-bridges her second pass can walk on.
**Toy test**: strong. PASS mechanically — but record/replay duality is a well-trodden trope (time-echo games), and implementation risk (two-layer physics) is high at disposable budget. PRUNED in favor of #7 for orthogonality + feasibility; gene noted below.

### 9. Drip Clocks
Water drops fall through channels of different lengths; arrange channels so drops land in basins in an exact order/rhythm.
**Toy test**: nice, but it is the same "compose along the time axis" lever as #7 with less spectacle. FAIL (duplicate family) → PRUNED.

## Vector D — Sensor–Actuator Networks

### 10. The Fog Chimes
A moonmoth flies from hive to Moonflower along a path hidden inside fog. If it stays dark too long it falls asleep mid-air. Tilo plants chime-flowers (sensors) wired to lamps (actuators): a chime's ping lights its lamp for a few seconds. Failed runs leave breadcrumbs only where light actually touched — the network itself becomes the map of the unknown.
**Toy test**: exploring darkness through pings and partial light is inherently suspenseful. PASS.

### 11. Bat Sonar Lifts
Echolocation pings reveal falling stalactites; auto-deployed nets catch them.
**Toy test**: functional but emotionally flat (protecting rocks). FAIL (low stakes) → PRUNED.

### 12. Thermal Cradle
Infrared blooms reveal which burrows hold sleeping animals; route warm air via sensor-triggered vents.
**Toy test**: decent, but routing warmth reads as cargo-with-extra-steps. FAIL (delivery pipeline residue) → PRUNED.

## Vector E — Emergent Ecological / Flux Systems

### 13. The Mill Weir
Rain bursts, then droughts. The millwheel must grind until dusk, the beaver burrow must never flood, the basin must not spill. Tilo writes threshold rules for the main sluice gate — the pond answers continuously.
**Toy test**: a living cross-section of water, wheel, and weather you must keep in balance is a classic sandbox pleasure; hysteresis emerges naturally. PASS.

### 14. Firefly Pond Balance
Set harvest quotas so glow-flies breed but frogs don't starve; keep the night lit.
**Toy test**: rich, but predator–prey oscillations are hard to make legible/fair in a single-file prototype. DEFERRED → PRUNED for this batch.

### 15. Cloud Farmers
Plant trees to comb moisture from clouds into cisterns; balance evaporation vs catchment.
**Toy test**: pretty, but the player decision space is vague (where's the failing hypothesis?). FAIL (weak decision) → PRUNED.

## Vector F — State Metamorphosis & Wiring

### 16. The Spore Telegraph
A chant-totem spits colored spore-pulses in a fixed rhythm; the Great Door only opens for its password colors, in order. Between them: mushrooms whose caps can be grafted into relay / prism (color-swap) / snail (delay), wired freely by tendril threads. Wrong color = door slams.
**Toy test**: pulses visibly racing through a hand-wired fungal switchboard is a toy on its own; the door gives crisp pass/fail. PASS.

### 17. Molt Smithy
Feed crabs different mosses so their molted shells become helmets, buckets, or door-props needed downstream.
**Toy test**: charming, but the mapping table is fiddly and reads like item crafting. FAIL (configuration sprawl) → PRUNED.

### 18. Chameleon Bridge
Lizards solidify or vanish depending on neighbors' colors; write adjacency rules to form a crossing.
**Toy test**: neat cellular automaton, but quickly feels like a logic worksheet on a grid. FAIL (worksheet drift) → PRUNED.

### 19. Magnet Ballet
Rewire polarity paddles so iron seeds waltz into grooves.
**Toy test**: thin — one gimmick, shallow decisions. FAIL (shallow) → PRUNED.

### 20. Prism Corridor
Route a laser through mirrors to hit crystals. FAIL (genre cliché; beam-routing is saturated) → PRUNED.

## Deliberate Anti-Ideas (generated to exercise the pruning filter)

### 21. Counting Frogs
Count lily pads, type the answer. **Worksheet with eyes. REJECTED.**

### 22. Robot Maze Race
Arrow-key the robot to the exit; now do it blindfolded with code. **Pure grid navigation trope. REJECTED.**

### 23. Cargo Sorter 3000
Conveyer belts sort crates by weight into trucks. **Delivery pipeline; protagonist decorative. REJECTED.**

### 24. Snail Racing Odds
Estimate which snail wins, bet acorns. **Guess-the-number quiz. REJECTED.**

---

# Structural Pruning Log

| Filter | Casualties | Reason |
|---|---|---|
| Worksheet / quiz skin | #21, #24 | No intrinsic world predicament |
| Maze-navigation trope | #22 | Player decision degenerates to path memorization |
| Delivery/courier pipeline | #12, #23 | Protagonist = errand runner; violates axiom 2 |
| Duplicate causal family | #3, #5, #9, #19, #20 | Same player-lever as a stronger sibling |
| Legibility risk at prototype budget | #6, #14 | Emergence too noisy to debug per-run |
| Trope saturation / implementation risk | #8, #18, #17 | Known patterns or fiddly mappings |
| Weak decision space | #11, #15 | Failure doesn't generate a repairable hypothesis |

**Survivors: #1, #4, #7, #10, #13, #16** — exactly one per vector A–F. Locked in DIRECTIONS.md.
