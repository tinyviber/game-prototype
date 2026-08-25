---
title: "coding-game 4D Process Description"
aliases: [coding-game process description, coding-game puzzle design process, coding-game 4D]
tags: [project, coding-game, ai-fluency, product-design, game-design, 4d-framework]
created: 2026-08-25
updated: 2026-08-25
status: draft
type: project-note
area: project
---

# coding-game · 4D Process Description

> [!abstract] 当前结论
> 本笔记记录 coding-game 在 4D Framework 的 **Description** 阶段中，对 **Process Description** 的当前设计。
>
> 核心变化是：**不再以 programming language 的知识点 / syntax taxonomy 作为关卡设计主线。**
>
> 玩家前台面对的应该是一个个具象、可理解、值得解决的 world puzzle；programming patterns / concepts 作为隐藏在这些 puzzle 下面的 computational skeleton，在玩家产生真实需求时自然出现。

---

# 核心原则

## 1. World Puzzle 是内容，Programming Pattern 是骨架

游戏不能按照下面的方式设计：

```text
Variable
→ 想一个“变量关”
→ 给变量套一个世界设定
→ 玩家完成变量练习
```

也不应该按照 Python / C++ 的语法章节顺序，把课程内容逐个游戏化。

更理想的结构是：

```text
Interesting world puzzle
        ↓
Player must make a real decision
        ↓
The world creates an information / state / control constraint
        ↓
Existing tools become insufficient or awkward
        ↓
A computational pattern becomes naturally useful
        ↓
Programming representation expresses the solution
```

因此：

> **Real-world / world-grounded puzzles are the visible content. Programming patterns are the invisible skeleton.**

这里的 “real-world puzzle” 不要求一定发生在现实生活中。

它也可以发生在机械城、洞穴、火车站、森林、工厂或 fantasy world 中。

关键是：

> 玩家首先理解的是这个世界发生了什么、自己要解决什么问题，而不是“这一关正在考察哪个 programming concept”。

---

## 2. 不把 Puzzle 与 Programming 做成 50 / 50 的并列内容

当前不采用：

> 60% puzzle + 40% programming lesson

这种显式配比。

更好的理解是两层：

### Surface — 玩家看到的层

**100% 是一个完整的 puzzle。**

玩家在想：

- 怎么把列车送到正确的轨道？
- 怎么在最后一道门前记住之前看到的符号？
- 怎么让机器根据货物的不同自动采取不同处理方式？
- 怎么让一个重复任务不再手动执行几十次？

### Substrate — 设计者看到的层

Puzzle 底下可能由以下 computational primitives 支撑：

- sequence；
- state；
- memory / variable；
- condition / branch；
- repetition / loop；
- function / abstraction；
- decomposition；
- generalization；
- algorithmic pattern。

因此 programming concept 不与 puzzle 抢占玩家注意力，而是成为 puzzle 能成立的内部结构。

---

# Puzzle Design Process

以后设计一关时，默认按照下面的 process 展开。

> [!important] 顺序约束
> **前四步禁止从某个具体 programming syntax / concept 出发。**
>
> 只有在 puzzle、player decision 和 world constraint 已经成立之后，才允许寻找 computational primitive。

---

## Step 1 — Start With an Interesting World Problem

首先完全暂时忘掉代码。

提出一个玩家可以直观理解的问题：

- 世界现在是什么状态？
- 玩家想让什么发生？
- 什么阻止目标直接完成？
- 玩家为什么需要思考，而不是单击一个按钮？

例如：

> 三列火车携带不同货物，只有部分轨道适合某类货物；玩家必须让分流系统自动把它们送到正确出口。

或者：

> 玩家会在洞穴的不同房间看到符号，但最终的门只在最后出现；之前的信息必须被保存并再次使用。

或者：

> 一台机器有多个联动部件，启动其中一个会改变其他部件状态，玩家需要找到正确操作策略。

第一轮判断：

> **If all code UI disappeared, is the core problem still worth solving?**

如果去掉 programming layer 以后，这个问题只剩“填正确代码”，则优先 reject / redesign。

---

## Step 2 — Define the Player Decision

关卡设计的基础单位优先是：

> **玩家必须做什么 decision？**

而不是：

> 这一关对应什么 knowledge point？

常见 decision 类型例如：

### Sequence

> 先做 A，还是先做 B？

例如：先拿钥匙还是先走到门口。

### Remember / Store

> 现在看到的信息以后还要用，我怎样让系统记住它？

### Conditional Decision

> 不同情况应该采用不同动作。

例如：易碎货物走安全路线，普通货物走快速路线。

### Repetition

> 同一个规则是否应该持续执行，直到某个条件结束？

### Decomposition

> 这个复杂目标能不能拆成几个更小的可复用任务？

### Generalization

> 我的程序是在解决当前这一个场景，还是能够解决一类场景？

Puzzle 必须至少包含一个真实的 player decision，而不是要求玩家猜作者预设的代码排列。

---

