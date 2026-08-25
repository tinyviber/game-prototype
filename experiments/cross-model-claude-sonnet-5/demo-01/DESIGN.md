# DESIGN.md — demo-01: Gravity Well Gardener

## 1. Premise
Pip stands beside a walled garden plot holding a Gravity Rod. A seed sits in the soil. Gravity inside the plot points in whatever direction Pip's rod currently commands — and the seed's vine grows one cell per tick, strictly along that direction, bending only when the law itself changes. A sunlit goal patch sits off to the side, behind rocks that block a straight line. Pip must author a *timeline of law changes* so the vine snakes around the rocks and reaches the sun.

## 2. Naked Toy Appeal
Watching a vine bend and crawl through a garden in response to an invisible force field is fascinating on its own — it's the same appeal as a magnetic-maze toy or a marble run: you can't see the force, only its consequence, and the consequence is organic, wiggly, alive. Even with zero code on screen, "flip a dial, watch the plant obey physics" is a compelling toy.

## 3. Character Causality
Pip is not a bystander pressing a button — Pip *is* the gravity source. The rod must stay planted in this specific plot; the law only exists because Pip authored it and is anchoring it there. There's nothing to "carry" or "deliver" — Pip's authored timeline is the entire mechanism of the solution.

## 4. Player Decision
"When do I flip the law, and to what?" This is a sequencing decision over a rule-timeline, not a path-following decision over an avatar. The player never steers anything directly.

## 5. Initial Failure State
The plot loads with a pre-authored 3-step program:
```
SET_GRAVITY(down, 3)
SET_GRAVITY(right, 4)
SET_GRAVITY(up, 2)
```
Running it: the vine drops 3 cells, turns and crawls right — but it slams into a rock wall on step 2 (the rock sits at the 3rd rightward cell, not the 4th). The vine tip flashes red against the rock and growth halts permanently, visibly short of the sunlit goal. The world shows *exactly* where and why it stopped — no text error needed, just a stalled, blocked sprout against stone.

## 6. Natural Computational Need
The rocks force a rule: no single constant-direction law reaches the goal, and the vine cannot react to rocks itself — the *timing and ordering of multiple discrete law changes* is the only lever. This is a sequence + parameter-tuning problem (ordered steps, each with a duration argument) — the most natural minimal "program."

## 7. Programming Representation
A short ordered list of `SET_GRAVITY(direction, ticks)` rows, editable via dropdown (direction) + number stepper (duration), with Add/Remove row buttons and a Run/Reset control. This is deliberately close to literal code structure (an ordered instruction list with parameters) since the mechanic itself *is* the sequencing — no extra visual metaphor was needed on top.

## 8. Dumb / Creative Solution
A player can ignore "efficient" routing and instead author a long list of 1-tick steps, manually walking the vine cell-by-cell around every rock like a hand-drawn path. It's tedious but the engine fully allows and rewards it exactly the same as a compact 3-step solution — there's no forced "must use fewer instructions" gate in this prototype.

## 9. Surviving Mechanic Gene
**A world rule that is authored, not executed by an avatar** — i.e., the program changes physics itself rather than commanding a body. If everything else about this level is scrapped, this "the code IS gravity, not a walker" inversion is the one idea worth preserving.

## 10. Known Weaknesses & Temporary Asset Notes
- Vine growth is deterministic and single-path; no branching vines, no multiple seeds.
- Rock collision only halts growth — there's no "bounce" or "redirect" behavior, which a richer version might explore.
- Garden grid rendered as inline SVG `<rect>` cells; Pip is drawn once beside the plot (decorative rod-holder) and does not animate — future passes could animate Pip "casting" each law change.
- No difficulty ramp / multiple levels — single fixed layout for probing purposes only.
