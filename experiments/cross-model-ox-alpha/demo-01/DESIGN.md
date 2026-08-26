# DESIGN.md — demo-01 · The Leaning Grove
Vector: **A — Environmental Law Mutation**

## 1. Premise
A chasm separates the last vine shoot from the dormant Mother Bloom. The shoot grows one cell per half-breath toward whichever sun-orb glows brightest at that breath. Stone (old canopy, leaning pillar, bloom ledge) blocks growth; a boxed-in shoot wilts. Tilo cannot touch the vine — she can only re-tune which orb "sings brightest" in each of 18 breaths.

## 2. Naked Toy Appeal
A living rope snaking across a dusk canyon toward shifting lights is intrinsically watchable. Even with zero UI, "which light should shine when?" is a question a child asks naturally of a growing plant.

## 3. Character Causality
Tilo is the grove's lamp-keeper: she owns the orb song. She never moves the vine; without her retuning, the inherited song wastes it. Her mood mirrors each attempt (cheer / wilt-sad), anchoring feedback emotionally.

## 4. Player Decision
Author the *environmental law* over time: for each breath, choose the brightest orb (or the Bloom itself). The player is testing hypotheses like "rise past the canopy first, then let the Star Orb drag it along the top" vs "dive low and thread under the pillar."

## 5. Initial Failure State
Default: all 18 breaths pinned to the Moss Orb. The shoot climbs, reaches the orb's shelf, then obsessively coils around it far from the bloom until every breath is spent ("out of song"). Failure is spatially obvious — a coiled green knot nowhere near the target — and the grey ghost-vine preserves yesterday's attempt for comparison.

## 6. Natural Computational Need
The schedule IS a program: an ordered policy over time that a dumb environment executes literally. Players feel sequence ("first up, THEN across"), state (visited cells persist), and greedy-vs-goal divergence — the computational skeleton of planned control flow.

## 7. Programming Representation
A phase×orb selection grid (radio per column). Minimum representation: no syntax, one decision per time step, immediate visual diff between attempts via ghost path.

## 8. Dumb / Creative Solution
Two verified routes exist (see verification): HIGH ROAD (`O1,O1,O4…O4,Bloom…`) rides over the canopy top; LOW ROAD dives under the pillar through the bottom gap. Players may also waste early breaths wandering — budget (36 growth steps) tolerates sloppiness. No route is forced.

## 9. Surviving Mechanic Gene
**"Program = re-tuned law; world = interpreter."** If this level dies, keep: scheduling an environmental attractor over time to steer an autonomous grower.

## 10. Known Weaknesses & Temporary Asset Notes
- Greedy step-toward-target with visited-set means players can't author loops/branches — deliberate scope cut.
- Default failure is "budget exhausted while circling," not a hard wilt; wilt only triggers on full enclosure.
- Orbs are plain glowing circles; bloom petals are 5 rotated ellipses; rocks are flat rects with random speckles — disposable assets by design.
- Verified headless: default fails; high road wins @ phase 15; low road wins @ phase 14 (18-phase budget).