## Step 3 — Define Information and World Constraints

分析玩家为什么不能直接得到答案。

重点描述：

- 玩家现在能观察到哪些信息；
- 哪些信息会随运行变化；
- 哪些信息需要被保存；
- 哪些信息直到 runtime 才能知道；
- 哪些动作会改变 world state；
- 是否存在资源、时间、路线、次数或 visibility constraint；
- 失败以后，世界会留下什么可观察证据。

这一步的意义是让 computational need 来自世界本身。

例如：

```text
cargo type only becomes known at runtime
        ↓
player cannot hard-code one fixed route
        ↓
a decision rule is genuinely required
```

这时 branch 才有自然存在的理由。

---

## Step 4 — Design the Feedback Loop

关卡不能只定义“正确答案”，还要定义玩家如何通过失败获得信息。

默认 gameplay loop：

```text
Observe
→ Predict
→ Program
→ Run
→ Inspect world change
→ Update mental model
→ Repair
→ Run again
```

重点是：

> **Every meaningful program change should create a meaningful observable world change.**

失败应尽量通过世界本身解释：

- 火车驶入错误路线；
- 门没有打开；
- 某个数据被覆盖；
- 角色走到目的地却缺少必要物品；
- 机器在第三次操作时出现不同状态；
- 数据 token 被送到错误节点。

文字 error message 可以辅助，但不应该承担主要解释职责。

---

## Step 5 — Discover the Computational Primitive

前四步成立以后，才问：

> **What computational primitive naturally solves this problem?**

例如：

```text
不同 cargo → 不同 route
→ conditional / branch
```

```text
早期房间看到 symbol，后面才使用
→ state / memory / variable
```

```text
重复执行同一组动作几十次
→ loop / repetition
```

```text
同样的一串逻辑不断出现
→ function / abstraction
```

这里不是强制一个 puzzle 必须引入新 concept。

很多 puzzle 应该只是在重新组合、迁移和深化旧能力。

---

## Step 6 — Use the Minimum Programming Representation

找到 computational primitive 后，再决定玩家需要看到 / 操纵多少 programming representation。

原则：

> **Use the minimum representation needed to express the player's idea clearly.**

例如一个 branch 可以先表现为：

```text
IF cargo == fragile
    → safe_route
ELSE
    → fast_route
```

随着 ownership 增加，再逐渐接近真实代码：

```python
if cargo == "fragile":
    go("safe_route")
else:
    go("fast_route")
```

Programming language 应该逐渐成为：

> **一种精确描述世界规则的 notation。**

而不是玩家进入游戏后首先要面对的学习对象。

---

## Step 7 — Test Whether the Pattern Is Actually Necessary

设计完成以后反问：

> 如果删掉这个 programming pattern，puzzle 还能不能成立？

以及：

> 玩家是否真的因为 world constraint 需要它，而不是因为设计者想教它？

理想状态：

> 玩家先遇到限制，再主动产生“我需要一种新能力”的需求。

例如 loop 最好的 introduction 不一定是“新技能：循环”，而是玩家已经手写了很多次：

```python
move()
move()
move()
move()
move()
```

此时 repeat / loop 出现，会产生：

> “原来还可以这样。”

甚至：

> “你怎么不早给我这个？”

---

# Hidden Curriculum

## 1. 玩家不看 Curriculum，但设计者必须维护 Curriculum

Puzzle-first 不等于放弃 progression。

如果只凭“这个 puzzle 好像挺有趣”不断生成关卡，容易出现：

- 连续很多关其实只重复 sequence；
- branch 突然出现且难度过高；
- 某些 pattern 很久没有 resurfacing；
- 一个 puzzle 同时引入太多新概念；
- learning curve 无法控制。

因此 curriculum 应该存在，但隐藏在后台。

可以内部维护类似：

| Puzzle | Sequence | State | Memory | Branch | Loop | Abstraction |
| --- | --- | --- | --- | --- | --- | --- |
| A | ● |  |  |  |  |  |
| B | ● | ● |  |  |  |  |
| C |  | ● | ● |  |  |  |
| D |  | ● |  | ● |  |  |
| E |  | ● | ● | ● |  |  |
| F |  |  | ● | ● | ● |  |

玩家看到的是：

> 火车、洞穴、宝箱、机器、河流、商店、机关……

设计者看到的是：

> capability dependency + resurfacing + recombination。

一句话：

> **Visible puzzle progression + invisible computational progression.**

---

## 2. Ability Graph 与 Puzzle Graph 分离

内部至少维护两张图：

### Ability Graph

表达能力之间的 prerequisite：

```text
Action
→ Sequence
→ State
→ Branch
→ Repetition
→ Composition
→ Abstraction
→ Generalization
```

这里只是示意，不固定最终顺序。

### Puzzle Graph

表达玩家实际经历的世界问题、难度和解锁关系。

Puzzle Graph 不应该简单等于 Ability Graph。

一个 puzzle 可以：

