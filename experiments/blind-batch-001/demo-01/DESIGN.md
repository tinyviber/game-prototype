## Premise

In a flooded lighthouse, a tiny repair mouse carries a charge from a live coil to two dead sockets. Grounding the first socket changes the circuit that the second socket depends on.

## Player Decision

Choose which socket the mouse should ground first, and decide whether to recharge before the second contact. The world problem is restoring the lighthouse without browning out the circuit.

## Constraint

The mouse starts beside the coil with charge 0 and capacity 2. `charge` works only at the coil; `ground A` / `ground B` works only when adjacent to that socket and consumes one charge. Grounding B first makes A flicker, while A first lights both. Moving away and grounding is a visible no-op.

## Feedback Loop

The mouse walks through the little board, its charge meter fills, and sparks travel from its body into a socket. A wrong first ground browns out the lamp and stops the run. The trace says whether the character was adjacent and charged; the player edits the command lines and retries.

## Natural Computational Need

The need is a short action sequence with a carried numeric state and an order-sensitive world side effect. The program is useful because the mouse must repeat a physical recharge/contact routine without the player directly clicking sockets.

## Possible Underlying Patterns

Inventory/resource state, sequence, guarded object action, dependency ordering, and a small state transition.

## Dumb Solution

The player may hard-code `charge`, walk to A, `ground A`, recharge, walk to B, and `ground B`. It is valid; the puzzle asks whether the order and contact state are understood.

## Intended Aha

The mouse is not carrying an abstract score: its charge is a physical resource that crosses the world with it. Grounding A first makes the second route safe.

## Known Weaknesses

There are only two sockets and a small board, so the experiment tests character-mediated charge and order more than deep planning. The fixed dependency may be easy to spot on a second run.
