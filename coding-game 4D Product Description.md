---
title: "coding-game 4D Product Description"
aliases: [coding-game product description, coding-game 4D]
tags: [project, coding-game, ai-fluency, product-design, 4d-framework]
created: 2026-08-24
updated: 2026-08-24
status: draft
type: project-note
area: project
---

# coding-game · 4D Product Description

> [!abstract] 当前阶段
> 本笔记记录 coding-game 在 4D Framework 的 **Description** 阶段中，已经形成的 Product Description 草稿，以及当前对 Process Description 的少量核心约束。
>
> **Product Description 已初步收敛；Process Description 暂不定稿。**

## 一句话愿景

我们希望做一个**极简、以世界为反馈界面的 programming puzzle game**。玩家通过组合一套逐渐扩展的可视化编程语言控制角色与世界。

每个新的编程概念都不是作为课程内容被直接介绍，而是在一个现有工具无法优雅解决的新 puzzle 中，作为新的“能力 / weapon”被玩家发现和掌握。

游戏允许多种有效解法，并逐渐从“让程序工作”推进到“让程序更简洁、更通用”。

---

# Product Description

## 1. Homepage

Homepage 应尽量简洁，更像 puzzle game，而不是 educational SaaS landing page。

当前偏好的方向：

- 纯色或极简背景；
- 中间是游戏 title；
- title 下方是 main character 的一个招牌动作 / 标志性姿态；
- 一个非常明确的 `PLAY` / `CONTINUE` 入口；
- 尽量避免 feature cards、宣传式三栏布局、复杂 navbar、大段“学习编程”说明。

Homepage 首先应该向用户传达：

> **这是一个 game。**

而不是：

> 这是一个教育软件或课程平台。

---

## 2. 核心产品定位：Puzzle First, Concept Second

游戏不是先决定“这一关教变量 / 循环 / 分支”，然后再给这个知识点套一个故事。

更希望采用相反的顺序：

1. 先给玩家一个真正需要解决的 puzzle；
2. 玩家尝试使用已有能力解决；
3. 当已有工具无法解决，或只能用非常笨拙的办法解决时，引入新的 programming concept；
4. 新概念成为玩家获得的一种新的 **weapon / ability**；
5. 玩家通过实际使用它解决问题，而不是先接受定义再做练习。

核心原则：

> **Programming concepts are weapons, not lessons.**

例如：

- 如果必须记住某个数据，玩家自然产生“我需要记住它”的需求，再获得 variable / memory；
- 如果相同程序面对不同输入必须采取不同动作，玩家自然产生“程序需要自己判断”的需求，再获得 conditional / branch；
- 如果大量重复动作让玩家感到笨拙，再获得 loop / repeat；
- 如果相同逻辑不断重复，再引导 function / abstraction。

---

## 3. Programming Workbench：可组合性优先

当前原型的 interaction 主要是：

- 给定若干预设 function / code snippet；
- 修改少量参数；
- 调整顺序；
- Run。

这种方式的问题是 **composability 太低**。玩家更多是在排列已有答案，而不是构造程序。

Blockly / Scratch 最值得借鉴的地方，不一定是它们的具体视觉 UI，而是它们已经解决了一个重要问题：

> 如何把 programming language 拆成可以 manipulate、nest、compose 的 primitives。

因此当前 Product Description 不强制最终前端一定使用 Blockly，但要求核心交互至少具备 **Blockly-level composability**。

可能的视觉形式可以继续探索：

- blocks；
- cards；
- magnetic tokens；
- wiring nodes；
- command chips；
- timeline；
- flow graph；
- 或其他自定义 visual programming language。

但必须支持从 primitive 到组合、嵌套、复用，而不能退化为“几条写好的代码只让玩家排序”。

> [!question] 待探索
> 是否直接使用 Blockly？
>
> 是否能设计一种比传统 Blockly games 更方便、更适合 puzzle game 的 visual programming language？

---

## 4. The Program Is the Controller

玩家控制世界的主要 interface 应该是程序本身。

重要行为尽量通过程序表达，而不是允许玩家绕过程序直接拖动角色、直接完成目标。

世界负责呈现结果，Programming Workbench 负责表达控制逻辑：

```text
World → 玩家观察问题
      ↓
Programming Workbench → 构造程序
      ↓
Run
      ↓
World → 可观察反馈
      ↓
玩家修改程序
```

这个循环本身应该成为核心 gameplay loop。

---

## 5. Language Grows With the Player

不要一开始就给玩家一个完整 IDE 或完整 Blockly toolbox。

玩家拥有的 programming language 应随着游戏过程逐步成长。

粗略 progression 示例：

```text
Actions
  ↓
Sequence
  ↓
Repeat / Loop
  ↓
Memory / Variable
  ↓
Choice / Conditional
  ↓
Nested Logic
  ↓
Function / Abstraction
  ↓
Parameter
  ↓
Generalization / Optimization
```

这里不是课程章节的最终顺序，只表达一个原则：

> **不仅 puzzle 在升级，玩家可使用的语言本身也在升级。**

玩家最好不需要看到“Chapter 3: Variable”这种教学式结构。

