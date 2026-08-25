## Premise

Three tiny workers must carry different materials through one narrow workshop aisle to shelves at distances 4, 6, and 8. A worker who parks too early can become a wall for someone still traveling.

## Player Decision

Choose the order in which Ada, Cy, and Bo enter the aisle, then choose a launch gap of 0, 1, or 2 beats.

## Constraint

Workers move one cell per beat, cannot pass, and cannot occupy the same cell. The aisle has no side route or passing space.

## Feedback Loop

Run the chosen queue and watch the workers, shelf markers, beat counter, and movement log update. A jam stops the run at the first blocked cell and names the pair and beat; reset or clear queue enables another attempt.

## Natural Computational Need

The world needs a small scheduler: maintain an ordered queue, advance moving agents on discrete beats, and guard shared-cell occupancy.

## Possible Underlying Patterns

Priority by farthest destination, queue discipline, discrete-event simulation, state transitions, and collision detection.

## Dumb Solution

Send everyone immediately, or send the nearest shelf first because it looks quickest. Both approaches jam the shared aisle.

## Intended Aha

The farthest destination must go first, followed by the middle and near shelves, with at least one beat between launches. Once the first worker is safely ahead, the queue behaves like a controlled convoy.

## Known Weaknesses

The level has a single obvious optimal ordering and does not allow route choice. Timing is intentionally abstract, and the “no passing” rule is communicated mostly by the board and failure text rather than physical worker animation.
