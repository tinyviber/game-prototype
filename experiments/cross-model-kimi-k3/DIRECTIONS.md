# DIRECTIONS.md — Stage 2: The 6 Locked Orthogonal Directions

Selection criterion: **maximum pairwise causal divergence**. Each demo must make
the player test a fundamentally different hypothesis and rely on a different
causal architecture. Locked *before* any implementation.

Protagonist (all demos): **Pip** — small teal explorer, huge eyes, glowing
antenna bulb, orange feet. Inline SVG, identical markup in every file.

---

## Demo 01 — Gravity Dial Hollow  *(Vector A: Environmental Law Mutation)*

- **World constraint**: The float-pod moves only under `net = gravity(t) −
  buoyancy(10)`. Moss drinks only while the pod lingers inside its band
  (~1.6s of sustained presence each).
- **Player decision**: What *schedule* of gravity values over time produces
  three hovering visits?
- **Causal model**: `law(t) → continuous dynamics → position trajectory →
  dwell-time per band → bloom`. The program is a *physical constant rewritten
  over time*, not a sequence of moves.
- **Computational skeleton**: piecewise-constant function of time; implicit
  integration; threshold dwell = state accumulation.
- **Initial failure**: `0-3: 4 / 3-20: 16` — pod rockets up, bonks the ceiling,
  then slams to the ground and sleeps. Moss ~0% wet. The failure is *visible
  physics*, not an error message.

## Demo 02 — Firefly Lamplighter  *(Vector B: Asynchronous Delegation)*

- **World constraint**: Mushrooms charge only while the firefly glows within
  radius 60, for 2s cumulative each. The firefly loops your patrol forever,
  unattended.
- **Player decision**: Which repeating patrol (waypoints + glow pauses) covers
  all five mushrooms?
- **Causal model**: `script → autonomous agent → spatial coverage over time →
  charge accumulation`. You delegate and step back; the agent never improvises.
- **Computational skeleton**: implicit loop; command queue; spatial proximity
  as condition.
- **Initial failure**: `go 400 40 / glow 1 / wait 1` — the firefly dutifully
  dances its loop in an empty corner. The garden stays dark. Literal obedience
  is the lesson.

## Demo 03 — Echo Twin Waltz  *(Vector C: Temporal & State Echoes)*

- **World constraint**: The door opens only while plate A *and* plate B are held
  simultaneously for 1.0s. The golden echo replays your exact timeline, offset
  by D seconds.
- **Player decision**: Design ONE timeline that, played against its own delayed
  copy, produces simultaneous pressure — and pick the offset D.
- **Causal model**: `timeline(t) ⊗ timeline(t−D) → overlap window → door`.
  Causality folds back on itself; the second actor is your own past.
- **Computational skeleton**: recorded state replay; phase offset; concurrency
  from a single-threaded script.
- **Initial failure**: walk to plate A and wait, with D=0 — the echo stands
  *inside* Pip. One plate glows, one stays cold. Spooky and legible.

## Demo 04 — Mole Sensor Greenhouse  *(Vector D: Sensor-Actuator Networks)*

- **World constraint**: 4 beds have hidden moisture and hidden drain rates.
  Only 2 sensor moles exist; only sensed beds reveal numbers. Watering while a
  condition holds = closed loop; `at T -> water pX for D` = open-loop timing.
  Mold above 88%, wilt below 15% (sustained).
- **Player decision**: Which beds get the scarce sensors, and which rules couple
  sensed readings to valves (including *different* beds)?
- **Causal model**: `sensors → rules → valves → moisture trajectories →
  plant health`. Randomized each run — the program must be a *policy*, not a
  memorized sequence.
- **Computational skeleton**: conditionals on runtime-unknown state; hysteresis;
  scheduled vs. reactive actuation.
- **Initial failure**: both rules keyed to sensor 1 water pots 1–2 only; pots
  3–4 visibly crisp while 1–2 smugly thrive.

## Demo 05 — The Ladybug Ledger  *(Vector E: Emergent Ecological Flux)*

- **World constraint**: Aphids grow logistically; each ladybug eats ≤7/day;
  ladybugs starve when aphids < 4 per bug; roses take damage ∝ aphids and
  regenerate when aphids are low. A winged aphid cloud (+70) lands on day 10.
  Lantern budget: 16 ladybugs total.
- **Player decision**: What release *calendar* keeps the system in balance
  through day 24?
- **Causal model**: `release policy → predator/prey stocks → boom-bust or
  equilibrium → rose health`. You never touch a bug; you tune a flow.
- **Computational skeleton**: state variables evolving in parallel; event
  scheduling; feedback stability (overshoot → collapse).
- **Initial failure**: `day 0: release 16` — glorious aphid crash, then mass
  ladybug starvation, then the day-10 cloud feasts unopposed and the rose
  collapses in the final days. A visible boom-bust tragedy.

## Demo 06 — The Prism Burrow  *(Vector F: State Metamorphosis & Wiring)*

- **World constraint**: Beam enters red; gate accepts only gold. Three flowers
  rewrite color: Ember red↔blue, Mint blue↔gold, Sun red↔gold (other colors
  pass through). Socket order is the only control.
- **Player decision**: Which permutation composes the three transforms so red
  becomes gold?
- **Causal model**: `order → function composition → color trajectory → gate
  verdict`. The beam's color trail makes every intermediate state observable.
- **Computational skeleton**: state machine; function composition; wiring as
  program.
- **Initial failure**: default order Ember→Mint→Sun yields red→blue→gold→**red**
  at the gate — it *almost* works, which is exactly the right failure to debug.

---

## Pairwise Divergence Check

| | 01 | 02 | 03 | 04 | 05 | 06 |
|--|----|----|----|----|----|----|
|01 law mutation | — | law vs agent | single vs replayed actor | open physics vs sensed beds | deterministic vs stochastic stocks | continuous vs discrete state |
|02 delegation | | — | helper vs self-echo | full info vs hidden info | direct coverage vs indirect stocks | agent loop vs static wiring |
|03 temporal echo | | | — | perfect replay vs noisy sensing | two actors vs populations | timeline vs composition |
|04 sensor net | | | | — | binary health vs graded ecology | reactive rules vs fixed order |
|05 ecology | | | | | — | stocks/flows vs transforms |
|06 wiring | | | | | | — |

No two demos share a primary decision type. **LOCKED.**
