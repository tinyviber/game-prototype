# Demo 02 DESIGN.md — Firefly Lamplighter

1. **Premise**
   Five glow-mushrooms sleep in a dark garden. A firefly loops whatever patrol Pip hums to it. Mushrooms only charge while the firefly glows nearby. Pip's job is to choreograph an autonomous light loop.

2. **Naked Toy Appeal**
   Fireflies dancing in loops over sleeping mushrooms is already a charming toy; the question of "where should the light go next?" is intuitive before any UI appears.

3. **Character Causality**
   Pip cannot fly. Only the firefly can, and it understands only the patrol Pip hummed. Pip is the composer, not the courier.

4. **Player Decision**
   Which repeating waypoint-and-glow pattern guarantees cumulative coverage over every mushroom?

5. **Initial Failure State**
   Default program sends the firefly to the upper-right corner, glows once, and loops. The garden stays dark; mushrooms do not wake. The failure teaches literalism: the agent does exactly what you hummed, no more.

6. **Natural Computational Need**
   A repeating loop and spatial condition naturally arise: "keep glowing while near each mushroom until all are charged."

7. **Programming Representation**
   A command-queue micro-language: `go x y`, `glow sec`, `wait sec`. The queue implicitly loops forever. This mirrors the mental model of teaching a route rather than writing a script.

8. **Dumb / Creative Solution**
   Player could make a huge sweeping path that stays glowing everywhere and eventually covers all mushrooms by accident. Allowed; it reveals why targeted patrols are more efficient.

9. **Surviving Mechanic Gene**
   **Literal autonomous loop with full observability.** Programming here means precisely instructing an independent agent, then watching it carry out its duties exactly as written.

10. **Known Weaknesses & Temporary Asset Notes**
    - Charge thresholds are tuned for ~2s of proximity.
    - Mushrooms share a single radial charge zone.
    - Inline SVG only; firefly glow is a CSS radial-gradient overlay.
