# PRIMITIVE_EXTRACTION.md — Round 2 Hardening

**Role:** Subagent-Alpha (Evidence & Code Inspector). **Law:** if it is not a quoted line of executable JS, it is not a fact.
**Scope:** re-verification pass on the 6 demos this round's brief names as load-bearing, plus the de-sugar docket for 4 candidate pseudo-primitives challenged by the Orchestrator. This file supersedes any Round-1 claim it contradicts.

---

## 1. Corpus Re-Verification — 6 Load-Bearing Demos (read in full, this round)

| Demo | Path | State Storage | Clock Driver | "Program" Shape | Execution Mode |
|---|---|---|---|---|---|
| Firefly Lamplighter | `cross-model-kimi-k3/demo-02` | `fx,fy,glowing,ci` scalars + `cmds[]` + `shrooms[]` | `requestAnimationFrame(frame)` | `cmds=[{op:'go',x,y}\|{op:'glow'\|'wait',dur}]` | **sequence**, PC=`ci`, wraps `(ci+1)%cmds.length` |
| Echo Twin Waltz | `cross-model-kimi-k3/demo-03` | `segs[]` (parsed, sorted by `a`), `t`, `overlap`, `D` | `requestAnimationFrame(frame)` | `segs=[{a,b,op:'right'\|'left'\|'wait'}]` | **pure query** `posAt(tt)` — re-walks `segs` from x=45 every call |
| Mole Sensor Greenhouse | `cross-model-kimi-k3/demo-04` | `pots[4]{m,r,dry,wet,state}`, `s1sel/s2sel` (alias index), `cont[]`, `sched[]` | `requestAnimationFrame(frame)` | two co-mingled rule arrays inferred from text by **regex shape**, not an explicit tag | **scan** — full re-evaluation every frame, no PC exists |
| The Prism Burrow | `cross-model-kimi-k3/demo-06` | `chain[]` (3 picks), `colors[]`, module-level `let colors=[]` closure | single `requestAnimationFrame(frame)` keyed off elapsed wall time, **never loops** | `chain=[flowerA,flowerB,flowerC]` | **one-shot fold**, computed fully at Run-click, before any tick occurs |
| The Dam That Breathes | `cross-model-deepseek/demo-05` | `SIM` = pure, DOM-free core; `rules[]`, `playerMoves[]` | `setInterval`/`Step` button/keydown → always calls `SIM.run(...)` | `rules=[{lt,open}]` (cascade) + `moves=[[tick,'L'\|'R']]` | **authoritative replay-fold from t=0**, every single invocation |
| Echo Canyon | `cross-model-deepseek/demo-03` | `SIM` = pure, DOM-free core; `tape[10]`, `playerMoves[]` | same pattern as Dam | `tape=[{x,y}]` (looped, `tick%tape.length`) + `moves=[[tick,dir]]` | **authoritative replay-fold from t=0**, identical kernel shape to Dam |
| Echo Chamber Bridge | `cross-model-claude-sonnet-5/demo-03` | `echoProgram[]`, `liveProgram[]`, local `echoPos/livePos` | `for(tick=1..maxTicks)` + `await delay()` | two parallel `Array<'MOVE'\|'WAIT'\|'PRESS'>`, **both indexed by the same `tick-1`** (lockstep, no phase offset) | **sequence × 2**, single shared PC |

