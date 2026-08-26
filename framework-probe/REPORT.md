# framework-probe implementation report

## 1. 最终分层与 LOC

最终分层如下。LOC 是当前源码的物理行数，包含注释和空行，不是估算的有效代码行数。

| 分层 | 目录 | LOC | 内容 |
| --- | --- | ---: | --- |
| Core | `src/core/` | 70 | `types.ts`、`kernel.ts`、`view.ts`，以及供现有测试导入路径使用的 3 行 `query.ts` 兼容导出 |
| Standard Adapters | `src/rendering/`、`src/services/` | 97 | Pixi 宿主、tick driver、history 服务 |
| Level-Specific | `src/probes/` | 1551 | 四个 probe 各自的 main、simulation、view renderer、UI 和必要的 topology |
| Shared presentation | `src/ui/shared.css` | 81 | 共享 DOM/UI 样式，不计入三层 TypeScript |
| **TypeScript 合计** | `src/**/*.ts` | **1718** | Core + Standard Adapters + Level-Specific |
| **src 合计** | `src/` | **1799** | TypeScript 加共享 CSS |

按 probe 的 Level-Specific 明细是：Echo 292 LOC、Dam 304 LOC、Mimic Moss 534 LOC、Spore 421 LOC。数字由下面的命令生成，便于复核：

```bash
cd /Users/wj/Documents/repos/game-prototype/framework-probe
find src/core -type f -name '*.ts' -print0 | xargs -0 wc -l
find src/rendering src/services -type f -name '*.ts' -print0 | xargs -0 wc -l
find src/probes -type f -name '*.ts' -print0 | xargs -0 wc -l
find src -type f -name '*.ts' -print0 | xargs -0 wc -l
find src -type f \( -name '*.ts' -o -name '*.css' \) -print0 | xargs -0 wc -l
```

## 2. Core 变更及收益

Core 最终只保留三类不可避免的共性：

- `types.ts` 定义离散 `Tick`、纯 `StepFn<S, I>` 和按 tick 提供 intent 的 `IntentSource<I>`。
- `kernel.ts` 提供单步 `advance` 和从初始状态纯折叠的 `replay`。
- `view.ts` 提供 `view(state, tick, queries)`。query 在各个 probe 的入口显式声明，输出恰好是 renderer 所需的 `*View`。`query.ts` 只是既有测试导入路径的兼容 re-export，不增加另一套语义。

这次实现还修正了标准 tick driver 的批处理边界：ticker 回调中的 `while` 同时受 `running` 保护。因此 onTick 在某个 tick 内调用 `stop()` 后，同一 `deltaMS` 不会偷跑后续 tick；真实时间仍然只负责 pacing，simulation 仍然只接收离散 tick。收益是可复现的状态转移、可直接 replay 的历史，以及稳定的 rendering boundary：renderer 只依赖窄的 view，不依赖关卡的 simulation state。

四个 probe 的机制覆盖如下：

- Echo Chamber：两个 authored program 由 tick 索引取出 intent；每条 lane 独立移动/按压，同 tick 的两个 transient press 字段形成 gate 的单次聚合，`gateOpened` 是前向单调 latch。
- Dam：按 authored order 做 first-match threshold scan；inflow 是 tick 的确定性正弦脉冲，outflow 驱动 band streak，gate 是 latch，burst 是 terminal latch 并冻结后续状态。
- Mimic Moss：二维邻接和 relaxation 产生带距离的颜色传播；花需要 RED 后 BLUE，fern 会清掉进行中的颜色记忆；成熟植物按确定性 LCG 自主生长，玩家移动作为 sparse intent log。same-tick fern hazard 的排序是有意保留在本关卡内：当前 step 先评估 fern，再处理 flower memory，并在 `spores > 0` 时清掉进行中的颜色。这是相对于参考实现的 bounded simplification；测试 owner 已为此加入 regression test。
- Spore Telegraph：按 beat 产生 pulse，沿有向 wire 跳转；RELAY/PRISM/SNAIL 分别保持、反转或增加 dwell；arrival 按创建顺序处理，socket 填满或错误颜色会终止并冻结。

### 确定性、RNG、History 与 latch

