# DESIGN.md — Demo 02 · March the Oaf

Batch: `cross-model-deepseek` | Vector: **B — Asynchronous Delegation** | Model: deepseek

---

## 1. Premise
A blind, enormous stone golem must cross a one-cell lane: a stone blocks the way, a pit waits to swallow the careless, a second stone must be smashed, a plate must be stepped on, a gate must grind open, and a key at the far end must be seized. The golem cannot see any of it — it can only march. Pip (the explorer) queues its commands, winds its key, and steps back to watch.

## 2. Naked Toy Appeal
A giant idiot who follows instructions *literally* is inherently tense and funny: will it walk into the pit? The lane is a physical machine you arm and release. The "thunk" of a golem meeting a stone it can't see is comedy with zero programming UI.

## 3. Character Causality
Only Pip can wind the crank — the golem has no will and cannot start itself. The entire causal chain (which stones get pushed, which get smashed, whether the plate clicks) is Pip's decision, encoded *before* the run. Pip is structurally necessary as the delegator: the golem is Pip's delegated strength, and Pip cannot enter the lane to help (the lane is golem-only territory). The payoff reverses the courier trope: the *golem* carries the key *to Pip*.

## 4. Player Decision
*Which command queue* to delegate. Core hypothesis: "if I push the first stone into the pit, the pit becomes a bridge; if I smash the second stone when adjacent; if I walk the rest — the Oaf will step on the plate and the gate will open." The player tests ordering and tool choice, not motion.

## 5. Initial Failure State
The default program is the naive `WALK 10` — "obviously" the golem should just march. The world visibly exposes the flaw: the golem marches three cells, bonks into the first stone, and stops dumbly while the gate stays shut. World Diary: *"Thunk! The Oaf walks into something at cell 3 and stops."* The player immediately learns: the golem has no eyes — *I* must give it tools.

## 6. Natural Computational Need
Sequence + decomposition. Order matters: push the stone into the pit *before* walking (or the pit eats the golem); smash only when *adjacent*. The blind-agent constraint makes sequencing load-bearing — this is delegation as computation.

## 7. Programming Representation
A **command queue** of cards (`WALK k`, `PUSH`, `SMASH`, `WAIT k`). Chosen because the world problem is literally about handing an autonomous executor a finite instruction tape and being unable to intervene. The queue IS the causality.

## 8. Dumb / Creative Solutions
- Brute-force queues until the golem happens across the plate (forgiving latch).
- `SMASH` everything then `WALK 10` — a *plausible* dumb plan that fails visibly at the unfilled pit, teaching "smashing ≠ bridging".
- Multiple valid orderings of PUSH-vs-SMASH; the pit-bridge is never mandatory to *attempt*, only to *survive*.
- `WAIT` padding to stall the golem for no reason — allowed, pointless, funny.

## 9. Surviving Mechanic Gene
**Blind literal executor**: an autonomous agent that cannot perceive its environment, so the player must encode perception-free solutions. This is the purest delegation gene — any "program a helper" level should keep it.

## 10. Known Weaknesses & Temporary Asset Notes
- The 1D lane is deliberately minimal; it proves the delegation loop but not spatial autonomy (noted as a future extension: the golem on a 2D map with turn commands).
- `SMASH` is adjacent-only, which forces a bit of choreography; the smashing of "any stone ahead" was considered and rejected as too trivial.
- The pit is a single fail-state; no rescue mechanic (reset is the rescue).
- All assets are inline SVG (lane, stones, pit, plate, gate, key, golem, and Pip on the cliff). The wind-up animation is minimal (crank path morph). No external dependencies.
