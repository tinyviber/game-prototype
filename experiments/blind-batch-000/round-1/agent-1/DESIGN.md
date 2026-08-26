# Premise

Tidepool Village has three full buckets at its well and an empty tank on the far side of a rocky inlet. The player must get the fresh water across before the rising tide reaches the footbridge.

# Player Decision

The player decides whether each moment should be spent carrying a bucket or waiting. They edit a short, readable ferry plan and can take a risky first attempt to see how quickly the tide closes the route.

# Constraint

The bridge starts at tide 25. Carrying a bucket raises the tide by 20; waiting raises it by 10. The bridge is lost at 100. Three carries are needed, so unnecessary waits leave less margin and an incomplete plan leaves buckets behind.

# Feedback Loop

Observe the scene and tide bar, predict how much tide the plan will consume, edit the lines, then run. The water visibly rises, the route flashes, and the message reports delivered buckets or the exact kind of failure. Resetting makes retry cheap.

# Natural Computational Need

The village needs a compact sequence of timed actions: repeat the same world action enough times, while avoiding a costly delay. A tiny editable list is enough to represent that plan; no general-purpose language is needed.

# Possible Underlying Patterns

Sequence, repetition, resource budgeting, deadline scheduling, and feedback-driven repair. The puzzle can later grow into conditional action (for example, carry only while the bridge is dry), but the first version keeps the representation deliberately small.

# Dumb Solution

Typing `carry` three times is a valid brute-force solution. A player can also run an incomplete or delayed plan and use the resulting tide and bucket count as evidence rather than being punished for experimenting.

# Intended Aha

The tide is a visible shared resource, not a score. Every line changes the world, and the simplest winning plan is also the safest: act three times before spending time on anything else.

# Known Weaknesses

The current model lets a carry happen at the cutoff boundary and does not animate individual buckets. The optimal answer is easy once the numbers are noticed, so there is limited depth after the first aha. The plan syntax is still a small command vocabulary and may feel code-like despite being framed as a village instruction list.
