---
title: "Coding Game — 4D Delegation"
status: draft
created: 2026-08-24
updated: 2026-08-24
type: project-note
---

# Coding Game — 4D Delegation

> [!abstract] 当前结论
> 本笔记记录 coding-game 重启设计中，基于 4D Framework 的 **Delegation（授权 / 工作划分）** 阶段。
>
> 当前阶段已经获得粗略 **approval**：由人负责产品方向、教育判断、taste 与最终拍板；AI 负责扩大搜索空间、生成方案、研究、批判、实现规划与大量可机械化工作；部分产品机制由双方 collaboration 后再由人最终决定。

---

## 1. 为什么这个游戏存在？

Programming 对低龄少儿来说往往过于抽象，也缺少足够自然的方式调动他们的主观能动性。

因此，这个游戏不是为了在低龄阶段完整教授 Python，也不是为了把传统编程课程换成游戏皮肤，而是为了提供一个 **initial nudge**：

> 在孩子还小的时候，让 programming 以一种可玩、可观察、可试错、可获得成就感的方式提前进入他们的认知世界。

理想状态不是“学完一套语法”，而是让他们以后真正接触编程时，不再觉得代码是一种陌生、吓人的符号。

---

## 2. 玩家是谁？

核心玩家是：

- 低龄少儿；
- 尚未系统接触 programming；
- 对抽象的变量、控制流、状态等概念未形成稳定 mental model；
- 更容易被世界、角色、谜题、即时反馈和成就感驱动，而不是被课程目标驱动。

因此产品不能默认玩家已经愿意“学习编程”。

产品要先让他愿意 **solve the next puzzle**。

---

## 3. 玩家应该获得什么感觉？

### 3.1 游戏体验

最开始可以只有简单的指令和非常直观的操作，与常见儿童游戏没有明显门槛。

随着游戏深入，玩家逐渐理解：

> 这款游戏的本质是 solving puzzles。

当玩家点击“下一关”时，理想的 expectation 是：

> **OK, I will solve the next puzzle.**

而不是：

> “下一课又要学什么知识点？”

因此产品原则是：

> **Puzzle first. Programming second. Education third.**

### 3.2 UI / 视觉感受

UI 应该：

- 友好；
- 好看；
- 有角色和世界感；
- 不死板；
- 不做强烈 geek / hacker / terminal 风格；
- 不让玩家感觉自己一打开就在使用 IDE 或刷题网站。

推荐的组合是：

> **Friendly world + authentic code**

世界可以 playful，代码本身则逐渐保持真实。

### 3.3 核心情绪

最重要的情绪不是“我学会了一个术语”，而是：

> **I can figure this out.**

以及解开 puzzle 后产生的成就感。

---

## 4. 核心学习目标

这款游戏不需要在每个阶段都有传统课程意义上的明确教学目标。

更重要的长期目标是：

> 玩家不会对 code snippets 感到陌生，而是产生“我见过这东西”“这东西我大概知道是在干嘛”的亲切感。

因此首要目标是：

> **Code familiarity > Code mastery**

希望形成的心理变化：

```text
陌生
→ 眼熟
→ 亲切
→ 愿意碰
→ 愿意试错
→ 能主动调用曾见过的 pattern
```

玩家以后看到例如：

```python
if energy > 3:
    open()
```

或：

```python
energy = energy + 1
```

第一反应不应该是“这是什么”，而应该是：

> “哦，这个我见过。”

---

## 5. Core Loop

当前推荐的核心循环：

```text
Observe
→ Edit
→ Run
→ Inspect
→ Repair
→ Win
```

即：

1. 看世界；
2. 理解当前 puzzle；
3. 修改程序 / 指令；
4. Run；
5. 观察世界如何严格执行；
6. 找出结果与预期之间的差异；
7. 修正；
8. 成功。

这里最关键的环节不是 Edit，而是：

> **Run → Inspect**

玩家需要不断建立一种 programming intuition：

