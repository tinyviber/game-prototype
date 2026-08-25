# DESIGN.md — Demo 05 · The Dam That Breathes

Batch: `cross-model-deepseek` | Vector: **E — Emergent Ecological / Flux** | Model: deepseek

---

## 1. Premise
A mountain river pulses forever into a reservoir behind a dam. The exit gate opens only when the waterwheel spins inside a narrow RPM band for 8 consecutive ticks; a ford downstream is crossable only while the river runs low. The explorer writes reactive sluice rules (`WHEN level < X → sluice Y%`) and watches the whole valley breathe — or drown.

## 2. Naked Toy Appeal
A dam that visibly strains and bursts is a toy with no code at all: watch the gauge climb, feel the pressure, see the spillway trickle, then BOOM — the valley floods in a red flash. Before any rule-writing exists, "how much water do I dare release?" is a complete physical question.

## 3. Character Causality
The explorer is the dam-keeper: only the explorer can set the sluice rules, must *wade the ford* during a low-water window (timing agency!), and must physically stand at the mill gate when it opens. The protagonist's own crossing is part of the control problem — the ford's breathing schedule and the wheel's stable band must be reconciled in real time.

## 4. Player Decision
*Which reactive rules* to write. Core hypothesis: "if I open the sluice wide, the reservoir settles near level 50, the wheel hums in the band, and the ford appears whenever the river dips." The player tunes a continuous equilibrium — the decision is a setpoint + hysteresis, not a path.

## 5. Initial Failure State
The default rule is plausible-and-wrong: `WHEN level < 50 → sluice 30%` — "be stingy with water when it's low." The world exposes it brutally: the river keeps coming, the level climbs past 50, 60, 80… the sluice barely trickles — and at 100 the dam **BURSTS**. World Diary: *"The dam BURSTS — the valley floods!"* First insight: the river is not a bucket; it is a flow that must be matched.

## 6. Natural Computational Need
Reactive control over a continuous quantity. A single fixed opening is never right forever (the inflow pulses); the player must write *threshold rules* whose hysteresis keeps a differential system inside a band. This is control programming — the natural lever for a flux problem.

## 7. Programming Representation
A **reactive rule list** (`WHEN level < X → sluice Y%`, first-match wins, keep-last otherwise). Chosen because the world problem is literally about conditioning actions on a continuously varying state — no tape or queue fits a breathing system.

## 8. Dumb / Creative Solutions
- Rule-spam: many overlapping thresholds that jitter the sluice — the wheel limps into the band eventually.
- Open 100% from the start and *ride the initial low level* to cross the ford immediately, then wait for the wheel streak — a valid, slightly risky speedrun.
- Drain-the-valley vandalism: open everything and watch the burst for fun — the engine permits deliberate failure.
- A two-phase rule set (drain hard first, then settle) — a more elegant solution the engine allows.

## 9. Surviving Mechanic Gene
**Equilibrium tuning with dramatic failure**: a continuous system whose sweet spot is discovered by watching it overshoot (burst) and undershoot (stall). Any "balance the flow" level should keep this gene.

## 10. Known Weaknesses & Temporary Asset Notes
- The initial level (48) sits *below* equilibrium, so the first crossing window is brief and counter-intuitive; a gentler onboarding would start with the level already oscillating.
- The explorer's only constraints are the ford and the gate; the character is more observer than in earlier demos — the crossing timing is the compensating agency.
- The wheel's band and pulse constants were tuned numerically (verified by the harness: flawed program bursts, solution wins, ford windows exist in the trace).
- Assets are inline SVG (reservoir, dam, sluice, flume, wheel, ford stones, gate house, Pip). No external dependencies.
