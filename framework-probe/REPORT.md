# framework-probe implementation report

## 1. 最终分层与 LOC

最终分层如下。LOC 是当前源码的物理行数，包含注释和空行，不是估算的有效代码行数。

| 分层 | 目录 | LOC | 内容 |
| --- | --- | ---: | --- |
| Protocol types | `src/core/` | 26 | `Tick`、只读输入的 `StepFn`/`IntentSource`、`RunDefinition`——只有类型，没有可执行代码 |
| Runtime & rendering services | `src/services/history/`、`src/rendering/`、`src/ui/shell.ts` | 156 | memoized timeline 运行时、Pixi 宿主、tick driver、共享 DOM shell |
| Level-Specific | `src/probes/` | 1426 | 四个 probe 各自的 main、simulation、view renderer、UI 和必要的 topology |
| Shared presentation | `src/ui/shared.css` | 81 | 共享 DOM/UI 样式，不计入三层 TypeScript |
| **TypeScript 合计** | `src/**/*.ts` | **1608** | Protocol types + services + Level-Specific |
| **src 合计** | `src/` | **1689** | TypeScript 加共享 CSS |

按 probe 的 Level-Specific 明细是：Echo 277 LOC、Dam 296 LOC、Mimic Moss 415 LOC、Spore 438 LOC。数字由下面的命令生成，便于复核：

```bash
cd /Users/wj/Documents/repos/game-prototype/framework-probe
find src/core -type f -name '*.ts' -print0 | xargs -0 wc -l
find src/services src/rendering src/ui -type f -name '*.ts' -print0 | xargs -0 wc -l
find src/probes -type f -name '*.ts' -print0 | xargs -0 wc -l
find src -type f -name '*.ts' -print0 | xargs -0 wc -l
find src -type f \( -name '*.ts' -o -name '*.css' \) -print0 | xargs -0 wc -l
```

## 2. Core 变更及收益

Core 最终只剩一组协议类型，不再包含任何可执行代码：

- `types.ts` 定义离散 `Tick`、纯 `StepFn<S, I>`、按 tick 提供 intent 的 `IntentSource<I>`，以及一次 authored run 的只读协议 `RunDefinition`。
- 单步包装 `advance()` 已删除：它只是 `step(...)` 的一行别名，只提供词汇不提供语义。
- `services/presentation/view()` 已删除：各 probe 的 main 直接构造 renderer 所需的字面量 view 对象，比通用 query bag 更直白。
- 真正执行游戏的最小运行时原语是 `services/history/createHistory(definition)`：绑定一个 RunDefinition 后增量执行并 memoize 整条 timeline。前进一拍恰好调用一次 step；重复或回退读取不会重算；越界读取从最后缓存的 tick 续算而非从头重放；非法 tick（负数/非整数）抛 `RangeError`。返回值是与 `StepFn` 的 `prev` 同强度的浅只读视图；memoization 承诺的是"不重算"这一行为，返回对象的 identity 不是契约。

这次实现保留了标准 tick driver 的批处理边界：ticker 回调中的 `while` 同时受 `running` 保护。因此 onTick 在某个 tick 内调用 `stop()` 后，同一 `deltaMS` 不会偷跑后续 tick；真实时间仍然只负责 pacing，simulation 仍然只接收离散 tick。收益是可复现的状态转移、一条可随机访问的 memoized 历史，以及稳定的 rendering boundary：renderer 只依赖窄的 view 字面量，不依赖关卡的 simulation state。

四个 probe 的机制覆盖如下：

- Echo Chamber：两个 authored program 由 tick 索引取出 intent；每条 lane 独立移动/按压，同 tick 的两个 transient press 字段形成 gate 的单次聚合，`gateOpened` 是前向单调 latch。
- Dam：按 authored order 做 first-match threshold scan；inflow 是 tick 的确定性正弦脉冲，outflow 驱动 band streak，gate 是 latch，burst 是 terminal latch 并冻结后续状态。
- Mimic Moss：二维邻接和 relaxation 产生带距离的颜色传播；花需要 RED 后 BLUE，fern 会清掉进行中的颜色记忆；plants 是 run-owned 的静态 authored topology，不包含运行时生长。same-tick fern hazard 的排序仍是本关卡内部语义：先评估 fern，再处理 flower memory，并在 `spores > 0` 时清掉进行中的颜色。
- Spore Telegraph：按 beat 产生 pulse，沿有向 wire 跳转；RELAY/PRISM/SNAIL 分别保持、反转或增加 dwell；同一目标节点的同 tick 多 arrival 明确碰撞销毁，单目标按可见节点编号处理，socket 填满或错误颜色会终止并冻结。

