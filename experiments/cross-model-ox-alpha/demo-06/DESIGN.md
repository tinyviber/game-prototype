# DESIGN.md — demo-06 · The Spore Telegraph
Vector: **F — State Metamorphosis & Wiring**

## 1. Premise
The chant-totem hums a fixed five-note song (red·blue·blue·red·blue) down three spouts. The Great Door wakes only for its carved password — blue·blue·red — each note landing in its own socket; a wrong color slams it shut. Between them grows a fungal switchboard: mushrooms whose caps can be grafted into relay (pass), prism (swap red↔blue), or snail (dawdle), joined by draggable tendril wires. Tilo carries the only two graft-spores.

## 2. Naked Toy Appeal
Colored spores visibly racing along hand-drawn tendrils toward an ancient door is a living circuit toy; the door's slam/awake responses give instant, physical verdicts even with no understanding of "logic."

## 3. Character Causality
Tilo owns the scarce resource (graft spores) and the wiring hands (tendril threads). Nothing moves until she re-routes or re-grafts; she hops to each mushroom she mutates. She is a mediator of transformations — nothing is carried anywhere.

## 4. Player Decision
Two coupled decisions: ROUTING (which out-port feeds which input — topology) and TRANSFORMATION (where prisms sit in the flow). The hypothesis under test: "what minimal set of swaps and paths turns this stream into that password?"

## 5. Initial Failure State
The workshop's honest straight wires (spout→mushroom→socket, all relay caps) deliver the song's first note — RED — to a socket craving BLUE at ~3 seconds in. The door shudders, carves a ✗, and the banner names the mismatch ("socket 1 wanted blue, tasted red"). Repair data is exact.

## 6. Natural Computational Need
This is function composition over a stream: each mushroom applies `f(color)` and the sockets check output against a target sequence. Players reason about mapping, order, and identity — discovering that relays preserve, prisms transform, snails only delay (delays are red herrings for color problems), all without any syntax.

## 7. Programming Representation
Drag-wire graph + tap-to-cycle cap grafting under a 2-spore budget. Chosen because routing + transformation ARE the visible interface; no symbolic layer is needed to express the idea.

## 8. Dumb / Creative Solution
Dumb: cycle caps randomly until a run survives (budget exactly covers the needed two prisms). Creative: realize any permutation of chains still needs both blue-first sockets fed by swapped streams — then place prisms as early as possible; or wire spare mushrooms in as decorative detours purely to watch dawdling pulses.

## 9. Surviving Mechanic Gene
**"Password-checking door over a rewritable transformation graph."** Keep: state metamorphosis in transit — signals change identity between source and sink while topology encodes order.

## 10. Known Weaknesses & Temporary Asset Notes
- With one shared chant stream, only 2 grafts are ever needed; SNAIL is deliberately a learnable dead end for this puzzle (it exists to teach delay ≠ color).
- Sockets accept whenever unfilled (no strict beat windows) — forgiving by design.
- Wire drag uses elementFromPoint hit-testing; overlapping ports may grab drops oddly at close range.
- Pulses drawn/removed per frame via class query — fine at this pulse count.
- All art flat inline SVG; cap colors double as type legend.
