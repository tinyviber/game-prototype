# Batch 1 Shared Design Brief

## Mission

Create nine cheap, playable programming-puzzle hypotheses for human discernment. This is blind exploration, not production development, refactoring, curriculum completion, or winner selection.

## New product constraint

The Main Character is the primary causal carrier from program to world:

```text
program command
→ Main Character moves / senses / carries / remembers / changes body state
→ guarded character action at an object
→ object or derived world state changes
→ the world shows the consequence
```

If the character could be replaced by a mouse pointer and the important mutation would still happen, the hypothesis has failed this batch's central test.

## Shared constraints

- Puzzle first, programming second, education third.
- Each demo is one micro-puzzle intended to take about 1–3 minutes after first exposure.
- Each demo is a standalone `index.html` that opens from `file://` and uses only inline HTML/CSS/JavaScript/SVG/emoji.
- No React, Vue, Svelte, Angular, Blockly, Tailwind build, npm, bundler, TypeScript, CDN, external asset, external API, backend, or shared runtime.
- Every demo uses a small editable program and a visible `Run`, `Step`, or `Reset` loop.
- A failed run must stop at a spatially understandable causal point. Wrong actions are evidence, not only a red label.
- Dumb but logically valid solutions remain allowed where the puzzle permits them.
- There is no ranking, score, recommendation, or winner selection in this batch.

## Causal invariants and command guards

Each demo implements its own tiny runtime, but uses these rules:

1. Movement may change only the character's position and passive display state.
2. A world object changes only inside a command handler that checks character adjacency or occupancy, the required inventory/body state, and the named action.
3. An invalid-away, missing-item, or wrong-state action is a visible no-op. It must not silently mutate the target.
4. A successful object action records a trace containing the character, target, guard that passed, and resulting mutation.
5. Reset restores character position/body state/inventory and every world object to the initial snapshot.

## Batch acceptance matrix

| Demo | Primary decision | Character causal chain | Failure evidence | Repair path | Dumb solution |
| --- | --- | --- | --- | --- | --- |
| 01 | Which socket receives charge first? | mouse charges → reaches socket → grounds charge → circuit lights / overloads | charge spark and socket browns out | reroute `ground` order | repeat fixed charge/ground commands |
| 02 | Which tone sequence is worth carrying? | concierge listens → stores tone → reaches gate → speaks → gate responds | gate answers one tone at a time | listen again, replace memory, replay | hard-code the seen tone |
| 03 | Which clay texture should the body carry? | scribe absorbs texture → walks to statue → presses → statue support changes | wrong texture cracks statue | reset, absorb other texture | try both fixed textures |
| 04 | How should a finite phase budget be distributed? | clockmaker winds phase → reaches clock → taps → clock/lamp pulse changes | lamp skips a beat / clock shows phase | change tap allocation | use a fixed tap list |
| 05 | Which spreading ink tile should be treated first? | cleaner takes solvent → reaches tile → scrubs → tile stops spreading | ink advances and darkens a frame | scrub the source before its branch | scrub every tile manually |
| 06 | Which physical handle timing should be replayed? | printer records character handle motions → character replays at press → paper advances | paper jams at a visible handle | edit record, replay again | type all handle motions manually |
| 07 | Which two silk edges make a stable web? | spider carries silk → reaches anchor → ties edge → rain conducts to flower | loose anchor snaps / flower stays wilted | replace an edge and retry | try both small edge combinations |
| 08 | Which two clouds make the remedy? | doctor carries typed clouds → combines at tray → reaches fish → feeds → symptom changes | fish rejects remedy and coughs | swap one ingredient | manually test the two recipes |
| 09 | Which polarity/contact order moves relics safely? | acolyte charges body → reaches relic → touches/releases → relic moves and ring state changes | relic collides and ring destabilizes | change polarity/order | repeat a fixed two-contact plan |

## Exact manual smoke protocol

For every demo, use the numbered commands documented in its `DESIGN.md`:

1. Run one invalid-away or invalid-state action first. Confirm the target's before/after state is unchanged and the trace names the failed guard.
2. Run a deliberately wrong but executable program. Confirm the character visibly reaches a causal point and the world leaves a specific failure state.
3. Reset. Run the documented repair program. Confirm a visible win state, not only a success label.
4. Reset again. Confirm position, body state, inventory, object state, and trace are restored.

## Static audit

```sh
ROOT=experiments/blind-batch-001
test -f "$ROOT/index.html"
test -f "$ROOT/SHARED_BRIEF.md"
test "$(find "$ROOT" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')" -eq 9

for N in 01 02 03 04 05 06 07 08 09; do
  D="$ROOT/demo-$N"
  test -f "$D/index.html"
  test -f "$D/DESIGN.md"
  test "$(find "$D" -maxdepth 1 -type f | wc -l | tr -d ' ')" -eq 2
  test "$(rg -c '^## ' "$D/DESIGN.md")" -eq 9
  ! rg -n 'https?://|cdn|unpkg|jsdelivr|<script[^>]+src=|<link[^>]+href=|fetch\(|WebSocket|React|Vue|Svelte|Angular|npm|blind-batch-000|round-[123]' "$D/index.html"
done
```

The prototypes are intentionally disposable, so no browser automation suite is included. Static checks plus deterministic manual fail → inspect → repair → reset runs are the validation for this research batch.
