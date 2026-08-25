# DESIGN.md — demo-06: Circuit Golem Innards

## 1. Premise
A guardian golem stands at a garden gate, arms ready to block intruders from either side. Its chest panel is open, exposing its own internal wiring: two eyes (Left, Right) that sense an approaching intruder on their side, wired through to two arms (Left, Right) that raise to block. The golem's wires are currently crossed — Left Eye drives the Right Arm and vice versa — so it always blocks the empty side while intruders walk straight past the side it's actually watching.

## 2. Naked Toy Appeal
Opening up a broken toy robot's chest and finding the one crossed wire that explains its weird behavior is a satisfying "aha" moment on its own, independent of any code framing — it's the same appeal as debugging a badly-wired desk lamp switch.

## 3. Character Causality
Pip isn't controlling the golem from outside with a joystick or issuing it commands each moment — Pip reaches *into the golem's own body* and rewires its existing, already-acting nervous system. The golem keeps acting autonomously throughout; Pip's only lever is which existing wire connects to which.

## 4. Player Decision
"Which eye should drive which arm?" A tiny, binary rewiring decision — but its consequence plays out across a whole scripted sequence of intruders and a friendly visitor, unlike a single flip switch.

## 5. Initial Failure State
With the default crossed wiring (`Left Eye → Right Arm`, `Right Eye → Left Arm`), every time an intruder approaches from the left, the *right* arm visibly swings up over empty ground while the intruder walks straight past the ungraded left side — and symmetrically for intruders from the right. Two out of two intruder waves get through untouched, shown plainly as red "GOT THROUGH" events with the golem flailing the wrong arm on screen.

## 6. Natural Computational Need
The golem's body already has the right *number* of sensors and actuators — the bug isn't missing capability, it's a wrong internal connection. This is the natural, minimal justification for direct wiring/reassignment as the computational primitive, distinct from writing new logic from scratch.

## 7. Programming Representation
Two simple dropdowns — "Left Arm raises when: [Left Eye / Right Eye]" and "Right Arm raises when: [Left Eye / Right Eye]" — printed above a live diagram of the golem's chest showing which eye is currently lit and which arm is currently raised. This is a minimal wiring assignment, not a full node-graph editor, since only one binary choice per actuator is meaningful here.

## 8. Dumb / Creative Solution
The panel includes an explicit override checkbox, "keep both arms always raised," which trivially blocks every intruder regardless of wiring correctness — but the golem's own ally, Pip, needs to walk through that same gate twice during the sequence, and permanently raised arms seal the center passage too. The dumb solution "solves" the intruder problem while visibly failing the golem's other duty, making the trade-off legible rather than simply forbidding it.

## 9. Surviving Mechanic Gene
**Rewiring an already-embodied, already-running system's internal connections, rather than programming a new external controller for it.** If everything else is scrapped, this "debug the body's own nervous system" framing is the one idea worth preserving.

## 10. Known Weaknesses & Temporary Asset Notes
- Only two sensors and two actuators are exposed; a richer version might expose an actual gate/AND logic layer between them (deliberately avoided here to stay orthogonal to demo-04's sensor-network architecture).
- The intruder/ally schedule is fixed and fully scripted (not randomized) for guaranteed, fair demonstration of both the bug and the fix.
- Golem body and visitors are simple inline SVG/emoji shapes, not fully rendered characters, to fit the single-file time budget.
- The "always raised" override is intentionally the only way to reach an always-blocking state, since normal wiring can only ever connect an arm to *one* eye, never force it independent of sensing.
