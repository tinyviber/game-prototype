# Premise

A courier must carry one sealed parcel through a flooded archive and deliver it to the red-marked room. The usable passages form a small, visible map, but iron shutters react to the archive’s repeating three-tide cycle.

# Player Decision

At each room, choose a direction, choose between the upper and lower branch, or wait in place for a better tide. The player is deciding whether to spend a move repositioning or spend one to let a useful shutter open.

# Constraint

Every successful move or wait advances the tide. A tide shutter only opens under its matching tide; trying a closed shutter does not advance the run. The courier cannot leave through unmarked flooded shelves.

# Feedback Loop

The map redraws the courier, passage state, current tide, move count, and shutter ledger after each action. A blocked choice names the shutter’s current evidence and the tide that opens it. Delivery ends the run; Retry run restores the initial state.

# Natural Computational Need

The player naturally tracks a small changing state: current room, current tide, and which branch will put the next shutter on its opening beat. The code is only the hidden state machine that keeps the tide and map honest.

# Possible Underlying Patterns

Finite-state machine, modular counter, graph traversal, adjacency lookup, and a small rule table mapping shutters to tide phases.

# Dumb Solution

Press directions until blocked, then press Wait until the desired color appears. Because failed shutter attempts cost nothing, brute-force timing can complete the map without understanding the whole route.

# Intended Aha

The tide is not random: it cycles BLUE, GOLD, VIOLET, and movement itself changes the next opening. Once the player reads the ledger and counts the beat after each crossing, the two branches become short, predictable schedules rather than a maze.

# Known Weaknesses

The ledger exposes every shutter’s timing immediately, so discovery is shallow. Waiting is safer than committing to a route, and the map is small enough that trial-and-error is forgiving. A stronger version could reveal shutter rules only after inspection or add a limited parcel-protection resource.