> 我告诉机器做什么 → 机器真的这样做 → 结果和我想的不一样 → 问题可能在我的程序 / 思考中 → 我再改。

因此有一个底层 design principle：

> **任何 code change 都必须产生清晰、即时、可观察的 world change。**

如果代码发生变化，但玩家很难理解世界究竟哪里变了，那么这个 mechanic 就没有很好地服务产品目标。

---

## 6. 间隔重复与主动回忆

游戏需要刻意设计：

- spaced repetition；
- positive / active recall；
- pattern resurfacing。

但不能显式做成：

> “第 12 关：复习 if。”

否则会重新变成课程。

更合适的方式是：

> **让旧 pattern 在新的 puzzle / 世界语境中重新出现。**

例如第一次出现：

```python
if key == "blue":
    open()
```

几关之后换成：

```python
if temperature < 0:
    freeze()
```

表面情境不同，但底层结构相同。

玩家需要主动产生：

> “这个是不是之前见过？”

---

## 7. Pattern Ownership Progression

一个 programming pattern 不应该一次性“教完”，而应该逐渐把 ownership 从游戏交给玩家。

### Level 0 — Exposure

玩家不用写代码。

例如点击“向前”时，界面同步出现：

```python
move()
```

代码从第一关就存在，但一开始只是被观察。

### Level 1 — Recognition

玩家从几个已有 snippet 中识别正确的：

```python
move()
turn_left()
open()
```

目标是视觉识别，而不是 syntax recall。

### Level 2 — Reconstruction

开始出现部分空缺：

```python
move()
____()
open()
```

或者通过拖动 / 组合 fragment 完成程序。

### Level 3 — Retrieval

逐渐减少 scaffold，让玩家主动恢复以前见过的 pattern。

### Level 4 — Composition

将多个已经熟悉的 pattern 组合起来解决新 puzzle，例如：

```python
energy = energy + 1

if energy > 3:
    open()
```

此时才真正进入更接近 programming 的组合能力。

---

## 8. Echo Puzzle（回声关）

当前推荐把 **Echo Puzzle** 作为一个重要的内部关卡设计机制。

玩家端不一定显示“回声关”这个名字。

它的核心规则：

> 一个新关卡在视觉和故事上看起来完全不同，但解法隐藏着几关以前已经见过的 pattern。

例如：

- Level 4：第一次完整展示某个条件 pattern；
- Level 7：换 context 后再次出现；
- Level 12：只留下部分 scaffold；
- Boss：与其他 pattern 组合，不再显式提示。

设计目标是让玩家产生：

> “啊，这个我会。”

而不是：

> “老师让我复习。”

一句话：

> **Spaced retrieval disguised as level design.**

---

## 9. Progression：不再把课程 taxonomy 直接暴露给玩家

原先的：

```text
Flow → Memory → Choice
```

可以继续作为内部 curriculum tags，但不建议作为玩家感受到的产品骨架。

当前推荐 progression：

### Phase A — Command

程序就是“告诉东西做事情”。

```python
move()
turn()
pick()
```

形成：

> code → behavior

### Phase B — Sequence

让玩家理解：

> order matters

例如：

```python
pick()
move()
open()
```

### Phase C — State

引入世界中可以被保存和改变的状态：

```python
energy = 1
energy = energy + 1
```

形成：

> program remembers things

### Phase D — Choice

```python
if energy > 3:
    open()
```

形成：

> program can make decisions

### Phase E — Repetition

先让玩家感受到重复操作的痛苦，例如：

```python
move()
move()
move()
move()
move()
```

然后再出现类似：

```python
repeat(5):
    move()
```

让新的 construct 成为一个已经存在的问题的解决方案。

### Phase F — Composition

将旧 pattern 组合，用于解决真正复杂一些的 puzzle。

---

## 10. Need Before Explanation

一个新的 programming construct 不应该以“今天学习 X”的形式出现。

应该先让玩家感受到一个问题，然后再让新的 construct 成为解决方案。

