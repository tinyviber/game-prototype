# Demo 05 DESIGN.md — The Ladybug Ledger

1. **Premise**
   A rose bush suffers from aphids. Pip has a lantern holding a budget of 16 ladybugs total. Aphids grow logistically, ladybugs eat up to 7 aphids/day but starve when prey is scarce, and a winged aphid cloud lands on day 10. Pip writes a release calendar.

2. **Naked Toy Appeal**
   Balancing predators and prey to save a plant is an ecological toy in its own right. The tension of "too few bugs / too many bugs" is immediately graspable.

3. **Character Causality**
   Pip decides when to open the lantern. The ladybugs, aphids, and rose each follow their own rules. Without Pip's calendar there is no intervention; with the wrong calendar the system collapses.

4. **Player Decision**
   How to spend a fixed budget of ladybugs across 24 days to avoid boom-bust cycles and survive the day-10 migration.

5. **Initial Failure State**
   Default program releases all 16 ladybugs on day 0. Aphids crash, ladybugs starve, then the day-10 cloud arrives unopposed and the rose dies in the final days. The failure is a visible ecological tragedy.

6. **Natural Computational Need**
   State variables, events, and delayed consequences make a calendar/policy natural. The player is reasoning about stocks and flows over time, which is computational thinking in disguise.

7. **Programming Representation**
   A sparse event calendar: `day D: release N`. This is the simplest representation of a timed policy and directly maps to the player's ledger mental model.

8. **Dumb / Creative Solution**
   Player could release 1 ladybug every day. Allowed; it will likely fail because the day-10 cloud overwhelms small populations, but it is informative.

9. **Surviving Mechanic Gene**
   **Intervention scheduling in an emergent stock-and-flow system.** The idea that a program is a policy over time, not a sequence of character actions, is highly transferable.

10. **Known Weaknesses & Temporary Asset Notes**
    - Ecology model is intentionally simple; exact equilibrium is not required, just survival thresholds.
    - Visual density of dots is capped to keep rendering cheap.
    - Inline SVG only.
