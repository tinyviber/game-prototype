# DESIGN.md — demo-02 · Norbert's Night Round
Vector: **B — Asynchronous Delegation & Helpers**

## 1. Premise
Every night, gentle sleepwalker Norbert follows his dream-route to pull the harbor lever before dawn so the gate can lower for the night ferry. But last spring's landslide ate Main Street (a pit now gapes in his old lane), a goose family nests beside the detour, and — indignity of indignities — a cat has taken to sleeping directly on the lever mechanism. Tilo, the dream-weaver perched on his nightcap, can pin cards into his dream… once.

## 2. Naked Toy Appeal
Steering a huge soft sleepwalker through a moonlit village is funny and tender; every hazard has personality (honking geese, an indignant cat, a snoring giant). The strip of dream-cards reads like a bedtime ritual even with zero programming framing.

## 3. Character Causality
Tilo cannot walk the route herself — she's palm-sized and Norbert won't wake. She is structurally the *only* author of his night: delegation is total, and her card order is the causal chain. The run cannot be corrected mid-flight by design.

## 4. Player Decision
Compose a ≤14-card plan under real constraints: geometry (jump arcs clear exactly one tile), timing (the cat walks at her own pace after RING — PULL too early fails softly), and hazard avoidance. Hypothesis being tested: "will this dream survive contact with the village?"

## 5. Initial Failure State
His inherited dream — straight down Main Street, then the lane, then pull — tumbles him into the landslide pit on card 7, with dust, stars, and a dizzy Tilo. Plausible (it worked for years), wrong (world changed), physically legible.

## 6. Natural Computational Need
An imperative script must be authored blind and executed later: sequence matters, actions have durations, and one action (RING) is a remote command that changes ANOTHER agent's state — the seed of event-driven delegation. Soft-fail on early PULL teaches waiting/timing without killing the run.

## 7. Programming Representation
A horizontal card strip (max 14 slots): step arrows, jump (direction cycles on click), ring, pull. Chosen because it mirrors "writing tonight's instructions" — a literal queue — while staying below Blockly-level nesting for prototype scope.

## 8. Dumb / Creative Solution
Verified 14-card solution exists (RING first, weave right-south, jump the pit). But players may find alternates: jump over the nest instead of around it, ring late and pad with extra steps, route over-the-top if they spend cards wisely. Any working queue counts.

## 9. Surviving Mechanic Gene
**"Remote action on second agents baked into a one-shot delegated script."** If this demo dies, keep: program-once autonomy + indirect world manipulation (bell→cat→lever) as a delegation primitive.

## 10. Known Weaknesses & Temporary Asset Notes
- No walls/interiors collision beyond blockers list; Norbert and the cat can overlap tiles harmlessly.
- Cat pathing is naive Manhattan (could visually clip fountain corner).
- Dawn timer (60 ticks ≈ 19 s) is generous; speedrun pressure not tuned.
- Assets: flat-color SVG shapes only; Norbert = lavender blob + nightcap triangle + closed-eye arcs; geese are white ellipses; disposable by design.
