# DESIGN.md — demo-02: Windup Sentries

## 1. Premise
A berry patch sits behind a single fence line. Pip has one wind-up toy soldier that can only be given a short *repeating* patrol loop (a cyclic list of Left/Right/Stay moves) before the key is turned. Once wound up, the soldier marches on its own — Pip cannot touch it again until the patrol is over. A fixed, previewable schedule of crows will swoop in at specific columns and specific moments; if the soldier isn't standing on that column at that exact moment, the crow steals a berry.

## 2. Naked Toy Appeal
A wind-up soldier pacing a fence line while birds try to sneak past is a complete diorama on its own — like a cuckoo clock defending a garden. You don't need to know it's "code" to find it satisfying to watch the soldier's rhythm try (and fail, or succeed) against the birds' rhythm.

## 3. Character Causality
Pip cannot be the sentry — Pip has other business (this is the fiction: Pip needs both hands free elsewhere) and must fully delegate the defense to a wound-up mechanism. The entire puzzle only exists because Pip is *absent* during execution; Pip's causal role is 100% front-loaded into the authored loop.

## 4. Player Decision
"What repeating rhythm should the soldier march to, given I already know exactly when and where every crow will strike — but I cannot react once it starts?" This is a pure advance-commitment scheduling decision, unlike any other demo here where the player can inspect and adjust mid-run.

## 5. Initial Failure State
The default patrol loop is `[Right, Left, Right, Left]` — an intuitively plausible "guard the middle, rock back and forth" rhythm. Against the fixed 6-crow schedule, it saves 3 berries and loses 3: the loop never reaches the far flank columns (0 and 4) at the ticks crows actually arrive there. The world shows this directly — three crows visibly swoop past an empty column while the soldier paces in the middle, then fly off with a berry each.

## 6. Natural Computational Need
Because the soldier cannot be corrected mid-run, and the crow schedule requires visiting five different columns at five specific moments, a *single fixed short loop* cannot possibly be "reactive" — the only lever is authoring a longer, well-timed cyclic sequence in advance. This is loop/cycle-length and phase-alignment as the natural computational primitive, distinct from demo-01's law-timeline and demo-03's dual-track sync.

## 7. Programming Representation
An ordered, cyclically-repeating list of move chips (`Left` / `Right` / `Stay`), rendered as a horizontal strip the player can extend, shorten, or reorder — visually a "wind-up cam track" rather than literal code, since the mechanic (repetition, not conditionals) doesn't need dropdown parameters.

## 8. Dumb / Creative Solution
A player who doesn't want to compute exact phase alignment can simply build a very long loop that sweeps the *entire* fence back and forth slowly and repeatedly (e.g., `Right,Right,Right,Right,Left,Left,Left,Left`), covering every column at some point in every cycle — brute-force full coverage instead of precise timing. The engine fully allows this and it can still save every berry if the sweep period happens to line up.

## 9. Surviving Mechanic Gene
**Commit-then-observe autonomous execution** — the player has zero ability to intervene once "wound up." If everything else is scrapped, the value of a mechanic where the player must fully trust their own plan before it plays out unsupervised is the one thing worth preserving.

## 10. Known Weaknesses & Temporary Asset Notes
- Only one soldier/lane in this prototype; multi-soldier coordination was designed but scoped out for time.
- Crow schedule is fixed/deterministic (not randomized) so the puzzle is fair and solvable by careful planning — a production version might randomize per attempt with a fair preview window.
- Crows and soldier are rendered as simple emoji/CSS shapes rather than custom SVG art — a placeholder to keep the prototype single-file and fast to build.
- No sound/telegraph beyond a 1-tick "incoming" flash above the target column.
