# Demo 04 DESIGN.md — Mole Sensor Greenhouse

1. **Premise**
   Four soil beds have hidden moisture and drain rates that re-randomize each run. Pip owns two honest sensor moles that can be posted to any two beds. The rest of the beds must be watered through rules linked to the sensors or timed pulses.

2. **Naked Toy Appeal**
   Running a greenhouse where most pots keep secrets but two diligent moles report numbers is already a compelling caregiving puzzle.

3. **Character Causality**
   Pip places the moles and writes the watering policy. The moles and valves have no initiative; they need Pip's wiring. Without Pip there is no policy and no one to interpret the sensors.

4. **Player Decision**
   Which two beds get the scarce sensors, and what conditional/timed rules connect sensed readings to valves (including possibly different beds)?

5. **Initial Failure State**
   Default program wires both rules to sensor 1 and waters only pots 1 and 2. Pots 3 and 4 visibly crisp while pots 1 and 2 smugly thrive. The failure exposes that more of the system needs to be covered.

6. **Natural Computational Need**
   Conditionals (`if sensor < threshold -> water pot`) and scheduled pulses (`at T -> water pot for D`) arise naturally because the player cannot observe everything at once.

7. **Programming Representation**
   A rule micro-language with two constructs: reactive conditionals and timed pulses. This is the minimal language for building closed-loop vs open-loop control.

8. **Dumb / Creative Solution**
   Player could ignore sensors entirely and schedule aggressive watering pulses for all pots. Allowed; may overwater some and is a valid data point.

9. **Surviving Mechanic Gene**
   **Scarce sensing plus policy wiring.** The idea that programs can react to runtime-hidden state because a few honest observers are placed intelligently is reusable.

10. **Known Weaknesses & Temporary Asset Notes**
    - Randomization is uniform; difficulty may vary.
    - Two rules may be too few for full coverage; intended to invite combining rules.
    - Inline SVG moles and pots only.
