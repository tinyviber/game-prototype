## Premise

The greenhouse has six valve turns left before sunset. Pepper, Mint, and Fern each need a different amount of water, but the only reservoir holds 10L.

## Player Decision

The player queues one 2L pour for each turn, deciding which bed gets water and when.

## Constraint

There is one shared reservoir, one valve turn per slot, and each bed has a deadline. Pepper needs 4L by turn 4, Mint needs 2L by turn 3, and Fern needs 4L by turn 6.

## Feedback Loop

The player runs the queued day. Each turn visibly updates the tank, bed meters, and field log. A miss names the bed and reports delivered water versus required water, so the next retry has concrete evidence.

## Natural Computational Need

This is a small resource-allocation and deadline-scheduling problem: track remaining demand, available water, and the next urgent deadline while arranging a sequence.

## Possible Underlying Patterns

An array of scheduled actions, a loop over time slots, a lookup table for plant requirements, counters for delivered water, and a final constraint check.

## Dumb Solution

Click a bed repeatedly in an arbitrary order until the six slots are full, then run the day and hope the deadlines line up.

## Intended Aha

Water amount alone is not enough; the scarce thing is the timing. Secure the tight Mint deadline, then use the remaining turns to satisfy Pepper before turn 4 and Fern by sunset.

## Known Weaknesses

The small puzzle has a narrow state space and gives away the exact deadlines. It teaches sequencing more than discovery, and there is no difficulty ramp because this is intentionally a disposable micro-prototype.
