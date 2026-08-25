# DESIGN.md — demo-03: Echo Chamber Bridge

## 1. Premise
A canyon bridge has two pressure plates, one at the end of a short lane and one at the end of a longer lane, and both must be pressed on the *exact same tick* for the gate to open. There is only one Pip — but the canyon's Echo Chamber will faithfully replay a second, independently-authored instruction track ("Echo," Pip's past attempt) in perfect lockstep with a fresh live track ("You," this attempt), both starting at tick 0 on one shared clock.

## 2. Naked Toy Appeal
Two toy figures on two tracks of different length, each governed by its own wind-up card, and a gate that only opens if both figures tap their button on the same beat — this is fascinating as a pure mechanical-toy synchronization puzzle (like two metronomes that must strike together), independent of any code framing.

## 3. Character Causality
The Echo is explicitly *Pip's own past self*, not a separate NPC — the canyon's rule is that Pip cannot be in two places at once except through this Echo Chamber effect, so solving the bridge is structurally only possible because Pip is willing to author and trust a duplicate of their own actions running in parallel.

## 4. Player Decision
"How do I offset two programs of different natural length so their single decisive moment (the PRESS) lands on the identical tick?" This is a pure relative-timing decision between two simultaneous programs — never a spatial pathing, rule-authoring, or logic-wiring decision.

## 5. Initial Failure State
Echo's track is preloaded as `[MOVE, MOVE, MOVE, PRESS]` (reaches the near plate and presses on tick 4). Live's track is preloaded as `[MOVE, MOVE, MOVE, MOVE, MOVE, PRESS]` (reaches the far plate and presses on tick 6). Both presses are individually valid — each press light flashes green in its own lane — but never at the same time. The bridge gate visibly rattles and stays shut, and a shared timeline readout shows the two green flashes two ticks apart.

## 6. Natural Computational Need
Since the two lanes have different lengths, no naive "just walk both tracks forward" plan aligns automatically — the world *forces* the insertion of deliberate `WAIT` steps (a no-op instruction) into the shorter track to burn ticks until the longer track catches up. This is the natural, minimal need for an explicit "do nothing this tick" instruction, distinct from any conditional or loop.

## 7. Programming Representation
Two independent ordered instruction strips (`MOVE` / `WAIT` / `PRESS`), rendered side-by-side above their respective lanes, both executed simultaneously against one visible tick counter — the shared clock itself is the primary UI element, since the whole puzzle is about relative alignment against it.

## 8. Dumb / Creative Solution
A player can ignore precise arithmetic and just pad one track with a long run of `WAIT` steps, nudging the press tick later one at a time and re-running until the two indicator lights happen to flash together — brute-force trial and error is fully valid and the engine supports rapid re-runs for exactly this purpose.

## 9. Surviving Mechanic Gene
**Two independently-authored programs racing on one shared clock, where success is defined purely by relative timing between them.** If everything else is scrapped, this "your past self and present self must hit the same beat" duet is the one idea worth preserving.

## 10. Known Weaknesses & Temporary Asset Notes
- Only two tracks/lanes in this prototype; a richer version might explore three-or-more-way synchronization.
- `PRESS` silently fails (consumes a tick, does nothing) if issued off-plate — this is explained in the on-screen legend rather than through a separate tutorial modal.
- Lanes are rendered as flat CSS strips with circle tokens rather than a true canyon/bridge illustration — a placeholder given the single-file time budget.
- No limit on program length is enforced, so extremely long WAIT-padding solutions are possible and intentionally allowed.