所有 `StepFn` 都只读取 `(prev, tick, intent)`；没有 `Math.random()`、`Date.now()` 或实时输入进入 simulation。Dam 的河流脉冲是 `sin(tick)` 的纯函数；Echo、Spore 也完全由 tick、配置和状态决定。Moss 的 LCG 不是闭包副作用，而是 `rngState` 字段的一部分，每次随机抽取都把新 seed 写回下一状态，因此 live fold 和从 tick 0 的 replay 使用同一随机序列。

`createHistory` 只是 `core.replay` 的泛型 `stateAt(tick)` 外壳，当前刻意不做 snapshot、cache 或隐式 metadata。Dam 的 gate/burst、Echo 的 gate、Moss 的 bloom、Spore 的 ended/won 都是 simulation state 中显式的 latch；terminal latch 让后续 `StepFn` 返回冻结状态。这样 replay 得到的是该 tick 的历史事实，不需要新增 `RunMetaState` 来偷偷改写历史。

### Pixi / DOM 边界

`src/core/` 不导入 PixiJS 或 DOM，也不读取 `deltaMS`。唯一创建 Pixi `Application` 的位置是 `src/rendering/pixi-host.ts`；`src/rendering/tick-driver.ts` 只把 `deltaMS` 转成离散 tick。各 probe 的 `main.ts` 可以读取 DOM、注册键盘/鼠标和驱动 simulation，但在调用 renderer 前必须通过显式 queries 得到 `EchoView`、`DamView`、`SporeView` 或 `MossView`。各 `render.ts` 只消费 view（Spore 另接固定的 config/layout），所以 presentation 不反向依赖 simulation state 结构。

## 3. Directive：Option A / B / C

| 选项 | 设计 | 判定 |
| --- | --- | --- |
| A | 在 Core 中引入通用 `Directive`/命令 AST、队列和解释器，试图统一程序、规则、接线和玩家动作 | 删除/不保留。四个 probe 的 directive 形态和消费时机不同，统一 AST 会把关卡语义错误地提升到框架层 |
| B | 在 Standard Adapters 中增加通用 command/adapter，把 authored input 先规范化成一套 proposal 或 directive | 删除/不保留。Echo 需要程序索引，Dam 是规则扫描，Spore 是无输入的传播；规范化只增加一次转换，没有共享行为 |
| C | Core 只提供泛型 `IntentSource<I> = (tick) => I`；每个 probe 在自己的 simulation 旁定义 `echoIntentAt`、`damIntentAt`、`sporeIntentAt` 或 `mossIntentAt` | 采用。它只表达“本 tick 得到什么 intent”，不规定 intent 的领域结构和解释方式 |

因此没有新增通用 `Directive`、Proposal 或 command adapter；Level-Specific 保留真正不同的 authored-input 语义。

## 4. Topology 归属

Topology 属于 Level-Specific，而不是 Core 或 Standard Adapters。

- Mimic Moss 的 `topology.ts` 处理二维邻接、同步 relaxation、最短距离和染色反转；它把距离作为之后的 tick 可见性条件。
- Spore Telegraph 的 `topology.ts` 处理有向 wire、pulse arrival、cap 变换和 beat spawn；它还规定脉冲创建顺序。

两者都可以被口头称作“传播”，但数据结构、边界、时序和失败语义都不同。共享一个 `Topology` 接口不会减少领域规则，反而会隐藏差异，所以最终没有通用 Topology。

## 5. Arbitration 是否必要

不需要通用 Arbitration 层。需要决策时，决策规则直接放在拥有该语义的 simulation 中：

- Dam 的 `scanRules` 按 authored order first-match wins；没有 priority 字段，也没有合并所有匹配规则的 pass。
- Spore 的同 tick arrival 按 pulse creation order 处理；已填 socket 忽略重复到达，错误颜色立即结束。
- Echo 的“同 tick 两边都 PRESS”只是当前 state 的两个字段聚合，不是 proposal 冲突。
- Moss 没有跨系统 proposal 冲突。

所以 `Proposal-Arbitration` 既不是四个 probe 的共同需求，也不值得进入 Core。

