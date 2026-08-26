import { createPixiHost } from '../../rendering/pixi-host';
import { createTickDriver } from '../../rendering/tick-driver';
import { createSporeRenderer, type SporeView } from './render';
import { mountSporeUi } from './ui';
import { createSporeRun } from './sim';
import type { CapType, NodeId, SporeConfig, SporeState } from './types';
import { advance } from '../../core/kernel';
import { view as projectView } from '../../services/presentation';

async function main(): Promise<void> {
  const stageEl = document.querySelector<HTMLDivElement>('#stage')!;
  const uiEl = document.querySelector<HTMLDivElement>('#ui')!;
  const logEl = document.querySelector<HTMLDivElement>('#log')!;
  const tickEl = document.querySelector<HTMLSpanElement>('#tick')!;

  const spouts: NodeId[] = ['S0', 'S1', 'S2'];
  const mushrooms: NodeId[] = ['M0', 'M1', 'M2', 'M3', 'M4'];
  const sockets: NodeId[] = ['D0', 'D1', 'D2'];
  const positions: Record<NodeId, { x: number; y: number }> = {
    S0: { x: 20, y: 20 }, S1: { x: 20, y: 110 }, S2: { x: 20, y: 200 },
    M0: { x: 170, y: 0 }, M1: { x: 170, y: 55 }, M2: { x: 170, y: 110 }, M3: { x: 170, y: 165 }, M4: { x: 170, y: 220 },
    D0: { x: 320, y: 20 }, D1: { x: 320, y: 110 }, D2: { x: 320, y: 200 },
  };

  // Direct RELAY passthrough — the intuitive-but-wrong default: the chant broadcasts the same
  // color to every spout each beat, so wiring straight through fails the door's B/B/R password.
  const wires: Record<NodeId, NodeId> = { S0: 'M0', M0: 'D0', S1: 'M1', M1: 'D1', S2: 'M2', M2: 'D2' };
  const caps: Record<NodeId, CapType> = { M0: 'RELAY', M1: 'RELAY', M2: 'RELAY', M3: 'RELAY', M4: 'RELAY' };

  const app = await createPixiHost(stageEl, { width: 360, height: 270, background: '#17132a' });

  function configNow(): SporeConfig {
    return {
      sequence: ['R', 'B', 'B', 'R', 'B'],
      expected: ['B', 'B', 'R'],
      spouts,
      caps: { ...caps },
      wires: { ...wires },
      beatEveryTicks: 4,
      hopTicks: 2,
      dwellTicks: { RELAY: 0, PRISM: 0, SNAIL: 6 },
    };
  }

  let activeConfig = configNow();
  let activeRun = createSporeRun(activeConfig);
  let state: SporeState = activeRun.initialState;
  let renderer = createSporeRenderer(app, activeConfig, { spouts, mushrooms, sockets, positions });

  function render(tick: number): void {
    const projected: SporeView = projectView(state, tick, {
      pulses: (current: SporeState) => current.pulses,
      filled: (current: SporeState) => current.filled,
      ended: (current: SporeState) => current.ended,
      won: (current: SporeState) => current.won,
      failedSocket: (current: SporeState) => current.failedSocket,
    });
    renderer.render(projected);
  }

  function logLine(text: string): void {
    logEl.textContent = `${text}\n${logEl.textContent ?? ''}`;
  }

  function onTick(tick: number): void {
    state = advance(state, tick, activeRun.inputSource?.(tick), activeRun.step);
    tickEl.textContent = String(tick);
    render(tick);
    if (state.ended) {
      driver.stop();
      logLine(
        state.won
          ? `t${tick}: the old road opens.`
          : `t${tick}: socket ${(state.failedSocket ?? 0) + 1} slammed shut.`,
      );
    } else if (tick >= 60) {
      driver.stop();
    }
  }

  const driver = createTickDriver(app.ticker, 260, onTick);

  function reset(): void {
    driver.reset();
    activeConfig = configNow();
    activeRun = createSporeRun(activeConfig);
    state = activeRun.initialState;
    tickEl.textContent = '0';
    app.stage.removeChildren();
    renderer = createSporeRenderer(app, activeConfig, { spouts, mushrooms, sockets, positions });
    render(0);
    logEl.textContent = 'The chant-totem waits. Wire the switchboard, then sing.';
  }

  mountSporeUi(uiEl, spouts, mushrooms, sockets, wires, caps, {
    onRun() {
      reset();
      driver.start();
    },
    onReset: reset,
  });

  reset();
}

void main();
