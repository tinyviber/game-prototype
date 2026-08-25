## Premise

The player is crossing a bridge landscape whose tiles shift state after every move. Reach the beacon before the water takes the route.

## Player Decision

Choose one neighboring tile to step onto, reading the current state of the four possible landings.

## Constraint

Only a DRY tile is a safe landing. TILTING collapses on the pulse; SUNK tiles cannot be used.

## Feedback Loop

Each move advances the whole grid through DRY, TILTING, and SUNK. The board visibly changes, and a failed landing names the state that caused the fall. Retry restores the same puzzle.

## Natural Computational Need

The world is a mutable grid: track position, apply one phase transition to every cell, then filter valid neighboring moves. The player only experiences the resulting route-reading problem.

## Possible Underlying Patterns

Grid state, modular phase updates, local-neighbor search, finite-state transitions, and a short greedy route.

## Dumb Solution

Try a direction, note the tile state and pulse count, then retry while copying a safe sequence into a tiny mental or paper map.

## Intended Aha

The bridge is not random. Every tile advances one phase together, so a tile that looks wrong now may be the useful landing later; the crossing is about timing the phase, not just moving toward the beacon.

## Known Weaknesses

The fixed phase layout is small and can be brute-forced quickly. The prototype does not explain the hidden route skeleton, and reaching the beacon is stricter than ordinary movement because it must be DRY on entry.