**Read as physical fact, not narrative:** three genuinely different "what is the Program" answers already ship in this repo — (a) an inert array walked by an index (Firefly, Echo Chamber Bridge), (b) a pure function of a time argument that is never "stepped" at all (Echo Twin Waltz's `posAt`), (c) an array **re-scanned whole** every frame with no index (Mole Sensor). This is the empirical seed for Section 1 of the adversarial review.

---

## 2. Named Corrections to Round-1 Claims

Round 1 (delivered as chat analysis, not yet filed) asserted a near-universal "Guard → Mutate → Trace" convention. Direct re-read this round **falsifies "universal"**:

- `cross-model-kimi-k3/demo-02` (Firefly), `demo-03` (Echo Twin Waltz), `demo-06` (Prism Burrow): **zero** guard-rejection trace channel. Firefly has no precondition on `go` at all beyond arrival-distance; Echo Twin Waltz has no guard concept whatsoever (posAt is unconditional); Prism Burrow's only "guard" is a one-time validation at Run-click (`new Set(chain).size<3`), not a per-instruction guard.
- The guard+trace convention (`say(msg, isBad)` on every mutation) is a **spec-enforced house style unique to `blind-batch-001`** (its `SHARED_BRIEF.md` mandates it explicitly). Elsewhere it is either absent (kimi) or replaced by a structurally different mechanism (deepseek's pure-replay trace `events[]`, populated only at semantically important instants, not every instruction).
- **Verdict:** Guard-then-effect is a real, recoverable *shape* (see §4, `GuardedTransition`), but a dedicated per-firing trace log is a *policy choice* some puzzles adopt and others don't — it must not be baked in as mandatory engine ceremony.

Second correction — **the instruction tape is not always inert data.** `cmds[ci]` in Firefly Lamplighter is mutated *during* execution:

```js
c.dur-=dt;
if(c.dur<=0){cmds[ci]={op:c.op,dur:c.orig}; ci=(ci+1)%cmds.length;}
```

The countdown lives *inside* the program array itself, is decremented in place, and is restored from a cached `c.orig` after firing. This smuggles mutable runtime state into what should be inert instruction data. Contrast with deepseek's pure-replay demos, where nothing resembling this can exist — `SIM.run` recomputes everything from tick 0, so no instruction object could carry cross-call mutable state even if an author wanted it to. **This is a real, non-cosmetic architectural difference in defect-proneness between "direct mutation" and "replay-fold" discipline** — see `FRAMEWORK_ADVERSARIAL_REVIEW.md` §2.

Third finding — a live bug, useful precisely because it proves this is real, unedited, un-reviewed prototype code, not a tidy design narrative:

```js
lightSeg(0,COL[chain[0]? 'red':'red']);
```

Both ternary branches evaluate to the literal string `'red'`; `chain[0]` is never actually consulted. Harmless by coincidence (segment 0's true color is always `'red'` per the fold definition anyway), but it is dead, misleading code. Any claim this analysis makes about Prism Burrow's behavior is checked against what the code *does*, not what a reader would assume it does.

---

## 3. De-Sugar Docket — 4 Candidate Pseudo-Primitives

The Orchestrator asked whether `Sensor`, `Echo/Replay`, `Signal/Wire`, and `Inventory/Carrying` are irreducible. Evidence-first verdicts:

### 3.1 `Sensor`
**Evidence:** `cross-model-kimi-k3/demo-04`. `s1sel`/`s2sel` are UI-chosen indices into `pots[]`; the rule grammar can *only* say `if s1 < 50`, never `if p3 < 50` — `sVal=[pots[+s1sel.value].m, pots[+s2sel.value].m]`.
**Reduction:** a sensor is (a) a **stored** `StateCell` holding an index/address (`s1sel.value`), plus (b) an ordinary dereference inside a guard/rule expression (`pots[s1sel.value].m`). No traversal, no subscription mechanism, no push-notification — it's read-your-own-alias, evaluated fresh every scan. Cardinality limits ("only 2 sensors exist") are level content, not an engine concern.
**Verdict: KILLED.** Fully expressed by `StateCell` (stored, holding a reference) + ordinary expression evaluation, which any `GuardedTransition`/rule already requires.

### 3.2 `Echo / Replay`
**Evidence:** three structurally distinct real implementations —
- Echo Twin Waltz: **one** program (`segs`), sampled twice via the same pure `posAt(t)` at `t` and `t-D`. No second data structure exists.
- Echo Canyon: **two** programs — an authored/recorded `tape[10]` (looped, `tick%tape.length`) and a separately-logged `playerMoves[]` — both replayed through the *same* `SIM.run` kernel, cross-referenced only inside the guard for chasm/door passage (`if(isChasm(nx,ny)&&!bridgeDown)`).
- Echo Chamber Bridge: **two** programs on one shared, non-offset clock (`tick-1` indexes both), joined only by a derived boolean (`echoPressed && livePressed`).
- Replay Printshop (`blind-batch-001/demo-06`): a recorded 3-element array stored as `s.record`, later consumed by a `for` loop *inside a single instruction's effect* (`for(let k of s.record){ pull(k); }`) — this is not a second actor on the clock at all, it's a **subroutine call**.
**Reduction:** every case decomposes into {one or more `Directive` lists sharing a `Clock`} + {a `GuardedTransition` whose guard is permitted to read *other* directive-lists' current position/state as part of its precondition}. Replay Printshop additionally shows a `StateCell` is allowed to *hold* a `Directive`-shaped value, which a later transition iterates — still zero new primitives, just composition.
**Verdict: KILLED.** No independent "Echo" primitive exists. It is the single most valuable **composition pattern** in the corpus (see `PRIMITIVE_COMPOSITION.md` §3, family #10), not an atom.

### 3.3 `Signal / Wire`
**Evidence:** `cross-model-claude-sonnet-5/demo-04` (Blind Cave Fish): `computeDoorOpen(sensorOn){ let base = notToggle.checked ? !sensorOn : sensorOn; if(useTreasure.checked) base = base && treasureCollected; return base; }` — a straight-line boolean expression over named cells, re-evaluated on demand. `cross-model-deepseek/demo-05` (Dam): `for(const r of rules){ if(level<r.lt){ opening=r.open; break; } }` — first-match array scan, no graph. `cross-model-kimi-k3/demo-04`: same scan shape.
**Reduction:** none of these build a node/edge graph data structure or run a propagation/traversal algorithm at runtime. Every "wiring" instance found is a small named `StateCell` set plus a pure expression (or first-match array scan) recomputed every tick with **no persistent index structure**. Where this *does* diverge from the sequential model is real: there is no program counter, and the whole rule set is re-checked every tick rather than being consumed once.
**Verdict: PARTIALLY KILLED, PARTIALLY PROMOTED.** "Signal/Wire" as a *topology-graph* primitive is killed — never observed. But it does force a genuine, distinct **execution mode**: `Directive` needs a `scan` mode (re-evaluate the whole list every tick, no PC) alongside `sequence` mode (consume one item, advance PC) — this is not a new primitive, it is a mode flag on the one already-kept `Directive` primitive. See `PRIMITIVE_COMPOSITION.md` §1.3.

### 3.4 `Inventory / Carrying`
**Evidence:** `blind-batch-001/demo-03` (Clay Transcriber): `s.texture=a` (scalar overwrite) rendered via `className='character '+(s.texture...)`. `blind-batch-001/demo-08` (Cloud Doctor): `s.pocket.push(a)`, guarded by `s.pocket.length>=2`. `blind-batch-001/demo-02` (Echo Concierge): `s.memory=tones[s.pos]` (scalar).
**Reduction:** in every instance this is a `StateCell` (scalar or capacity-bounded array) namespaced under the actor, written by a `GuardedTransition` with a capacity guard, read by a later transition's guard. No generic `Relation(EntityA, EntityB, "contains")` triple-store is ever queried in reverse ("what contains X?"); nobody needs that generality.
**Verdict: KILLED.** Fully absorbed by `StateCell` + `GuardedTransition`, used under a specific *naming convention* (actor-namespaced field), not a new primitive.

---

## 4. Primitive Seeds Handed to Gamma

Surviving after this pass (formalized in `PRIMITIVE_COMPOSITION.md`):

1. `Clock` — monotonic tick index.
2. `StateCell` — named value; **stored** (mutated only via `GuardedTransition`) or **derived** (pure formula of `Clock` + already-committed stored cells, recomputed on read, never itself mutated).
3. `Directive` — tagged tuple `{op, args}` in an ordered list; **sequence** mode (PC-consumed) or **scan** mode (whole-list re-evaluated every tick).
4. `GuardedTransition` — `(State, firing) → {ok, State', TraceEntry}`.
5. `Log` — append-only `TraceEntry[]`; **observational** (side-channel audit trail) or **fold-authoritative** (the actual state at tick T *is* `fold(initial, log[0..T])`, empirically proven by `cross-model-deepseek`'s `SIM.run`).

A 6th candidate, `LawCell` (pure `f(Clock)→value`, proposed to explain `gAt(t)`/`posAt(t)`/ring-radius formulas), is carried forward to the adversarial review still on probation — Alpha's suspicion, confirmed in `FRAMEWORK_ADVERSARIAL_REVIEW.md` §3, is that it collapses entirely into `StateCell(derived)`.
