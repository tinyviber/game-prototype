# DESIGN.md — demo-04: Blind Cave Fish Sensor Network

## 1. Premise
Beyond a wall, a dark cavern hides a roaming cave-bear that Pip can never see directly — only a motion sensor at the Exit reports whether *something* is there. Pip must wire that sensor reading (through NOT/AND logic) to the Exit door's open/closed state, and must also physically collect a treasure from a separate, always-lit alcove before crossing. The door's displayed state is only as trustworthy as the logic Pip wired it with.

## 2. Naked Toy Appeal
A "motion detected" light and a door that opens or stays shut based on it is a complete, tense little toy on its own — like a home-security clapper lamp wired backwards. Watching the light blink and guessing whether the door's behavior actually means what you assume is inherently unsettling and interesting, no code required.

## 3. Character Causality
Pip cannot see into the cavern at all — the sensor and the wiring are the *only* channel between Pip and the hidden bear. Pip is structurally forced to reason entirely through the proxy logic layer; there is no way to peek and no way to "just walk carefully," because Pip has zero ground-truth access.

## 4. Player Decision
"Given only an indirect signal, what boolean rule correctly turns 'sensor triggered' into 'safe to open the door'?" This is a pure logic-authoring decision over hidden state — never a spatial, timing, or equilibrium decision.

## 5. Initial Failure State
The door is pre-wired as `Door Opens When: S1` (the raw, uninverted sensor reading, ignoring the treasure entirely). On a fixed 8-tick bear schedule, the sensor happens to trigger on ticks 3 and 6 — and because the wiring is uninverted, the door indicator shows **OPEN** at exactly those two ticks, i.e., precisely when the bear is at the Exit. A player who trusts the door and crosses when it reads "open" gets scared back at tick 3, visibly and immediately, without any text error — the door was lying by design flaw, not by chance.

## 6. Natural Computational Need
Because Pip has no direct access to the hidden state, a raw sensor reading cannot be trusted at face value as "safe" — it must be logically transformed (inverted, and combined with another condition) before it can drive a physical actuator. This is the natural, minimal justification for NOT/AND as computational primitives: the world itself makes the raw signal unsafe to consume directly.

## 7. Programming Representation
A tiny boolean-expression builder: a checkbox to invert the sensor (`NOT S1`) combined via a fixed `AND` with a manually-toggled `Treasure Collected` flag, printed live as a readable one-line formula (`Door Opens When: NOT(S1) AND Treasure`). This is intentionally closer to a literal boolean expression than a node-and-wire diagram, since the entire lesson is precisely about the semantics of the expression, not about routing wires spatially.

## 8. Dumb / Creative Solution
A player can ignore the logic puzzle entirely and simply grab the treasure, then wait and watch the sensor light with their own eyes across a few loop cycles, mentally noting "it's dark on ticks 1,2,4,5,7,8" and click "Cross Now" during any tick they've personally verified as dark — brute-force pattern memorization instead of a provably correct formula. The engine allows and does not penalize this.

## 9. Surviving Mechanic Gene
**An actuator that is only as trustworthy as the logic wired between it and an unseen sensor.** If everything else is scrapped, the idea of a door that can visibly "lie" to the player because of an inverted boolean is the one mechanic worth preserving.

## 10. Known Weaknesses & Temporary Asset Notes
- The bear's schedule is fixed/deterministic (not truly random) across an 8-tick loop so the bug is guaranteed to be observable and fair — no bear sprite is ever rendered, only a "Motion Detected" light, to preserve the blind-sensing premise.
- Only one sensor and one manual flag are wired in this prototype; a fuller version would let the player place multiple sensors themselves rather than have them pre-placed.
- The simulation loops continuously rather than ending, so the player can experiment freely — a production version would likely cap attempts or add stakes for repeated failure.
- Cave rendered as a dark CSS panel with a single light icon rather than custom cavern art, to stay within the single-file time budget.
