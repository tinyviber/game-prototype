# DESIGN.md — Demo 03 · Echo Canyon

Batch: `cross-model-deepseek` | Vector: **C — Temporal & State Echoes** | Model: deepseek

---

## 1. Premise
A chasm splits the canyon. A spirit drawbridge responds only to the weight of the explorer's own **echo** — a ghost re-enactment that the totem plays forever. A second spirit button high on the left bank holds the exit door open. The totem already hums an *old, wrong song*. The explorer must write a 10-frame song in which the echo holds the bridge early in the loop and the door late in the loop — then physically dash across the bridge during its down-phase and step through the door during its open-phase. One protagonist, two moments, cooperating across time.

## 2. Naked Toy Appeal
"My ghost holds the bridge for me" is emotionally legible with zero programming UI. Watching a translucent copy of yourself pace a fixed loop forever, while you time your own crossing to it, is a toy about *dancing with your own past*.

## 3. Character Causality
The echo **is** a copy of the protagonist — there is no other actor in the world capable of pressing the spirit buttons. The explorer is not a courier: they are the source and the beneficiary of the causality loop. The protagonist's own recorded agency sustains the world *while the protagonist is elsewhere* — the strongest possible "persistent protagonist" binding.

## 4. Player Decision
*How to split the 10-frame budget* between two obligations. Core hypothesis: "if my echo holds the bridge for the first frames and the door for the last frames, I can dash across during the gap." The player reads the frame-strip debugger (exactly which frames open what), then executes a timed live dash.

## 5. Initial Failure State
The totem's old song is plausible-and-wrong: `[←, ·, ·, ·, ·, ·, ·, ·, ·, ·]` — the echo shuffles left and idles in a corner. The world exposes it instantly: the bridge hangs up, the door stays shut, the echo is visibly useless. World Diary: *"your echo shuffles left and mumbles in the corner. The bridge stays up."* First debugging insight: the song itself is the problem — re-record it.

## 6. Natural Computational Need
Timing + state scheduling. A finite frame budget must be divided between two exclusive obligations; the loop's phase becomes the clock the live player must synchronize to. This is programming *as choreography* — no other abstraction fits "my past self holds the world open."

## 7. Programming Representation
A **10-frame instruction tape** (record live as a performance, or hand-edit direction arrows per slot), with a live frame-strip debugger showing which frames hold the bridge (green) and which hold the door (amber). Chosen because the world problem *is* a timeline.

## 8. Dumb / Creative Solutions
- Any frame split works: a greedy "bridge all the way, door 1 frame" tape forces a razor-tight dash — valid, stressful, learnable.
- Recording a straight walk to the bridge and idling forever: door never opens — a visible dead-end that teaches the budget constraint.
- Hand-editing a slot mid-path to jump the echo across the map (the editor allows it) — a cheating-adjacent creative hack the engine permits.

## 9. Surviving Mechanic Gene
**Self-referential loop replay**: the player's recorded action becomes a permanent autonomous actor that the player must synchronize with. Any "cooperate with yourself across time" level should keep this gene.

## 10. Known Weaknesses & Temporary Asset Notes
- The dash requires live timing against the loop; mitigated by a slow/fast toggle and a generous 4-frame bridge window by default. A pure-timer version (no live dash) is a possible variant.
- You cannot *record* a chasm crossing (the bridge is up while recording) — a physical rule that constrains the tape to button-holding, which is intended but should be communicated more clearly in the world.
- The tape editor allows frame jumps (one slot edit moves only the next frame) — accepted as a creative outlet for the prototype.
- Assets are inline SVG (canyon, chasm, rope bridge, spirit buttons, door, totem, ghost echo, and Pip). The totem's visual is decorative; the tape UI is the real interface.
