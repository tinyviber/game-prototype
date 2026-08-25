## Premise

A cracked clay statue needs one missing surface texture to hold its shape. A transcriber can absorb texture into their gloves and press it into the statue, but carrying the wrong texture makes the crack spread.

## Player Decision

Choose whether the character should absorb soft clay or rough clay, then decide when to spend that body property on the statue. The puzzle is about transforming the character into the needed tool.

## Constraint

`absorb soft` and `absorb rough` work only at their matching clay mound and replace the character's current texture. `press` works only adjacent to the statue. Soft seals the crack; rough makes it crumble. A press without a texture or from a distance does not mutate the statue.

## Feedback Loop

The gloves visibly change texture when the character absorbs a mound. The character walks to the statue and presses; the statue either firms up or sheds a visible chunk. The trace identifies the carried texture and adjacency guard, making the repair choice legible.

## Natural Computational Need

The world needs a mutable property that travels with the character and is written into an object at contact. A tiny program expressing absorb, move, and press is enough; no object-to-object swap is allowed.

## Possible Underlying Patterns

State replacement, property transfer through an actor, preconditions, sequence, and predicate-based validation.

## Dumb Solution

Try soft first, reset, then try rough. Or hard-code the successful absorb/move/press sequence after observing the crack.

## Intended Aha

The character is the writing instrument. The statue does not borrow directly from a mound; the character must carry the property to the point of use.

## Known Weaknesses

There are only two textures and one target, so the choice is intentionally sharp rather than broad. The tactile body-state metaphor may need stronger animation in a later prototype.