例如：

### 不推荐

> 新技能解锁：变量。

### 推荐

玩家先意识到：

> “我需要把这个 energy 保存下来。”

然后出现：

```python
energy = 3
```

同理，loop 不是因为课程进度到了才出现，而是因为玩家已经厌烦手写大量重复动作。

理想情绪甚至应该是：

> “你怎么不早给我这个？”

---

## 11. Real Code 的出现方式

当前建议：

> **真实代码从第一关就出现。**

但是玩家对代码的 ownership 逐步增加。

不要使用：

```text
前几十关 block programming
→ 某一天突然切换成 Python
```

否则会制造第二次学习门槛。

可以从：

```text
观察代码
→ 选择 snippet
→ 重排代码
→ 补 fragment
→ partial typing
→ constrained composition
```

逐步过渡。

第一大阶段结束时，做到 partial typing / constrained composition 已经足够，不急于提供完整 IDE。

---

## 12. Curriculum 名称尽量隐藏在后台

内部可以标记：

```text
concept: condition
concept: variable
concept: loop
```

但玩家前台不一定需要看到：

> “条件结构”

更自然的是：

> “只有电量足够，大门才会打开。”

先让玩家会使用和识别，再让他以后知道这个 pattern 在 programming 中叫什么。

---

## 13. 机械城与旧项目资产

现有 `coding-game` 不需要删除，也不应该从技术层面完全推倒重来。

当前可以把它视为：

> **v0 mechanics prototype**

### 可以继续保留 / 值得复用

- Run / Pause / Step / Reset；
- code 与 world event 同步；
- Canvas / animated world；
- instruction 驱动的 runtime；
- data-driven level；
- 世界状态可观察；
- code line 与执行反馈映射。

这些已经证明了技术可行性。

### 暂时视为 untrusted product assumptions

- 当前 8 个旧关卡；
- relay_core 等具体故事；
- deliver semantics；
- Flow / Memory / Choice 作为玩家看到的 chapter；
- 当前旧 PRD 中的大量 gameplay assumption。

不是立即删除，而是：

> **not grandfathered in**

所有旧设计重新接受一次问题：

> Does this serve the North Star?

### 机械城视觉

当前倾向：

> **保留 mechanical world / robot 的视觉概念，但不继承旧 lore debt。**

原因是 robot / machine 天然适合表现：

```text
instruction → action
```

---

## 14. 第一个新版 Vertical Slice

因为核心设计已经包含 spaced retrieval，所以只有一个 puzzle 不足以验证产品理念。

当前推荐第一版做一个：

> **8-level micro campaign**

目的不是“教完三个知识点”，而是验证核心体验。

### Level 1–2

建立：

> code causes behavior

### Level 3

第一次 introduction 某个 pattern。

### Level 4

换一个 mechanic / context。

### Level 5

第一次 Echo Puzzle，测试玩家是否仍能识别 Level 2/3 中见过的结构。

### Level 6

引入新 pattern。

### Level 7

旧 pattern + 新 context。

### Level 8

小型 boss：组合两个以前出现过的 pattern。

如果玩家在这里产生：

> “啊，这个我知道！”

那么这个 prototype 就验证了非常关键的一部分产品假设。

---

## 15. AI 应承担的角色

AI 不是产品 owner。

AI 更适合承担：

- programming concept research；
- 同类产品 research；
- mechanic brainstorming；
- 大量 puzzle variant generation；
- spaced retrieval scheduling；
- progression 草案；
- UI reference research；
- 技术 architecture 建议；
- Codex implementation；
- test / regression；
- 对关卡进行批判性 review；
- 扩大候选方案空间。

---

## 16. Human 应承担的角色

必须由人最终负责：

- 为什么做这个游戏；
- 玩家是谁；
- 教育理念；
- 什么样的体验值得追求；
- 什么叫“好玩”；
- UI taste；
- puzzle 是否真的有趣；
- aha moment 是否成立；
- 哪些 mechanic 最终保留；
- 最终 product direction；
- 最终责任与判断。

