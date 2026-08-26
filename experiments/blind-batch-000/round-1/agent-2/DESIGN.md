# Premise

At a night market, a lantern cart must pass through a narrow street while shoppers use the same three shared gates. The goal is to get both groups to the far stall safely.

# Player Decision

At each gate, decide which arrival gets priority: the cart or the shoppers. The player edits three plain-language gate instructions and runs them.

# Constraint

Each gate is one-person-wide. The cart and the shoppers arrive together, and a gate that releases shoppers first puts them in the cart’s lane. The cart must clear every gate before the shoppers enter it.

# Feedback Loop

Observe the shared gates, predict which group should go first, edit the gate signs, and run. The cart and shoppers visibly move through the street. An unsafe choice leaves a crash marker at the exact gate; reset and retry preserve useful location-based evidence.

# Natural Computational Need

The real problem is coordinating a repeated sequence of shared spaces. A tiny ordered rule is enough: apply the same safety priority at Gate A, then B, then C.

# Possible Underlying Patterns

Sequence/order, priority, resource locking, and a repeated step across checkpoints. These are consequences of coordinating the world, not concepts presented as a lesson.

# Dumb Solution

Set every gate to “Let cart go.” It is logically valid and solves this fixed micro-puzzle, even though it is not a sophisticated traffic system.

# Intended Aha

The player notices that the important idea is not choosing a route for each group, but ordering access to a shared gate. “Cart first” at every checkpoint makes the spatial conflict disappear.

# Known Weaknesses

The fixed simulation is deliberately forgiving: it does not model timing, waiting, or a cart that arrives early. The shoppers-first option always fails, so there is little room for alternate valid strategies. The emoji street is a diagram rather than a rich market, and repeated runs do not animate between checkpoints.
