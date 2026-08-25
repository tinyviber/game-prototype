## Premise

In a strange world, colored objects and shaped objects lend their properties to one another on contact. Four loose objects must be seated in four marked homes.

## Player Decision

Choose whether the next contact trades color or shape, then drag one loose object onto another. When the combinations look right, drag each object into its exact home.

## Constraint

Only one property trades per contact, and seated objects lock. A home accepts only the exact color-and-shape combination shown in its mark.

## Feedback Loop

Contact flashes both objects and reports the exchanged property. A rejected home names both the object’s current combination and the home’s required combination. Retry resets the world.

## Natural Computational Need

The prototype needs mutable paired properties, pairwise contact events, placement state, and a small exact-match validator for homes.

## Possible Underlying Patterns

State transitions, event handling, object lookup, property swapping, and predicate-based validation are all hiding inside the toy.

## Dumb Solution

Hard-code the two color swaps, the two shape swaps, and the four final placements.

## Intended Aha

Colors can be used as destination anchors while shapes are moved independently; the puzzle is a small recombination problem, not a hunt for a uniquely correct object.

## Known Weaknesses

The fixed puzzle is short, the trade buttons make the rule explicit, and seated objects require a full retry instead of supporting a more forgiving undo.
