## Premise

A city street lamp pulses out of phase because its clock has lost part of a beat. A clockmaker carries a phase key from a bench and taps one of two clocks to repair the shared rhythm.

## Player Decision

Spend a limited phase budget across the two clocks. The player must decide where each tap belongs so the two lamp pulses line up, not merely press every visible button.

## Constraint

The character can wind a phase key to value 3 at the bench. `tap C1` or `tap C2` works only when adjacent and subtracts one phase unit, adding that unit to the chosen clock. The lamp updates only after the character's successful tap. Tapping from away or with phase 0 is a no-op.

## Feedback Loop

The phase key glows on the character, the clock hand jumps when tapped, and the street lamp flashes after each valid contact. A wrong allocation visibly skips the next flash; the run stops with the current clock values and phase remaining.

## Natural Computational Need

This is a small accumulator and modular alignment problem embodied by a character carrying phase. The program expresses how to distribute a finite state across repeated, guarded contacts.

## Possible Underlying Patterns

Accumulator, modular arithmetic, resource allocation, repeated action, and event-triggered state change.

## Dumb Solution

Try one or two fixed tap lists and use the lamp's skipped flash as evidence. Once the relation is visible, a hard-coded successful sequence is valid.

## Intended Aha

The lamp is not being set to a value by code. The character is physically moving phase from the key into a clock, and the street only reacts to those contacts.

## Known Weaknesses

The phase arithmetic is small and deterministic. The lamp provides strong feedback, so discovery may be fast after the first failed allocation.
