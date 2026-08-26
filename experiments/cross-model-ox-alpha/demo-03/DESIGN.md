# DESIGN.md — demo-03 · The Convergence Bells
Vector: **C — Temporal & State Echoes**

## 1. Premise
Five mountain bells stand at very different distances from a sleeping shrine (one inside slow mist that halves wave speed). Each toll travels as a visible expanding ring; the shrine stirs only if all five tones land on the same beat — one chord. Tilo, the bell-keeper's apprentice, writes the striking timetable.

## 2. Naked Toy Appeal
Interference rings blooming across a starlit ridge and converging on a tiny shrine is beautiful to watch even with no goal. "When should each bell be hit so everything arrives together?" is a natural riddle about echoes anyone can feel.

## 3. Character Causality
Tilo owns the timetable — nobody else can strike on schedule (the bells are huge, the nights are short). Her mood conducts the attempt: cheer at chord, slump at discord. She stands beside the shrine counting beats.

## 4. Player Decision
Pure scheduling: assign each of five bells a single strike beat (0–25). The hypothesis under test: "given what I saw arrive last time, which offsets make all arrivals coincide?" The mist bell hides its true delay, forcing Run→Inspect before arithmetic can finish the job.

## 5. Initial Failure State
The inherited habit strikes every bell at beat 0. Rings visibly bloom and slap into the shrine one after another (beats ~5,6,7,8,10), tinting the crystal five different colors — discord made physical. White ▼ flags then mark each tone's actual arrival column directly on the timetable, handing the player repair data.

## 6. Natural Computational Need
This IS asynchronous alignment: independent jobs with fixed latencies must be offset so they complete simultaneously (a barrier). Players invent `strike = K − delay` themselves — the computational skeleton of coordinating parallel operations across time.

## 7. Programming Representation
A tick-grid timetable: one row per bell, one clickable cell per beat. Minimum possible representation of "when," deliberately excluding loops/conditions because the puzzle's essence is offsets on a shared clock.

## 8. Dumb / Creative Solution
Brute force works: nudge flags toward each other run by run without any math (each run prints arrival columns). Creative shortcut: notice rings travel at constant speed, measure with your eyes, solve in one edit. Any K ≥ 11 yields a valid chord schedule (verified K=12 → strikes 6,4,7,5,2).

## 9. Surviving Mechanic Gene
**"Convergence scheduling against observable-but-unequal latencies."** Keep: programming along the time axis where the world reveals per-channel delay through visible propagation.

## 10. Known Weaknesses & Temporary Asset Notes
- One strike per bell per run (no ostinato patterns) — scope cut.
- Mist speed difference must be inferred visually; players who miss it may grind an extra run (acceptable, evidence exists).
- WebAudio chimes are synthesized sines (no assets); wrapped in try/catch for autoplay policies.
- Ring culling uses max-delay heuristic; long runs leave harmless faint circles until culled.
- Verified: delays = Copper 6, Iron 8, Bronze 5, Silver 7, Mistbell 10 — distinct; default (all beat 0) produces staggered discord.