### 确定性、RunDefinition、History 与 latch

所有 `StepFn` 都只读取只读的 `(prev, tick, intent)`；没有 `Math.random()`、`Date.now()` 或实时输入进入 simulation。Dam 的河流脉冲是 `sin(tick)` 的纯函数；Echo、Spore、Moss 也完全由 tick、run-owned 配置和状态决定。Moss 的静态配置空间只通过 signal propagation、路径距离和节点颜色变换产生可观察结果。

`RunDefinition<S, I>` 持有 `initialState`、`step` 和必填 `inputSource`；`createHistory` 会复制 data-shaped initial state 并冻结 definition 外壳。Dam、Spore、Moss、Echo 的 `create*Run` 在 run 创建时复制 authored arrays/maps/rules，后续 authoring 修改必须通过 reset/run 创建新的 definition。这样 timeline 得到的是该 run 的历史事实，不会读取 live 配置闭包。

### Pixi / DOM 边界

`src/core/` 不导入 PixiJS 或 DOM，也不读取 `deltaMS`。唯一创建 Pixi `Application` 的位置是 `src/rendering/pixi-host.ts`；`src/rendering/tick-driver.ts` 只把 `deltaMS` 转成离散 tick。各 probe 的 `main.ts` 可以读取 DOM、注册输入事件和驱动 playback，但在调用 renderer 前直接构造 `EchoView`、`DamView`、`SporeView` 或 `MossView` 的字面量对象——状态一律来自 history timeline 的只读读取。各 `render.ts` 只消费 view（Spore 另接固定的 config/layout），所以 presentation 不反向依赖 simulation state 结构。`src/ui/shell.ts` 集中了 `#stage/#ui/#log/#tick` 的 DOM 编排和共享按钮工厂，是 probe 页面接触页面脚手架的唯一位置。

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
- Spore Telegraph 的 `topology.ts` 处理有向 wire、pulse arrival、cap 变换和 beat spawn；`sim.ts` 在关卡内部对同目标 arrival 做 collision resolution，不把数组创建顺序提升为规则。

两者都可以被口头称作“传播”，但数据结构、边界、时序和失败语义都不同。共享一个 `Topology` 接口不会减少领域规则，反而会隐藏差异，所以最终没有通用 Topology。

## 5. Arbitration 是否必要

不需要通用 Arbitration 层。需要决策时，决策规则直接放在拥有该语义的 simulation 中：

- Dam 的 `scanRules` 按 authored order first-match wins；没有 priority 字段，也没有合并所有匹配规则的 pass。
- Spore 的同 tick 同目标 arrival 明确碰撞并全部销毁；已填 socket 忽略之后的单个正确到达，错误颜色立即结束。
- Echo 的“同 tick 两边都 PRESS”只是当前 state 的两个字段聚合，不是 proposal 冲突。
- Moss 没有跨系统 proposal 冲突。

所以 `Proposal-Arbitration` 既不是四个 probe 的共同需求，也不值得进入 Core。

这里的“不需要”是本次四 probe 的边界结论，不是否认关卡内部需要选择规则：Dam 的 first-match 和 Spore 的 collision/port-order 都是局部、显式、可测试的决策。没有两个独立 proposal 对同一 state 写入的共同协议，就没有理由增加通用 proposal collection、priority、conflict merge 或 commit pipeline。

## 6. Minimal Framework 最终判定与过度抽象

判定：Minimal Framework 足够。四个异质 probe 都能使用同一组最小 Core 协议类型、同一个 memoized timeline 运行时、同一 Pixi host/tick driver 和共享 DOM shell，同时每个 probe 仍能保留自己的 simulation、topology、UI 和 renderer。共享层只承载可证明的共性：纯逐 tick 转移协议、run snapshot 与 memoized 随机访问历史、Pixi 宿主和真实时间 pacing。

最终删除/不保留的过度抽象包括：

