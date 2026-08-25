# Batch 0 Shared Design Brief

## Mission

Create one cheap, playable programming-puzzle hypothesis for human discernment. This is exploration, not production development, refactoring, curriculum completion, or winner selection.

## Product constraints

- Puzzle first, programming second, education third.
- The visible content is an understandable world problem. Programming patterns are the hidden computational skeleton.
- Start with: world problem → player decision → information/state/world constraint → feedback loop. Only then identify a natural computational need and its minimum programming representation.
- If the programming UI disappeared, the world problem should still be worth solving.
- The program controls the world. Run must cause observable spatial/world-state change, not only a Correct/Wrong label.
- Core loop: observe → predict → edit/program → run → inspect world change → repair → retry.
- Failure should reveal useful world evidence. Dumb but logically valid solutions are allowed.
- Use programming as a tool/ability/weapon, not as a lesson or syntax quiz. Do not design from a variable/if/loop/function syllabus.
- Keep representation minimal and composable enough to express the player’s idea. Do not build a visual-language system.

## Prototype constraints

- One micro puzzle, playable in roughly 1–3 minutes after first exposure.
- First-time player should understand the world and goal, make a meaningful decision, edit a program/rule/instruction, run it, see consequences, possibly fail, learn, retry, and reach a small aha.
- Low-polish UI: clean, legible, obvious hierarchy/interactions. Simple HTML/CSS/vanilla JavaScript/inline SVG or emoji are fine.
- Main implementation must be one `index.html` that opens directly from the filesystem.
- No React/Vue/Svelte/Angular, Tailwind build, npm, bundler, TypeScript compilation, backend, database, WebSocket, external API, external assets, external JS/CSS libraries, or CDN.
- Code is disposable. Hard-coded state, duplicated logic, primitive DOM, and fake/simulated details are explicitly allowed. Optimize information gain per implementation cost.
- Include a short `DESIGN.md` with exactly these headings: Premise, Player Decision, Constraint, Feedback Loop, Natural Computational Need, Possible Underlying Patterns, Dumb Solution, Intended Aha, Known Weaknesses.

## Independence and scope

- Work only in the assigned demo directory.
- Do not read or mention other blind-batch candidates, other candidate DESIGN.md files, the locked direction list, or the old coding-game implementation.
- Do not critique, rank, refine, or imitate other candidates.
- Do not build shared engines or abstractions.
- THIS CODE IS DISPOSABLE.

## Structural acceptance checks

The orchestrator will only check structural viability: files exist, direct-open implementation works, no forbidden dependency/framework is present, there is a real player decision, world execution visibly changes, failure/feedback exists, and the design is not merely a syntax quiz. Human taste decides whether it is fun, weird, boring, elegant, or worth keeping.
