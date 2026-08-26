# Premise

A mountain shelter has one small fire and three open vents. Three gusts will arrive from a changing route. The player is the night watch, trying to keep enough warmth for the occupants.

# Player Decision

Before running the watch, the player writes one tiny instruction for each gust: leave the vents alone or close one named vent. The meaningful decision is predicting where the next gust will hit and spending a closure there.

# Constraint

The wind route is initially hidden, closures must be chosen in advance, and a wrong closure still costs the opportunity to protect the targeted vent. The fire has limited strength, so repeated misses matter.

# Feedback Loop

Observe the shelter and the three vent positions, predict, edit the three watch instructions, and run. Each timed gust visibly moves across the shelter, darkens the chosen closed vent, moves the smoke, and changes the fire-strength meter. Failure says which vent was actually hit, enabling a retry.

# Natural Computational Need

The watch needs a compact ordered plan: one action attached to each event in a known sequence. A short sequence of editable choices is enough; no general-purpose language is needed.

# Possible Underlying Patterns

Sequence, indexed event handling, state change, and conditional protection are all present underneath the world action. They are consequences of scheduling the watch, not concepts announced to the player.

# Dumb Solution

Closing the same vent for every gust can still preserve some heat and is logically valid, even if it is inefficient. A player can also leave all vents open and learn the route from the failure feedback.

# Intended Aha

The gust is not random: its visible route is a three-step pattern (west, east, center). The program is a remembered watch plan that turns that prediction into physical shelter behavior.

# Known Weaknesses

The route is fixed and the puzzle is effectively solved after one informative run. The closure model is simplified, and a player may infer the route from the wording or source code rather than observation. There is no persistent score or richer shelter consequence.
