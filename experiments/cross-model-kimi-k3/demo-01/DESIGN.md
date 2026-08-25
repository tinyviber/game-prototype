# Demo 01 DESIGN.md — Gravity Dial Hollow

1. **Premise**
   A hollow contains a buoyant pod and three thirsty moss bands at different heights. The moss only drinks when the pod hovers close to its band for a sustained duration. Pip does not push the pod; she rewrites the hollow's gravity schedule.

2. **Naked Toy Appeal**
   A floating pod that rockets, drifts, and bonks under a gravity dial is already an amusing physical toy. The player's first instinct is to "play with gravity," not to fill in syntax.

3. **Character Causality**
   Pip is the one creature small enough to fit into the hollow and turn the dial. The dial is the causal tool; the pod and moss are passive but legible respondents.

4. **Player Decision**
   What piecewise-constant gravity-versus-time curve produces three separate linger windows?

5. **Initial Failure State**
   Default program is `0-3: 4` then `3-20: 16`. The pod shoots up, hits the ceiling, then slams to the floor and stays there. Moss bars remain empty. The failure is visible as physical motion, not an error message.

6. **Natural Computational Need**
   The problem is not a sequence of actions but a function of time. The player must think in terms of intervals and durations, which maps naturally to a tiny law-language: `start-end: gravity_value`.

7. **Programming Representation**
   A line-based micro-DSL of gravity intervals. No blocks or code editor — just a schedule of laws. This keeps the representation identical to the player's mental model: "from time X to Y, pull down this hard."

8. **Dumb / Creative Solution**
   Player could brute-force dozens of tiny sawtooth intervals until the pod jiggles enough. Allowed. A clean solution uses buoyancy-symmetric gravity to make the pod oscillate through the bands.

9. **Surviving Mechanic Gene**
   **Tunable physical law as the program.** Letting a visible simulation carry out a function the player wrote, with failure visible as physics, is reusable across many world systems.

10. **Known Weaknesses & Temporary Asset Notes**
    - Numerical tuning is approximate; may need stiffer bands/lower speeds.
    - Pod collision is a simple clamp with restitution.
    - All art is inline SVG; no external assets.