- 通用 `Topology`；
- 通用 `Directive`、Directive adapter 或 Proposal pipeline；
- 通用 `Proposal-Arbitration`；
- 通用 `RunMetaState`；
- 试图把 Echo 的 sequence 行为推广成 `src/adapters/sequence` 的共享模块；
- 单步包装 `advance()`（一行别名）与 presentation 的 `view()` query bag（PR #2 中删除）。

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

### Hardening write scope / delivered changes

- Core/history：`kernel.ts`、`types.ts`、`services/history/`、`services/presentation/`。
- Run snapshots：四个 probe 的 `create*Run` 与固定 step 生命周期。
- Moss：删除运行时生长/RNG 状态，改为静态 authored topology，并补充距离/颜色因果回归。
- Spore：同目标 arrival 改为关卡内 collision resolution，并补充声明顺序独立性测试。
- Tests/docs：迁移 History API，更新 Moss/Spore 语义与验收记录。

最终验证证据：

```text
npm test -- --no-file-parallelism  -> PASS（6 files/43 tests）
npx tsc --noEmit                   -> PASS
npm run build                       -> PASS（5 HTML entries）
static renderer check              -> no match
```

没有修改 package scripts、HTML 入口或依赖版本；通用 Topology、通用 Directive/Proposal-Arbitration、通用 `RunMetaState`、通用 History arbitration、Pixi/DOM 进入 Core 仍不在本轮 write scope 内。

## 9. Follow-up 轮（PR #2）：从 ceremony 到 primitives

对上一轮产物逐行 review 后的修正轮。六个 finding，六个修复，净减约 18 行：

1. 删除单步包装 `advance()`（`src/core/kernel.ts` 整体移除）——它只是 `step(...)` 的一行别名。
2. 删除 `services/presentation/view()`——各 main 直接构造 renderer 所需的字面量 view 对象；Moss 的 light map 从"每 tick 在 step 内重算 + 每帧在 draw 内重算"提升为 config 绑定期各解一次。
3. `createHistory` 升级为 memoized incremental timeline，并成为四个 main 的 playback 原语：渲染状态一律从 timeline 只读读取。此前它是"只被测试使用的 service"，且每次 `stateAt` 从 tick 0 重放（循环调用即 O(t²)）。
4. 抽取 `src/ui/shell.ts`：`#stage/#ui/#log/#tick` 编排、tick 展示与 log 追加此前被原样复制了四份，而两处调用的领域 helper 反而被刻意保留在本地——去重政策恢复一致：机械重复的 DOM choreography 归一处，gameplay 语义留在拥有它的 simulation 里。
5. 所有设计决策注释改为自洽，删除对 REPORT.md 的指针和对不存在目录的引用。
6. 删除 Echo 程序编辑器的 no-op `onChange` 回调。

Review 二轮补充的契约修复：`History.stateAt()`/`replay()` 对外返回 `Readonly<S>`（与 `StepFn` 收到的 `prev` 同强度的浅只读），堵住"调用方改写缓存对象 → 污染后续 timeline 计算"的类型层漏洞；同时删除把对象 identity 固化为 API 契约的测试——memoization 承诺的是不重算行为（由 step 计数断言覆盖），identity 只是实现细节。

本轮结束后的最终形态：

```text
CORE PROTOCOL      src/core/types.ts          Tick / StepFn / IntentSource / RunDefinition
RUNTIME SERVICE    src/services/history/      绑定 RunDefinition；增量执行；memoized timeline；随机访问
PACING             src/rendering/tick-driver  deltaMS -> 离散 tick
PRESENTATION       src/rendering/pixi-host    唯一 Application 构造点
                   src/ui/shell.ts            共享 DOM 编排 + 按钮工厂
                   各 render.ts               只消费字面量 view 对象
LEVEL-SPECIFIC     src/probes/*/              simulation / topology / authoring UI / main
```

注意：已经不存在"simulation kernel 文件"。Core 本质只剩一组协议类型，执行游戏的最小运行时原语是 `History<RunDefinition>`。

最终验证证据：

```text
npx vitest run                     -> PASS（6 files/44 tests）
npx tsc --noEmit                   -> PASS
npm run build                      -> PASS（5 HTML entries）
rg "advance|presentation|REPORT\.md|adapters" src tests -> 仅剩英文词义匹配，无残留引用
```
