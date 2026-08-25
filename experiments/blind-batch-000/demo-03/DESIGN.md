# Premise

The traveler crosses four rooms where symbol strips flicker on the walls. A final lock opens only for the two marks that persisted through the whole route.

# Player Decision

After each room goes dark, choose two marks to carry through the next door. At the final lock, choose the two persistent marks and place them in first-sighting order.

# Constraint

Each five-mark strip is visible for 2.8 seconds. The player must hold enough information to make a choice, but can retry the same corridor after a failed lock attempt.

# Feedback Loop

The corridor rail and slate show progress. A failed lock exposes a per-room presence trace for each chosen mark, showing where a memory vanished. A correct lock changes to an open-door message.

# Natural Computational Need

The useful mental operation is to keep an evolving candidate set: compare the current room with what has survived so far, then preserve only the overlap. The final order is the first room’s order, not the order of the last guess.

# Possible Underlying Patterns

Intersection, filtering, an accumulator, membership checks, and a stable sort by first occurrence.

# Dumb Solution

Try to memorize every strip, write down all eight marks, then manually cross off anything that disappears in each successive room.

# Intended Aha

Do not preserve the whole corridor. Preserve only marks still possible after each room; the answer is the tiny intersection that remains.

# Known Weaknesses

The palette is always visible after each flash, so the main difficulty is memory rather than a richer spatial or temporal puzzle. The fixed answer and deterministic rooms make repeated play useful for debugging but reduce replay variety.