这里的“不需要”是本次四 probe 的边界结论，不是否认关卡内部需要选择规则：Dam 的 first-match 和 Spore 的 arrival order 都是局部、显式、可测试的决策。没有两个独立 proposal 对同一 state 写入的共同协议，就没有理由增加通用 proposal collection、priority、conflict merge 或 commit pipeline。

## 6. Minimal Framework 最终判定与过度抽象

判定：Minimal Framework 足够。四个异质 probe 都能使用同一组最小 Core contracts、同一 Pixi host/tick driver 和 history 服务，同时每个 probe 仍能保留自己的 simulation、topology、UI 和 renderer。共享层只承载可证明的共性：纯逐 tick 转移、replay、显式 view projection、Pixi 宿主和真实时间 pacing。

最终删除/不保留的过度抽象包括：

- 通用 `Topology`；
- 通用 `Directive`、Directive adapter 或 Proposal pipeline；
- 通用 `Proposal-Arbitration`；
- 通用 `RunMetaState`；
- 试图把 Echo 的 sequence 行为推广成 `src/adapters/sequence` 的共享模块。

最终源码中不存在这些框架概念；只有各 probe 内部必要的局部函数（例如 Dam 的规则扫描和 Spore 的 pulse forwarding）。这让 Core 保持可解释、无 Pixi/DOM 依赖，且没有为了“可能的第五个 probe”提前支付抽象成本。

## 7. Topology 未抽取的理由

Topology 只在 Moss 和 Spore 中出现，而且两者连“节点”的含义都不同：Moss 是有限二维网格上的邻接、颜色变换和最短路径距离；Spore 是配置驱动的有向端口、延迟 pulse、cap 变换和 arrival 顺序。它们没有可证明的共同读写契约。抽出通用 graph/Topology 会迫使二维空间、端口接线和延迟传播共享一个名义接口，增加适配代码并掩盖失败语义，因此保留 `src/probes/mimic-moss/topology.ts` 与 `src/probes/spore-telegraph/topology.ts` 为 level-specific。

## 8. Continuation 基线、LOC 复现与最终验证

本轮 continuation 开始时，`framework-probe/` 已经整体处于未跟踪状态；因此仓库没有可供本轮使用的 tracked baseline，`git diff` 不能证明 continuation 前后的完整差异。LOC 应以当前工作树文件为准，使用下面的命令复现（命令输出包含各文件行数及最后的合计行）：

```bash
cd /Users/wj/Documents/repos/game-prototype/framework-probe
find src/core -type f -name '*.ts' -print0 | xargs -0 wc -l
find src/rendering src/services -type f -name '*.ts' -print0 | xargs -0 wc -l
find src/probes -type f -name '*.ts' -print0 | xargs -0 wc -l
find src -type f -name '*.ts' -print0 | xargs -0 wc -l
find src -type f \( -name '*.ts' -o -name '*.css' \) -print0 | xargs -0 wc -l
```

### 本轮 continuation write scope / delivered files

- `framework-probe/src/probes/mimic-moss/sim.ts`
- `framework-probe/REPORT.md`
- `framework-probe/tests/topology/moss.test.ts`（测试 owner）
- `framework-probe/tests/topology/spore.test.ts`（测试 owner）

`framework-probe/` 在本轮 continuation 开始时整体处于未跟踪状态，无法提供可由 tracked git diff 证明的完整变更。因此，上述列表是本轮 continuation 的 provenance：生产实现写入 `sim.ts` 与本报告，测试 owner 写入两份 topology test。此前实现阶段还写入了 README、view projection、tick-driver、index 等文件；这些属于已交付范围（delivered scope），不声称可由 tracked git diff 证明。

最终验证证据：

```text
npm test -- --no-file-parallelism  -> PASS（6 files/42 tests）
npx tsc --noEmit                   -> PASS
npm run build                       -> PASS（5 HTML entries）
static renderer check              -> no match
```

没有修改 package scripts、HTML 入口或依赖版本；通用 Topology、通用 Directive/Proposal-Arbitration、通用 `RunMetaState`、snapshot/cache History、Pixi/DOM 进入 Core，以及任何改变四个 probe 既有语义的重构仍不在本轮 write scope 内。
