## Premise

A hand press has two handles that must be pulled in an exact rhythm to feed a paper strip. A printer can record a short sequence of their own handle motions, then replay that bodily sequence at the press.

## Player Decision

Choose which handle rhythm to record and when the character should replay it. The core decision is timing and reuse of a physical action buffer, not remembering a remote symbol.

## Constraint

`record L,R,L` stores the character's three handle motions. `replay` works only when the character is standing between the press handles; the stored actions are then enacted one by one by the character. The press advances on `L,R,L`; `L,L,R` visibly misfeeds the paper.

## Feedback Loop

The character's hands animate during recording and replay. Each handle press advances a paper marker; a wrong beat bends the strip at the exact handle. The player can edit the record line, replay again, and inspect the motion trace.

## Natural Computational Need

The useful abstraction is a small action buffer that can be captured and played back at a new moment. The press cannot be fixed by setting a paper variable; the character must enact the buffered sequence.

## Possible Underlying Patterns

Sequence buffer, replay, synchronization, decomposition, and deterministic event execution.

## Dumb Solution

Use three direct commands `pull L`, `pull R`, `pull L` instead of recording. That expanded solution is valid and intentionally reveals why a reusable sequence might be useful.

## Intended Aha

The recorded program is a memory of what the character's body does. Replay is not teleporting the press state; it is making the character perform the same hand rhythm again.

## Known Weaknesses

The action buffer is tiny and the press has only one valid rhythm. The experiment tests embodied replay more than abstraction with parameters.
