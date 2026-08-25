# Demo 03 DESIGN.md — Echo Twin Waltz

1. **Premise**
   A stone door opens only if both floor plates are pressed together for 1 full second. Pip's golden echo replays her exact movement timeline with a fixed delay. One timeline must satisfy two actors at once.

2. **Naked Toy Appeal**
   Stepping on pressure plates with a delayed mirror-self is a physically intriguing predicament even without any programming panel.

3. **Character Causality**
   The echo is Pip. Without Pip's movement plan, there is no echo; without the echo, there is no second body. She is structurally the only possible actor.

4. **Player Decision**
   Design one movement timeline and an offset D such that Pip and her delayed self stand on different plates at the same time long enough.

5. **Initial Failure State**
   Default program walks Pip to plate A and waits, with D=0. The echo stands on top of Pip, so only one plate glows. The door stays shut and the meter barely moves.

6. **Natural Computational Need**
   Timing, intervals, and concurrency emerge from a single script replayed with an offset. The player is effectively solving `overlap(f(t), f(t−D)) ≥ 1s`.

7. **Programming Representation**
   A timeline DSL: `start-end: right | left | wait`, plus a numeric offset. This matches the causal model: "I move like this; the echo does the same thing later."

8. **Dumb / Creative Solution**
   Player could oscillate rapidly near the center so the echo is always slightly out of phase and covers both plates intermittently. Allowed; it shows why intentional overlap is cleaner.

9. **Surviving Mechanic Gene**
   **Single script replayed by multiple actors with phase offsets.** A powerful way to introduce parallel causality without actually asking the player to think about threads.

10. **Known Weaknesses & Temporary Asset Notes**
    - Walk speed and distances are tuned so a pure nonstop walk gives ~0.79s overlap.
    - Echo starts invisible until its delayed start time.
    - All art inline SVG.
