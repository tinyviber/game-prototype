# DESIGN.md — demo-04 · The Fog Chimes
Vector: **D — Sensor–Actuator Networks**

## 1. Premise
A moonmoth must cross fog-drowned gardens from hive to moonflower along a route nobody remembers. Darkness eats its glow; if the light dies, it curls up mid-air and sleeps. Tilo owns three chime-lamp pairs: a chime rings when the moth brushes past it, and its paired lamp burns for four heartbeats. Nothing else can be seen, told, or carried through the fog.

## 2. Naked Toy Appeal
Probing an invisible world with sound-into-light gadgets is pure exploration pleasure — every ping is a tiny revelation. Even without any goal, planting bells in mist and watching lamps bloom is atmospheric play.

## 3. Character Causality
Tilo cannot fly, cannot see through fog, and cannot talk to moths — she can only listen where she plants. Her expression tracks the moth's glow (worry → awe), and her placement choices are literally the only causal input into the network.

## 4. Player Decision
Design a sense→act cascade under a hard budget (3 pairs): WHERE to listen (chime = hypothesis about hidden path) and WHERE that truth should become visible (lamp = actuation). Then read the evidence: golden crumbs fall only where light actually touched the moth.

## 5. Initial Failure State
The inherited network was planted along a naive guessed arc. Pair 1's chime luckily catches the route and rings; its lamp however hangs too far off-path — the moth pings, blinks on, and still gutters out around the middle of the map. The failure is visible twice: no light at the death spot, plus a short stub of crumbs proving "the path IS here."

## 6. Natural Computational Need
Runtime-unknown state makes pre-planned scripts useless; only reactive sensor→actuator binding works. Relay timing emerges naturally: each chime must sit within the previous lamp's 4-second window so light hands off like an async pipeline — cascading events, not direct control.

## 7. Programming Representation
Place-and-pair board: chime→lamp linked by a dashed thread (an event binding drawn as a physical cord). Zero syntax; the wiring diagram IS the program.

## 8. Dumb / Creative Solution
Dumb-but-valid: re-run repeatedly and slide pairs a little toward each fresh crumb until coverage chains. Creative: realize ping windows relay (place chime N+1 inside lamp N's time-radius) and solve in two edits. Both paths were hand-simulated feasible with 3 pairs.

## 9. Surviving Mechanic Gene
**"The instrumentation log is the level editor."** Keep: evidence breadcrumbs generated only where sensors+actuators touched the hidden state — debugging as gameplay.

## 10. Known Weaknesses & Temporary Asset Notes
- Path is deterministic per page-load (no seed variety); replay value relies on placement search.
- Lamp radius/time constants tuned so 3 pairs barely suffice — tight but solvable; sloppy relay gaps drain ~12 glow, tolerable.
- WAAPI animates SVG geometry attributes (`r`) — modern Chrome/Firefox/Safari OK, very old browsers just skip polish.
- Moth = two wing ellipses + body + halo bar; fog = drifting translucent ellipses; all disposable inline SVG.
