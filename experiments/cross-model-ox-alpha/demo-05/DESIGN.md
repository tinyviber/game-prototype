# DESIGN.md — demo-05 · The Mill Weir
Vector: **E — Emergent Ecological / Flux Systems**

## 1. Premise
A mountain pond feeds an old mill through a binary headgate. Weather runs a full day arc: soak → drizzle → dry snap → storm → drizzle → long evening drought. The miller's contract needs 70 turns of the wheel by dusk; the beaver burrow hall floods if the pond crests past the red line while the gate is shut. Tilo floats on a raft at the waterline, measuring.

## 2. Naked Toy Appeal
A living cross-section — rain falling, pond breathing up and down, wheel spinning, sack pile growing — is inherently pleasant to watch and nudge. "When should the gate be open?" is a question every child has intuitions about from bathtubs and rain gutters.

## 3. Character Causality
Tilo is the weir-keeper: only her two standing rules move the gate; she rides the water surface so the player literally watches the level through her. Her alarm face at crest and despair at cobwebs carry the state without any text.

## 4. Player Decision
Author two threshold rules (`WHEN level ▲/▼ N THEN gate OPEN/SHUT`) under a visible weather forecast. The hypothesis being tested is a control policy: react late (naive) vs bank high and relieve early (hysteresis).

## 5. Initial Failure State
The miller's inherited note — "open above 2, shut below 1" — passes everything through immediately: during the first drought the pond empties, the wheel visibly stops, cobwebs grow over it, and dusk arrives ~9 turns short of quota (61 vs 70). The failure is spatial (stopped wheel, dead flume) and quantitative (sack pile).

## 6. Natural Computational Need
Threshold rules driving a feedback loop against laggy physics: players discover hysteresis (open/close bands), anticipation (banking before the forecast drought), and duty cycles — the computational skeleton of control systems, emergent from a single actuator plus conservation.

## 7. Programming Representation
Two rule cards with direction toggle, numeric mark stepper (0.5 steps), action toggle. Deliberately minimal: one sensor (level), one actuator (gate), two if-statements — the entire program fits in a sentence.

## 8. Dumb / Creative Solution
Dumb-but-viable: leave everything open and pray (fails ~9 short). Creative verified winner: "hug the crest" — `▲9.4 OPEN / ▲8.6…` i.e., open near the top to shed storms, ride the stored water down through droughts (86 turns). Multiple passing bands exist between marks 8–9.5.

## 9. Surviving Mechanic Gene
**"Weather forecast + threshold pair = discoverable hysteresis."** Keep: continuous flux where the win metric is continuity of work, not raw volume.

## 10. Known Weaknesses & Temporary Asset Notes
- Flood rule: pond above the red line while shut fails after a 4-tick grace (matches headless calibration); opening sheds instantly.
- Score = count of turns with outflow ≥ 0.6; the shut-gate leak (0.6, level-capped) counts as a turn by design ("the shut board leaks a thin trickle that still counts") — this makes banking strategies legible.
- Cloud art parks over the pond during rain bands rather than tracking a front; acceptable stylization.
- All assets flat inline SVG; sky lerps morning→dusk via stop-color interpolation.
- Headless calibration: naive 60 ✗ / crest-hugger 85 ✓ / always-shut floods / grid-best 87 @ {▲9, ▼1.5}.
- Browser-verified end-to-end (Playwright): naive dusk shortfall banner shown; {▲9.4 OPEN / ▼8.6 SHUT} reaches "Flour for everyone!" at 85 turns.