更理想的体验是：

> 这里出现了一个新的问题 → 旧工具不够用了 → 获得新工具。

---

## 6. Dumb Solutions Are Valid

只要逻辑成立，就尽量允许玩家用笨办法解决问题。

例如一个本来适合 loop 的 puzzle，玩家如果愿意手动重复 30 次操作，仍然可以完成任务。

游戏不必强制：

> “本关必须使用循环。”

而可以通过后续反馈或挑战，让玩家自己发现 abstraction / optimization 的价值。

因此关卡可以存在多层成功：

### Solve

世界目标被实现。

### Simplify

同样结果能否用更短、更清晰、更优雅的程序实现？

### Generalize

环境或输入变化之后，程序是否仍然工作？

游戏后期可以逐渐从：

> 写一个能通过当前场景的程序

转向：

> 构造一个能够处理一类场景的程序。

---

## 7. Execution Should Be Spatially Observable

世界本身应该承担很大一部分 debugger / feedback 的职责。

尽量避免主要依赖文字错误提示：

```text
ERROR: You must pickup the core before delivery.
```

更希望玩家直接从世界事件看出失败原因：

- 角色空手到达插槽；
- 门根据比较结果走向另一条线路；
- token / data 在节点之间流动；
- 角色的动作、状态、表情体现当前程序执行结果。

核心原则：

> **Execution should be spatially observable.**

程序不是黑盒运行后给一个 pass / fail，而应该尽可能让每一个重要因果都能被玩家看到。

---

## 8. Main Character 的作用

Main Character 不必承担大量 lore 或解释文本。

更重要的职责包括：

1. **世界反馈媒介**：通过动作和表情表达成功、困惑、失败、等待等状态；
2. **情感连续性**：世界和 programming concepts 不断变化，但角色持续陪伴玩家；
3. **教程替代品**：用视线、动作、反应提示可交互对象，尽量减少 modal tutorial。

---

# Product Principles

当前先固定以下原则作为后续设计的判断尺子：

1. **Puzzle first, concept second.**
2. **Programming concepts are tools / weapons.**
3. **Composition over configuration.**
4. **The program controls the world.**
5. **Execution is visible.**
6. **Dumb solutions are valid.**
7. **The language grows with the player.**
8. **Minimal game, not educational software.**

这些原则比当前具体关卡、故事设定、某一种 UI 实现优先级更高。

---

# Process Description — 当前仅记录核心约束

> [!warning] 暂不定稿
> 目前还没有能力在短时间内把完整 Process Description 定义清楚，因此这里不强行补全，只保存已经比较确定的 process constraints。

## 1. Process 的出发点不是某个具体编程语言

后端的 curriculum / progression 设计，不应该首先从 Python、C++ 或某一门语言的语法目录出发。

我们首先要回答的是：

> **What we want users to gain during their game journey?**

重点是基础且具有迁移性的 programming concepts / problem-solving abilities，例如：

- imperative / sequence；
- conditional / branching；
- loops / repetition；
- state / memory / variables；
- abstraction；
- decomposition；
- algorithms / patterns；
- problem solving 的组织能力；
- 将现实问题转换成可执行步骤的能力；
- 将具体解法抽象成可复用规则的能力。

因此不强制语言一定映射为 Python 或 C++。

核心目标是让玩家获得：

> **逻辑能力、抽象能力、problem solving 的组织能力。**

---

## 2. 先设计能力成长，再设计关卡

Process 应沿着玩家能力培养方向展开，而不是先堆关卡。

一个可能的工作方向：

1. 定义玩家整个 journey 中希望获得哪些基础能力；
2. 分析这些能力之间的 prerequisite / dependency；
3. 决定每个阶段玩家当前已经拥有的 weapons / patterns；
4. 设计新的 puzzle，使已有能力能够被组合使用；
5. 当某个新 puzzle 与玩家现有能力之间产生合适的 gap 时，引入新的 pattern / weapon；
6. 通过后续 puzzle 让新能力与旧能力组合，而不是学完即弃。

因此新概念出现的节奏，不只是由传统 curriculum 顺序决定，还要看：

> **每一个 new puzzle 距离玩家获得某个新 pattern / weapon 的间隔，以及当前 puzzle 需要组合哪些已有能力。**

这意味着 progression 本质上需要同时设计：

- ability graph；
- puzzle graph；
- tool / weapon unlock sequence；
- old + new capability recombination。

---

## 3. 当前暂不解决的问题

未来几天重点思考：

- [ ] 是否应该直接使用 Blockly；
- [ ] 能否 design 一种自己的 visual programming language；
- [ ] 自定义 visual programming language 是否可能比 Blockly games 更方便；
- [ ] 玩家整个 game journey 中真正需要获得哪些 programming / problem-solving abilities；
- [ ] 这些能力之间应该如何形成 dependency graph；
- [ ] 如何根据 ability gap 设计 puzzle 与 weapon unlock；
- [ ] 如何避免关卡退化成“为了教知识点而设计的练习题”。

---

# 关联

- [[4D Framework]]
- [[Description]]
- [[Delegation]]
- [[Description-Discernment Loops]]
