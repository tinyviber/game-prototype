# framework-probe

一个由四个异质小关卡组成的最小框架探针：它们共享一套极薄的确定性 run 协议（纯类型定义 + 一个 memoized timeline 运行时）和通用的 Pixi 节拍宿主，但保留各自的 simulation、topology、UI 和 renderer 语义。

## 安装与运行

```bash
cd /Users/wj/Documents/repos/game-prototype/framework-probe
npm install
npm run dev
```

Vite 启动后打开终端显示的本地地址。生产构建后可用 `npm run preview` 预览。

常用命令：

```bash
npm test           # 运行 Vitest 测试
npm run build      # tsc --noEmit，然后执行 Vite production build
npm run preview    # 预览最近一次 production build
```

## 四个入口

| 入口 | 重点 | 页面 |
| --- | --- | --- |
| Echo Chamber Bridge | 两条程序在同一共享时钟上逐 tick 前进，要求同 tick PRESS | [echo-chamber.html](./echo-chamber.html) |
| The Dam That Breathes | 一阶命中阈值规则、连续水流、稳定闩锁和爆坝终态 | [dam.html](./dam.html) |
| Mimic Moss | 静态网格传播、路径长度延迟和颜色变换 | [mimic-moss.html](./mimic-moss.html) |
| The Spore Telegraph | 有向接线、relay/prism/snail 节点、成功或失败终态 | [spore-telegraph.html](./spore-telegraph.html) |

架构结论见 [REPORT.md](./REPORT.md)。

## 边界说明

- `src/core/` 只剩协议类型：`Tick`、只读输入的 `StepFn`/`IntentSource`、`RunDefinition`。没有任何可执行代码，也不依赖 PixiJS、DOM 或实时 `deltaMS`。
- `src/services/history/` 是唯一的运行时服务：绑定一个 `RunDefinition`，增量执行并 memoize 整条 timeline。前进一拍恰好调用一次 step，重复或回退读取不会重算；`stateAt(tick)` 返回浅只读视图。四个入口的播放状态都从它读取。
- `src/rendering/` 负责两件事：唯一创建 Pixi `Application` 的宿主，以及把真实 `deltaMS` 切成离散 tick 的节拍器。
- `src/ui/shell.ts` 提供 `#stage/#ui/#log/#tick` 的 DOM 编排与共享按钮工厂；各 probe 的 `ui.ts` 只拼装自己的控件。
- `src/probes/*/` 是关卡级代码。每个入口的 main 直接构造 renderer 所需的字面量 view 对象；renderer 不接收对应的 simulation state。
- Tick 从 1 开始，tick 0 是 reset 后的初始画面。`deltaMS` 只用于积累节拍；一个 ticker 回调中若 onTick 调用 `stop()`，当前 deltaMS 批次不会继续推进后续 tick。
- Echo 的程序在末尾之后产生 `undefined` no-op，不循环；Dam 爆坝和 Spore 终局会冻结；Moss 的 authored topology 在一个 run 内静态不变，signal 仍按路径距离延迟传播。

测试命令列在上方，但测试的最终执行与验收由测试代理负责。
