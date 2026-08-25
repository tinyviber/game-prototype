# Demo 06 DESIGN.md — The Prism Burrow

1. **Premise**
   An ember-red beam enters from the left crystal. The gate on the right only drinks gold light. Three transformer flowers are available; each swaps a specific pair of colors (other colors pass through). Pip replants the flowers into three sockets to compose the correct color transformation.

2. **Naked Toy Appeal**
   Routing colored light through prisms to open a door is a tactile, visually legitimate toy puzzle even without any textual code.

3. **Character Causality**
   Pip physically carries and places the flowers. The flowers are passive; the beam is passive. Only Pip chooses the order that creates the transformation chain.

4. **Player Decision**
   Which permutation of the three flowers turns red into gold?

5. **Initial Failure State**
   Default order Ember → Mint → Sun produces red → blue → gold → red at the gate. The gate receives red and shakes. The player can trace each colored segment back to the flower that caused it.

6. **Natural Computational Need**
   The problem is function composition/order. The program is literally the order of operations, a fundamental computational primitive that emerges from the wiring.

7. **Programming Representation**
   A wiring/order representation: three drop-down sockets. No text code; the program *is* the spatial arrangement. This keeps the representation isomorphic to the causal chain.

8. **Dumb / Creative Solution**
   Player could brute-force all six permutations. Allowed; the six traces are fast enough that trying them is a legitimate experimental strategy, not a failure mode.

9. **Surviving Mechanic Gene**
   **Visible state transformation through ordered wiring.** The beam's color trail makes every intermediate computation observable, which is an excellent debugging scaffold.

10. **Known Weaknesses & Temporary Asset Notes**
    - Flower transformations are involutions (swaps); this makes the puzzle solvable by inspection after a few tries.
    - Beam animation is a single moving pulse, not continuous rendering.
    - Inline SVG crystals and flowers only.
