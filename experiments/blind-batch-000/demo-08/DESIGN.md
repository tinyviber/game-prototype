# Premise

The night-shift factory has three raw blanks and one chance to configure a hands-off line that turns each blank into a finished signal beacon.

# Player Decision

The player arranges five stations in a single order by swapping two slots at a time, then commits to a batch run.

# Constraint

Every station runs exactly once per piece. A station can only run when the piece carries its prerequisite tag: RAW becomes SHELL, then HOLE, WET, DRY, and finally FINISHED. The line stops at the first missing handoff.

# Feedback Loop

During the run, the conveyor dot, active station, finished count, and tag readout show world state changing. A jam names the station, the missing tag, and the tags currently carried; the player can swap and retry.

# Natural Computational Need

The machine needs a small stateful pipeline: each station checks a set of tags and transforms the piece before passing it onward. The programming is embodied in the factory's rules, not exposed as a syntax task.

# Possible Underlying Patterns

Finite-state machine, pipeline composition, precondition validation, immutable-ish set transitions, and a simple event log.

# Dumb Solution

Try a random order, run it, and blindly swap stations until the first jam disappears. This is playable but wastes runs and does not require understanding the full chain.

# Intended Aha

Read each station as a handoff: the output tag of one station is the input tag of the next. The chain is RAW → SHELL → HOLE → WET → DRY → FINISHED, so the order follows the tags rather than the station names.

# Known Weaknesses

The dependency chain is intentionally linear and the station cards reveal their prerequisites, so the puzzle is closer to a quick ordering exercise than a deep factory simulation. There is no parallel routing, inventory pressure, or station failure beyond the first bad handoff.
