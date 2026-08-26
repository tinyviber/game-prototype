# Premise

A small ferry has five crates waiting at a crowded dock. The player must tell the crew which side of the deck receives each crate so all cargo gets aboard without the ferry tipping, then leaves level enough to depart.

# Player Decision

For each crate in the fixed dock order, choose Port or Starboard. The decision is a loading plan: it distributes weight over time, not merely a final answer.

# Constraint

The ferry may never be more than 5 kg heavier on one side during loading, and the final port and starboard weights must match. All five crates must be loaded.

# Feedback Loop

Observe the waiting crates and their weights -> predict a distribution -> edit the side buttons -> run -> watch crates appear and the ferry tilt after every step -> use the tipping step or final weight difference as evidence -> repair and retry.

# Natural Computational Need

The crew needs a repeatable manifest for a sequence of physical choices. A tiny editable list of side assignments is enough to communicate that plan and replay it consistently.

# Possible Underlying Patterns

The hidden skeleton can support sequence, accumulation of weight, comparison against a safety limit, and a final equality check. A player does not need to name any of these patterns to solve the dock problem.

# Dumb Solution

Try Port or Starboard on every row, run it, and use the observed tilt/tipping point to flip assignments until the weights work. Brute-force trial and error is valid and intentionally cheap.

# Intended Aha

The order matters while loading: a plan can end balanced yet tip halfway through. The player sees that a good ferry plan is a safe running balance, not just two equal piles at departure.

# Known Weaknesses

There is only one cargo order and no moving crew or dock congestion. The safety threshold is forgiving, and the solution space is small enough to brute-force quickly. The prototype also uses buttons rather than a more expressive manifest, so it tests planning and feedback more than programming fluency.
