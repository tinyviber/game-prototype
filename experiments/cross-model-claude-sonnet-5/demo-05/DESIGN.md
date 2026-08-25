# DESIGN.md — demo-05: Pond Algae Equilibrium

## 1. Premise
Pip tends a garden pond fed by a nutrient valve. Pip cannot stand at the valve every single day, so instead Pip sets a standing *rule*: "when algae gets scarce, do X; when algae gets abundant, do Y." That rule then governs the valve automatically across many simulated day-cycles, while algae and fish populations feed off each other in a simple loop the player can only steer indirectly.

## 2. Naked Toy Appeal
A living terrarium that can bloom green, run clear, or slowly die depending on a feeding rule is fascinating on its own — the same appeal as a desktop ecosystem toy (a self-sustaining sealed aquarium) where you tweak one input and watch the whole system's fate play out over time.

## 3. Character Causality
Pip is physically unable to babysit the valve for 24 days straight — the *only* way Pip can influence the pond's future is by authoring the standing rule before walking away. Every day's outcome is a direct, delayed consequence of that one authored decision, not of any in-the-moment action.

## 4. Player Decision
"What should the standing feeding rule be when algae is scarce, and when it's abundant?" This is a continuous-control / equilibrium-tuning decision, unlike any other demo here — success is a *stable trajectory over time*, not a single reachable event.

## 5. Initial Failure State
The default rule feeds *less* nutrient (valve = 2) whenever algae dips low, and *more* (valve = 8) whenever algae spikes high — which sounds intuitively cautious ("don't overfeed when it's already high, ease off when it's already low") but is actually a starvation trap: once algae dips under the low threshold, the reduced valve can't keep up with grazing fish, algae keeps falling, and the fish that depend on it begin dying off one by one. Run the simulation and the pond visibly clears to bone-dry blue, the fish counter drops from its peak toward zero, and the day-by-day graph shows a slow, visible death spiral — no text error, just a pond running out of life.

## 6. Natural Computational Need
Because the system has delayed feedback (today's valve setting doesn't show its effect until several days later, and the fish/algae relationship compounds), a single one-shot action cannot possibly govern 24 days — only a standing conditional *rule*, evaluated fresh every day-tick, can hold the system anywhere near equilibrium. This is the natural, minimal justification for a persistent threshold rule instead of a script of one-time commands.

## 7. Programming Representation
Two plain number fields wired into a fixed if/else-if skeleton the player can read directly: `IF algae > 60: valve = [high field]`, `ELSE IF algae < 20: valve = [low field]`, `ELSE: hold`. This stays close to literal conditional syntax because the entire lesson is about correctly reasoning through a threshold rule's direction, not about a novel visual metaphor.

## 8. Dumb / Creative Solution
A player can ignore careful tuning and simply set both fields to the same middling constant (e.g., both = 4), effectively disabling the adaptive rule and running a flat, non-reactive feed — this can still avoid the worst collapse purely by luck of picking a survivable constant, and the engine fully allows it.

## 9. Surviving Mechanic Gene
**A standing rule that keeps re-evaluating itself against a slow-moving world, where "winning" means the system stays stable rather than reaching a finish line.** If everything else is scrapped, this shift from "solve once" to "keep it balanced over time" is the one idea worth preserving.

## 10. Known Weaknesses & Temporary Asset Notes
- Formulas were hand-tuned and validated with a standalone Node simulation before being embedded, so the default reliably collapses and the corrected values (high=1, low=6) reliably stabilize — but the two thresholds (60/20) themselves are not player-editable in this prototype, only the two response values are.
- The default bug as tuned mainly exercises the *low-threshold* response (a starvation spiral); the *high-threshold* bloom-collapse path exists in the code and is reachable with different player inputs, but isn't guaranteed to trigger from the default start state.
- Pond rendering is a single color-interpolated `div` plus a canvas line chart, not a full water/fish illustration, to fit the single-file time budget.
- 24-day runs are simulated with a short animated delay per day rather than true real-time, so a full run takes only a few seconds.