- 只使用旧 pattern；
- 组合多个旧 pattern；
- 引入一个新能力；
- 把旧能力放到完全不同的 context 中进行迁移；
- 允许 dumb solution，同时暗示更高阶 pattern。

---

# Programming Pattern as Player Power

新的 programming construct 不以“知识点”的身份出现，而以新的能力出现。

例如：

### Variable / Memory

不是：

> 学习变量。

而是：

> **现在你可以让世界记住东西。**

### Branch / Conditional

不是：

> 学习 if。

而是：

> **现在你的规则可以根据情况自己做决定。**

### Loop

不是：

> 学习循环。

而是：

> **现在你可以让世界自动重复工作。**

### Function / Abstraction

不是：

> 学习函数。

而是：

> **现在你可以把一套行为命名、保存并重复调用。**

这使 progression 更像游戏中的 ability unlock，而不是 curriculum unlock。

---

# Puzzle Rejection Rules

以后无论由人还是 AI 设计 puzzle，都需要主动进行以下 rejection checks。

## Check 1 — Is it interesting without the programming lesson?

必须回答：

> **Why is this puzzle interesting without the programming lesson?**

如果主要答案是：

> 因为玩家可以学习变量 / if / loop。

则 reject。

---

## Check 2 — Does the world naturally require the pattern?

必须回答：

> **Why does this world problem naturally require this computational pattern?**

不接受：

> 为了让玩家练习 if。

更合理的回答类似：

> 货物类型直到运行时才确定，因此玩家无法提前写死路线；系统必须读取 cargo state，并根据条件选择路径，所以 branch 是这个问题自然需要的能力。

---

## Check 3 — Is there a real player decision?

如果玩家只是在：

- 找唯一正确排列；
- 填一个明显的空；
- 根据教程复制代码；
- 猜设计者希望使用哪个 syntax；

则 puzzle quality 存疑。

至少应该存在：

> observation → hypothesis → decision → feedback

中的有效思考。

---

## Check 4 — Does failure teach something?

失败后玩家应该至少获得一条新的 world information。

如果失败只得到：

> Wrong. Try again.

说明 feedback loop 太弱。

---

## Check 5 — Are we adding unnecessary concepts?

一个 puzzle 只需要 state，就不要为了“丰富教学内容”再塞 branch。

优先：

> **minimum necessary computational complexity**

而不是：

> maximum concept coverage。

---

# AI 在 Puzzle Design 中的 Process Description

当 AI 参与设计关卡时，默认要求它按以下顺序工作，而不是直接生成“编程题”。

1. 提出若干 **world-grounded puzzle premises**；
2. 对每个 premise 明确玩家真正的 decision；
3. 分析 information / state / resource constraints；
4. 设计 Run → Inspect → Repair feedback loop；
5. 判断已有 player abilities 是否足以解决；
6. 如果存在自然 capability gap，再识别最合适的 computational primitive；
7. 给出 minimum programming representation；
8. 检查是否允许 multiple solutions / dumb solutions；
9. 执行 Puzzle Rejection Rules；
10. 最后才讨论 implementation / UI / syntax。

AI 应主动避免：

- 从 Python / C++ chapter list 出发；
- “今天教变量，所以设计一个变量关”；
- 为 programming concept 强行创造 lore；
- 把 worksheet 换皮成游戏；
- 用大量文字解释原本应该由 world feedback 表达的因果；
- 默认每一关必须引入一个新 concept；
- 为了 curriculum coverage 同时塞入多个不必要机制。

---

# 与 Product Description 的关系

[[coding-game 4D Product Description]] 已经确定：

> **Puzzle first, concept second.**

本 Process Description 将这个 product principle 进一步转化成实际工作方式：

```text
World Puzzle
→ Player Decision
→ Information / State Constraint
→ Feedback Loop
→ Computational Primitive
→ Minimum Programming Representation
→ Rejection Check
→ Integrate into Hidden Curriculum
```

因此两篇笔记的关系可以理解为：

- **Product Description**：我们最终想做成什么产品；
- **Process Description**：我们以后应该按照什么顺序设计 puzzle 与 progression，才能持续逼近这个产品。

---

# 当前下一步

- [ ] 建立第一版 **Ability Graph**，但避免直接复制 Python / C++ curriculum；
- [ ] Brainstorm 一批完全不考虑 programming syntax 的 world puzzle premises；
- [ ] 为每个 puzzle 标记 player decision 与 world constraint；
- [ ] 再反向标记其中自然需要的 computational primitives；
- [ ] 找出 3–5 个最适合作为 early-game vertical slice 的 puzzle；
- [ ] 用 Puzzle Rejection Rules 进行第一轮 Discernment；
- [ ] 开始第一个 Description → Discernment → Refine → Integrate loop。

---

# 关联

- [[Coding Game - 4D Delegation]]
- [[coding-game 4D Product Description]]
- [[4D Framework]]
- [[Description]]
- [[Discernment]]
- [[Description-Discernment Loops]]
