# The Quiet Workshop — Vertical Slice Review

## Premise

One small repair helper is trying to wake a dormant mechanical conservatory. Every room is part of the same restoration job: the helper crosses the workshop rail, reads its timing, carries a found glyph, repeats a useful physical routine, and finally reconnects the conservatory's reflexes.

The world is the debugger. A locked latch, a dropped floor tile, an empty pocket, a jammed brass station, or a swinging arm makes the program's consequence visible without turning the workbench into a lesson screen.

## Level 1 — The sleeping latch

- Decision: touch the nearby activator before walking through the gate.
- Initial failure: `move, move, move` walks directly into the locked gate.
- Physical evidence: the helper stops at the red gate and looks confused; the message points at the dark activator.
- Dumb solution: there is no need for pathfinding—the repair is to insert one interaction in the existing route.
- Aha: a program can cause an indirect world change. The helper is literal, so the player must sequence a cause before its consequence.

## Level 2 — The breathing floor

- Decision: spend one beat waiting for a safe tile phase.
- Initial failure: three immediate moves land on the collapsed phase.
- Physical evidence: the tile changes through safe, unstable, and collapsed states; the failed run records the exact tick.
- Dumb solution: the fixed rail remains the route; only the timing changes.
- Aha: the world has time as state. `WAIT` is not empty space—it is a deliberate action that lets the environment move.

## Level 3 — The pocket of light

- Decision: observe a runtime glyph at Site A, carry it, and apply it at Site B.
- Initial failure: the default reaches Site B with an empty pocket.
- Physical evidence: the pocket is visibly empty, then visibly holds an amber glyph after observation; the gate distinguishes empty from wrong.
- Dumb solution: the player still walks a short fixed route; the interesting work is deciding what must survive the trip.
- Aha: a value discovered in the world can become part of the helper's embodied state and be used later.

## Level 4 — A useful little loop

- Decision: recognize that a two-beat physical routine can be recorded and replayed.
- Initial failure: the default expanded attempt has one extra move and jams on beat five.
- Physical evidence: the machine fails at the mismatched beat. The valid expanded program still works, and the brass capsule visibly queues and performs one recorded action per tick.
- Dumb solution: `move, interact, move, move, interact` is accepted; compression is useful, not mandatory.
- Aha: replay is a physical capability. The capsule stores behavior, not a mysterious answer, and the helper enacts it at the second station.

## Level 5 — The crossed wires

- Decision: connect each sensor to the arm on its own side.
- Initial failure: the crossed default sends the left trigger to the right arm.
- Physical evidence: the wrong arm swings into the wall at tick one and the helper reacts with confusion.
- Dumb solution: there are only two sockets, so the player can inspect the visible causal chain directly.
- Aha: a small reactive rule can live in the world beside the action program. The player is wiring behavior, not filling out a logic worksheet.

## Cohesion review

The same helper, rail, brasswork, and restoration story persist across all five rooms. The abilities grow as physical tools: hand, timing, pocket, capsule, then wiring. Each new ability answers a problem the previous room made tangible, while the earlier vocabulary remains recognizable. The slice avoids curriculum labels and keeps spatial movement short; only Levels 1 and 2 use the rail as a meaningful route.

## Progression review

The workbench begins with only Move and Interact. Wait appears when the floor itself changes. Observe and Apply appear when information must travel. The capsule appears when a repeated repair is visible. Wiring appears last, when the restored conservatory can safely act on sensor events. Controls are added as abilities become relevant; future tools are absent rather than greyed out.

## Honest retrospective

The strongest cohesion comes from the helper physically carrying consequences forward: opening a latch changes the route, waiting changes the floor, observing changes the pocket, and replaying changes a remote station. The workbench element that survives best is the small editable sequence: it stays readable while gaining timing, memory, and replay vocabulary.

The weakest level is currently Level 5. Its fixed two-event schedule is clear and deterministic, but it is closer to a wiring vignette than a full room. A future iteration should give the repaired reflexes one more physical consequence without turning the sockets into a general logic editor.

Natural abstractions appeared in three places: the tick/step/run protocol, memoized history, and a fixed-tick presentation driver. The persistent DOM shell and sequence editor also emerged as mechanical UI repetition. Level semantics deliberately remain unabstracted: a breathing floor, a pocket glyph, a replay capsule, and sensor-arm wiring do not share a universal command AST, topology system, or behavior engine.

## Validation notes

- `cd game && npm test`: 9 files, 25 tests passing.
- `cd game && npm run build`: TypeScript check and Vite production build passing.
- Simulation code contains no `Math.random()`, `Date.now()`, DOM access, or Pixi imports.
- `framework-probe/` remains outside the slice write scope.
