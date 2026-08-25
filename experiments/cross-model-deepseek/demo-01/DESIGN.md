# DESIGN.md — Demo 01 · The Gravity Amendment

Batch: `cross-model-deepseek` | Vector: **A — Environmental Law Mutation** | Model: deepseek

---

## 1. Premise
A sealed cavern whose exit is locked by a two-key gate. The heavy boulder is stranded on a high shelf; a pool of water sleeps at the far wall; the exit glimmers behind a barred gate. The only instrument the explorer holds is a **law-stone**: a device that amends the direction of *down* for the entire cavern.

## 2. Naked Toy Appeal
Flipping gravity in a cave full of water and boulders is a complete toy with zero programming interface: press a button, and water pours sideways, the boulder rolls across the ceiling level, everything re-settles. The failure states (boulder stuck on the wall, water flooding the floor) are physically funny before they are instructive.

## 3. Character Causality
The gate is a coincidence circuit with **two** keys: the boulder's plate (latched) and the character-plate in the alcove — the explorer's own body weight is the second key. The protagonist is structurally *part of the machine*: without the explorer standing in the alcove, the boulder's arrival does nothing. The character is also subject to the world (they must not be standing on the boulder's roll path when the law turns WEST). Not a courier: a circuit element.

## 4. Player Decision
*When* to amend the law, and *to what*. The player's core hypothesis: "if I make the world fall EAST, the boulder will roll off its shelf and the water will pour — then if I drop it DOWN, then send it WEST, it will roll across the plate." Timing the three edicts against the explorer's own climb is the skill.

## 5. Initial Failure State
The default program is the status quo itself: `t=0 → DOWN`. It is intuitive ("don't touch anything, it's fine") and it is *wrong*: the world runs, nothing moves, the boulder rests on its shelf, the gate stays shut. The world diary states it plainly, and the exit visibly glimmers unreached. The player's first debugging insight is *"gravity DOWN is the law that keeps the world stuck."*

## 6. Natural Computational Need
Sequence + state. Three law changes must be ordered so that the boulder's path (EAST off the shelf, DOWN to the floor, WEST across the plate) and the explorer's own route (climb before the flood, reach the alcove before the boulder's pass) are compatible. A single wrong order (e.g., WEST too early) visibly strands the boulder against a wall.

## 7. Programming Representation
A **timed law-list** of edict cards: `[time] [direction]`, later laws overriding earlier ones. Chosen because the world problem is *about a global constant over time* — no other representation expresses "the whole environment continuously evolves under this rule" as directly.

## 8. Dumb / Creative Solutions
- Brute-force: try edicts in random order until the boulder happens onto the plate (the latch makes this forgiving).
- **Boulder surfing**: the boulder counts as solid, so the explorer may stand on it and ride it across the cavern as the law drags it — a valid, silly alternative.
- Flood-timing abuse: open the law EAST late so the explorer can wade-free on the dry left side first.

## 9. Surviving Mechanic Gene
**One-constant global mutation**: the player edits a single world parameter, and the entire environment re-simulates under it. Any future level that sells "you changed the rules of the world" should keep this gene.

## 10. Known Weaknesses & Temporary Asset Notes
- Water has no "leveling" intelligence under horizontal gravity (it seeps up walls when blocked); acceptable for the toy, noted for the real game (use a proper falling-sand water sim).
- The character is immune to gravity (walks freely); the "walk on walls" fantasy is deferred — a future mutation of this gene, noted in DIRECTIONS.md.
- Plate-pressing is checked per tick at rest; the boulder rolls at 1 cell/tick so the latch is forgiving.
- All assets are hand-drawn inline SVG (walls, water, boulder, plates, gate, and the shared protagonist "Pip"). No external dependencies. Physics constants tuned for the 16×12 grid.
