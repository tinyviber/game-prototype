## Premise

A weather gate is waiting for the tone sequence that one of three distant towers will reveal. An echo concierge can listen to one tower, carry the sound in a pocket, and speak it at the gate.

## Player Decision

Choose which tower to visit and what to keep in the character's one memory slot before walking to the gate. The decision is what information is worth carrying across the courtyard.

## Constraint

Only a character standing at a tower can run `listen`. Listening replaces the pocket echo with that tower's runtime tone. Only an adjacent character can `speak`; an incorrect tone makes the gate answer one wrong syllable and lock the run. The gate's response cannot be changed remotely.

## Feedback Loop

The character raises a listening cup at the tower, a tone chip appears in the pocket, then the character carries it across the visible courtyard. At the gate, each spoken beat lights or rejects a ring. A failed sequence leaves the gate's partial response visible for repair.

## Natural Computational Need

The world creates a memory-mediated communication problem: the useful information is observed in one place and consumed in another. A memory slot and a sequence of `listen`, `move`, `speak` actions are the minimum representation.

## Possible Underlying Patterns

Runtime observation, mutable memory, message passing, sequence, and protocol matching.

## Dumb Solution

Because the tone is stable for the run, the player can listen to the right tower and write a fixed movement/speak sequence. Trying towers one at a time is also a valid exploratory solution.

## Intended Aha

The character's pocket is the bridge between two places. The gate is not reading the program directly; it is responding to what the character actually remembered and said.

## Known Weaknesses

The runtime tone is fixed within this disposable prototype, so a player can eventually memorize it. The memory slot is intentionally small and may feel closer to a message token than free-form memory.
