# framework-probe

一个由四个异质小关卡组成的最小框架探针：它们共享确定性的逐 tick 内核和通用的 Pixi 时钟宿主，但保留各自的 simulation、topology、UI 和 renderer 语义。

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
| Mimic Moss | 网格传播、路径长度延迟、颜色变换和自主生长 | [mimic-moss.html](./mimic-moss.html) |
| The Spore Telegraph | 有向接线、relay/prism/snail 节点、成功或失败终态 | [spore-telegraph.html](./spore-telegraph.html) |

架构结论见 [REPORT.md](./REPORT.md)。

## 边界说明

- `src/core/` 只包含 `Tick`、纯 `StepFn`/`IntentSource`、逐 tick/replay 内核和显式 query projection；不依赖 PixiJS、DOM 或实时 `deltaMS`。
- `src/rendering/` 和 `src/services/` 是标准适配层：前者负责 Pixi 宿主与真实时间到离散 tick 的节拍，后者负责 history 服务。
- `src/probes/*/` 是关卡级代码。每个入口在把数据交给 renderer 前显式投影为自己的 `*View`；renderer 不接收对应的 simulation state。
- Tick 从 1 开始，tick 0 是 reset 后的初始画面。`deltaMS` 只用于积累节拍；一个 ticker 回调中若 onTick 调用 `stop()`，当前 deltaMS 批次不会继续推进后续 tick。
- Echo 的程序在末尾之后产生 `undefined` no-op，不循环；Dam 爆坝和 Spore 终局会冻结；Moss 通过纯状态和 replay 语义保持可复现。

测试命令列在上方，但测试的最终执行与验收由测试代理负责。
