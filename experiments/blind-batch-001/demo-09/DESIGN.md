## Premise

A magnetic temple contains two floating relics and a ring that opens only when the relics pass through it in a safe order. An acolyte can charge their body north or south and use that polarity to pull or release a relic.

## Player Decision

Choose which polarity to carry to each relic and which contact to make first. Pulling the wrong relic into the other causes a visible collision and destabilizes the ring.

## Constraint

`charge N` or `charge S` works only at the coil and sets the character's body polarity. `touch R1` / `touch R2` works only when adjacent; it moves the contacted relic one slot according to the character's polarity. The ring changes only after that character contact. A contact with no charge or from away is a no-op.

## Feedback Loop

The acolyte's body glows with a north/south mark, the relic moves when touched, and the ring's stability meter responds. A bad polarity makes the relics collide; the exact contact is recorded beside the shaken character.

## Natural Computational Need

The puzzle needs a finite body state, a collision-sensitive world update, and a short event sequence. Programming is a way to carry polarity into physical contact, not a direct command to move relics.

## Possible Underlying Patterns

Finite-state machine, event handling, collision response, carried state, and order-sensitive actions.

## Dumb Solution

Try the two polarity/contact orders and use the collision as evidence. A hard-coded successful plan is valid after the polarity relationship is discovered.

## Intended Aha

Polarity belongs to the character until the moment of contact. The relic does not read the program; it reacts to the acolyte's charged body meeting it.

## Known Weaknesses

The two-relic board is a deliberately small physics hypothesis. It does not yet explore continuous magnetic forces or multiple simultaneous actors.