核心原则：

> **taste / pedagogy / product judgment 不 delegate。**

---

## 17. Collaboration Tasks

以下工作适合 Human + AI collaboration，再由 Human 最终拍板：

- progression 最终顺序；
- core loop 的具体落地形式；
- mechanic 取舍；
- 每个 puzzle 的 aha moment；
- spaced retrieval 的间隔安排；
- scaffold 减少速度；
- 机械城世界具体视觉与交互；
- 玩家从操作 UI 过渡到真实 code 的节奏。

目前讨论出的方案已经获得粗略 approval，可以作为下一阶段工作的默认起点。

---

## 18. AI 的第二角色：Adversarial Designer

AI 不能只负责“想关卡”，还应该主动负责：

> **找出这个关卡为什么可能不好玩。**

每个 puzzle 可以自动执行一次 Puzzle Audit：

- 玩家不看长篇文字，能否理解目标？
- 是否只有一个无聊的机械操作？
- 是否真的需要思考？
- failure 是否能从世界反馈中理解？
- 是否存在“猜设计者答案”的问题？
- programming concept 是否自然出现？
- 是否只是 worksheet 换皮？
- 有没有产生 recall？
- 是否在重复旧 pattern，同时改变了 context？
- success 有没有足够明显的 payoff？

AI 可以大量、机械化地执行这些 review。

Human 做最终 taste judgement。

---

## 19. Delegation Matrix

| 工作 | Owner |
|---|---|
| 为什么做 | Human |
| 玩家是谁 | Human |
| 最终体验价值 | Human |
| 教育理念 | Human |
| programming concepts research | AI |
| 同类游戏 research | AI |
| mechanic brainstorming | AI |
| puzzle variants | AI |
| spaced retrieval scheduling | AI 主导 |
| progression 初稿 | AI |
| core loop 初稿 | AI |
| UI reference research | AI |
| 技术 architecture | AI / Codex |
| 实现 | Codex |
| tests / regression | Codex |
| puzzle 是否好玩 | Human final judgement |
| UI taste | Human final judgement |
| mechanic 最终取舍 | Collaboration → Human 决策 |
| progression 最终顺序 | Collaboration → Human 决策 |
| aha moment 是否成立 | Collaboration → Human 决策 |
| 最终 product direction | Human |

---

## 20. 当前已粗略 Approval 的 Collaboration Decisions

### A. Real code 什么时候出现？

**Approval：第一关就出现。**

但早期以观察、自动生成、选择和重排为主，之后逐步增加 ownership。

### B. 是否继续机械城？

**Approval：保留视觉概念，不保留 lore 债务。**

### C. 玩家最终是否需要自由输入代码？

**Approval：第一大阶段不急于完整自由输入。**

partial typing / constrained composition 足够。

### D. 是否在玩家前台显示“变量 / 条件 / 循环”等课程名称？

**Approval：尽量不显示。**

让玩家先解决世界问题、认识 pattern，再在必要时理解 terminology。

---

## 21. Delegation 阶段当前状态

当前可以认为 Delegation 已经完成第一版。

它完成了：

1. 明确 project goal；
2. 明确 player；
3. 明确 desired experience；
4. 明确长期 learning outcome；
5. 明确哪些工作由 Human 负责；
6. 明确哪些工作 AI 可以大量承担；
7. 明确哪些工作需要 collaboration；
8. 对核心 loop、progression、recall、code exposure、mechanical world 等方向进行了第一轮 approval。

下一步不应该立即让 Codex 重写整个项目。

下一阶段进入 4D Framework 的第二个维度：

> **Description**

建议只描述一个有限任务：

> **设计新版 8-level vertical slice。**

然后为它明确：

- Product Description；
- Process Description；
- Performance Description；

并进入：

```text
Describe
→ Discern
→ Refine
→ Integrate
```

循环。
