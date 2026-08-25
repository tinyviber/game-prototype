# DESIGN.md — Demo 04 · The Whispering Grotto

Batch: `cross-model-deepseek` | Vector: **D — Sensor-Actuator Networks** | Model: deepseek

---

## 1. Premise
A moonlit cave where three **invisible** motes drift. The exit gate latches open only when two motes settle in a basin. The explorer can deploy listening stones (sensors), lure bells (attractors) and hum pipes (repellers), and wire them with IF-HOT-THEN rules. Mote positions are *runtime-unknown*: the sensors are the only eyes in the dark.

## 2. Naked Toy Appeal
Herding invisible animals by sound is fascinating before any programming exists: a stone that suddenly sings "HOT" tells you *something is right there*, and the question "what scares it vs. what lures it?" is a pure world-mystery. The basin slowly filling is a visible payoff.

## 3. Character Causality
Only the explorer can crawl into the dark and install the apparatus — the stones and pipes are placed by the explorer's own hands. The explorer reads the readouts (the only eyes), and must physically walk to the gate once it opens. The protagonist is the network's builder and its final traveler.

## 4. Player Decision
*Where to deploy* sensors and actuators, and *how to wire* them. Core hypothesis: "if I park a bell in the alcove and watch the funnel with a stone, the motes will be lured through the basin." The player tests perception (sensor placement) and response (rule wiring) as one design problem.

## 5. Initial Failure State
The default rig is plausible-and-wrong: the bell sits in a far corner, a pipe hums at the funnel mouth, and the one rule is `IF S1 HOT → PIPE ON`. The world exposes the flaw beautifully: the sensor *flickers HOT* (something IS there!) but the pipe scares everything back — the gate never opens. World Diary: *"Your stone flickers HOT — something is in the dark with you. But the pipe hums, and the gate stays shut."* First insight: it's alive, and I'm scaring it.

## 6. Natural Computational Need
Conditionals over runtime-unknown input. You cannot hard-code a path because you cannot see the actors; the sensor reading → threshold → actuator response is the only possible control structure. The resonance (hysteresis) makes the reaction temporal — a genuine stateful rule, not a one-shot.

## 7. Programming Representation
**Spatial deployment + a rule list** (`IF sensor HOT → actuator ON`). Chosen because the world problem is literally about building a perception→reaction network in space; dropdown rules are the minimum notation for the wiring.

## 8. Dumb / Creative Solutions
- Pure brute force: scatter bells and let the whole cave hum — the drift bias eventually pushes a mote to the basin (slow, noisy, sometimes works).
- Sensor-spam: place 4 stones everywhere so any bell rule always fires — a "cheat" the engine permits.
- Repel-bombing: pipes pointed at the spawn can *drive* motes toward the basin instead of luring them — a valid creative solution the rules allow.

## 9. Surviving Mechanic Gene
**Perception-first reactive network**: actuators are dead unless driven by sensor rules — the player must design the eyes before the hands. Any "read the unknown, then react" level should keep this gene.

## 10. Known Weaknesses & Temporary Asset Notes
- Mote drift is seeded per session (🎲 new drift re-seeds) so retries are learnable; in a full game, drift should be deterministic per level for fairness.
- The funnel geometry guarantees parking in the basin only when the bell is in the alcove; motes approaching from odd angles can briefly stall in corners (random fallback moves keep them un-stuck).
- The cave is rendered as a moonlit checkerboard; motes are truly invisible, which can frustrate — a "ripple shimmer" hint for nearby-but-not-detected motes is a future polish.
- The basin doubles as a built-in sensor (SPOOL) to keep the herd self-sustaining — noted as a hand-hold that should be weakened in later levels.
- All assets inline SVG; no external dependencies.
