## Premise

At a small station, four vehicles must cross two overlapping track zones and reach their destinations without a collision.

## Player Decision

The player chooses which waiting vehicle to dispatch and when. A vehicle cannot be recalled once it enters its route.

## Constraint

The crossing and throat each hold one vehicle. Vehicles that need both zones must make a clean handoff while the next zone is clear.

## Feedback Loop

The track plan moves vehicles in real time, zone lamps show occupancy, and the control log records arrivals, handoffs, or the exact vehicle and zone involved in a conflict. Reset preserves the lesson while allowing another attempt.

## Natural Computational Need

The station needs state tracking for vehicle positions, zone occupancy, timed transitions, and conflict checks. The computation stays behind the dispatch desk rather than becoming a programming exercise.

## Possible Underlying Patterns

Finite-state machines, resource locking, event queues, interval overlap checks, and a small scheduler.

## Dumb Solution

Send vehicles in a fixed order and wait for every one to arrive before sending the next. It works, but leaves safe independent work unused.

## Intended Aha

The two shared zones are separate resources. Safe parallel movement is possible, but a route that changes zones must be timed around the other vehicle's current lock.

## Known Weaknesses

The puzzle has one compact traffic layout and its timings are forgiving. The visual paths are schematic, and a cautious player can solve it by mostly sending one vehicle at a time.
