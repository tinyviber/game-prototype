# DESIGN.md — Demo 06 · Mimic Moss

Batch: `cross-model-deepseek` | Vector: **F — State Metamorphosis & Wiring** | Model: deepseek

---

## 1. Premise
A garden where light travels only through moss — one cell per tick. Plain moss passes its color unchanged; **dye moss turns red light blue**. A key flower at the tunnel opens only when it receives **red first, then blue**. A poison fern blooms and spores if any light touches it, and the garden sprouts new moss by itself. The explorer must grow a circuit whose *two branch lengths* encode a delay, keep the light off the fern, and trim the garden's own growth.

## 2. Naked Toy Appeal
Growing glowing wires in a garden is a toy before any programming exists: plant a seed, watch light flood through it; drop a dye and watch the color change mid-wire. The plant that fights back (sprouting) makes the garden feel alive.

## 3. Character Causality
The explorer is the **gardener**: only the explorer's hands plant seeds and prune, and the explorer must physically walk into the tunnel once the flower blooms. The light does the traveling — the character mediates state transformations (planting dye = installing a state-transformer) without carrying anything. The protagonist is the network's only builder.

## 4. Player Decision
*What topology to grow.* Core hypothesis: "if the red branch is shorter than the blue branch (via one dye), red arrives at the flower first, blue second — and it blooms." The player also decides where the wire may *not* go (near the fern) and what to prune.

## 5. Initial Failure State
The garden starts with a **moss stub that dies at a gap** — the light stops four cells from the prism; the flower is dormant. World Diary: *"The moss stub you planted years ago dies at a gap."* The player's first act — planting one moss — floods the stub and (if they route naively) lights the fern: the world visibly spore-billows and clamps the flower shut. Three escalating lessons: connect the gap → don't touch the fern → the flower needs *two colors in order*.

## 6. Natural Computational Need
Combinational logic + timing: the flower's red-then-blue requirement is a state-dependent open-condition; the *path length* is the only available delay primitive; the fern is a forbidden "short circuit." Ordering of arrival is decided topologically — the player must think in propagation delays, exactly like designing a logic circuit.

## 7. Programming Representation
**Direct spatial wiring** — click to plant plain moss / dye moss / prune; the light-propagation rule set is the interpreter. Chosen because the world problem *is* a layout problem: state is transformed in place, nothing is sequenced by a tape.

## 8. Dumb / Creative Solutions
- Spam moss everywhere and let the flood find the flower — the garden becomes a light-polluted mess that *usually* blooms (but often lights the fern first).
- Skip the dye entirely: if a sprout or a shortcut delivers blue... impossible without a dye — a dead end that teaches the color rule.
- Place the dye right next to the flower on a short branch: the flower sees blue first → clamped shut — a visible negative example of ordering.
- Prune aggressively to build a single serpentine wire — a valid, tidy, "clean-code" aesthetic solution.

## 9. Surviving Mechanic Gene
**State-transforming conductors**: a network where entities change state in place and the *length of the path is a computational parameter*. Any "logic-gates without carrying" level should keep this gene.

## 10. Known Weaknesses & Temporary Asset Notes
- The intended solution needs ~25 plants — click-heavy; a drag-paint tool or auto-lay is a future convenience.
- Sprouting is genuinely chaotic; mitigated by the fern's sterile ring (no random sprout can light the fern) and by bloom-latching (post-bloom sprouts are harmless). Still, the player may need to prune mid-run.
- Light propagation is a synchronous BFS recomputed each tick (max 40 hops) — O(cells·hops) per tick, fine at this scale; a real game would use event-driven propagation.
- Color ordering within a single tick is resolved by "closest source wins, red on tie" — deterministic but a subtle rule worth documenting in a full implementation.
- Assets are inline SVG (prism, moss, dye, fern, flower, fence, Pip). No external dependencies.
