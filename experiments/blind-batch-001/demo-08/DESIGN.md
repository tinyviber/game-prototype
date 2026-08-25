## Premise

A mechanical fish is coughing because its water filter needs a two-cloud remedy. A cloud doctor can collect two typed clouds, combine them at a tray, and carry the resulting remedy to the fish.

## Player Decision

Choose the two ingredients from three dispensers and decide which fish-side treatment to attempt. Only one pair makes the fish breathe clearly; another pair makes the water foam.

## Constraint

`collect mist` or `collect salt` works only at its matching dispenser and adds a typed cloud to the character's small inventory. `mix` works only at the tray with two clouds; `feed` works only adjacent to the fish with the mixed remedy. Every successful action visibly changes the character's inventory or the remedy, and invalid location/state actions do not mutate anything.

## Feedback Loop

Cloud tokens enter the character's backpack, swirl together at the tray, and the character feeds the fish at close range. The fish's bubbles change after feeding; the wrong remedy causes a visible foam burst and stops the run with the recipe trace.

## Natural Computational Need

The world needs typed inventory and a small combination rule, but the rule is useful only because the character must gather, carry, mix, and deliver the remedy through space.

## Possible Underlying Patterns

Typed state, multiset/recipe combination, inventory, precondition checks, and conditional object response.

## Dumb Solution

Try the three possible two-cloud recipes, resetting after each foam burst. Or write a fixed collect/mix/feed sequence after observing the symptoms.

## Intended Aha

The remedy is not a recipe applied directly to the fish. It becomes real only when the character carries the ingredients and performs the mix and feed actions at the right places.

## Known Weaknesses

There is one fish and only three dispensers. The recipe is intentionally small so the prototype tests typed carried state rather than a full crafting system.
