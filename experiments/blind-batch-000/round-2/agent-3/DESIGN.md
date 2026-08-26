# Premise

After a dry riverbed shifts, a hiker must choose a safe stepping-stone crossing while avoiding one loose stone.

# Player Decision

For each of five advances, the player chooses to stay in the current row, move up, or move down. The player is deciding which visible stone the hiker will land on, not guessing an answer label.

# Constraint

The hiker must advance one column at a time. Bare gaps end the crossing, and the single orange loose stone causes a slip. The route can move only one row per advance.

# Feedback Loop

The player observes the shifted bed, edits five route instructions, and presses Run. The boot moves across the actual rows; a gap or loose stone stops it with a step-specific explanation. A successful run reaches the far bank and leaves the spatial route legible.

# Natural Computational Need

The hiker needs a compact, repeatable route plan: one decision at each advance, remembered in order and executed without improvisation. Five editable instructions are enough to express that plan.

# Possible Underlying Patterns

An ordered sequence, a small state transition (current row plus one move), bounds checking, and early termination on an unsafe landing. These patterns arise from following a route through changing terrain rather than from a lesson plan.

# Dumb Solution

Try routes until one works, or choose a safe-looking stone at every column by eye and encode the corresponding row changes. No elegant algorithm is required.

# Intended Aha

The important information is not merely “right” or “wrong”: every instruction changes the hiker’s next spatial landing. A failed route reveals the exact unsafe stone, making repair a local prediction problem. The player notices that staying in the middle row is tempting but crosses the loose stone, so moving up for a one-row detour is necessary.

# Known Weaknesses

The board is fixed, so replay value is low. The five dropdowns are closer to route planning than general-purpose programming, and the animation does not show a persistent boot on each successful stone. The loose stone is visually explicit, which may make the first failure optional for observant players.
