## Premise

Black ink is spreading through a row of framed drawings in a gallery. A cleaner carries solvent from a basin and must scrub the source before the next heartbeat lets the stain reach the final picture.

## Player Decision

Choose which contaminated frame to scrub first. The player is deciding which active source matters before using the character's one carried solvent charge.

## Constraint

The cleaner can `fill` a solvent bottle at the basin and `scrub F1` or `scrub F2` only when adjacent. A successful scrub clears that frame and prevents its next spread. The explicit `wait` command advances the visible heartbeat only while the character is standing beside a frame, so the player chooses whether to spend a beat before or after the physical treatment. Scrubbing or waiting from away is a visible no-op. If ink reaches F3, the painting is ruined.

## Feedback Loop

The character's bottle fills, the ink creeps one frame after an explicit wait, and each frame darkens or clears in place. A wrong wait leaves a darkened branch and stops the run with the cleaner next to the evidence.

## Natural Computational Need

The world creates a small changing-set problem: the character must inspect current contamination, carry a limited treatment, and act on the most consequential member before propagation.

## Possible Underlying Patterns

Mutable set state, propagation, guarded mutation, prioritization, and a condition-driven event step.

## Dumb Solution

Manually scrub a fixed source, reset, and try the other source. The world lets the player learn the spread rule through cheap retries.

## Intended Aha

The solvent is meaningful because it travels with the character. The program is not deleting ink from a list; the character is physically interrupting a spreading process.

## Known Weaknesses

The prototype uses only three frames and two sources, so it tests causal propagation more than general graph search. The heartbeat is deliberately discrete rather than continuous.
