import { createPixiHost } from '../../rendering/pixi-host';
import { createTickDriver } from '../../rendering/tick-driver';
import { createSporeRenderer } from './render';
import { mountSporeUi } from './ui';
import { createSporeRun } from './sim';
import { createHistory } from '../../services/history';
import { mountProbeShell } from '../../ui/shell';
import type { CapType, NodeId, SporeConfig } from './types';

async function main(): Promise<void> {
  const shell = mountProbeShell();

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

  const app = await createPixiHost(shell.stage, { width: 360, height: 270, background: '#17132a' });

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
  // The history is the playback state; renderer swaps only when the authored wiring changes.
  let history = createHistory(createSporeRun(activeConfig));
  let renderer = createSporeRenderer(app, activeConfig, { spouts, mushrooms, sockets, positions });

  function render(tick: number): void {
    const s = history.stateAt(tick);
    renderer.render({
      pulses: s.pulses,
      filled: s.filled,
      ended: s.ended,
      won: s.won,
      failedSocket: s.failedSocket,
    });
  }

  const driver = createTickDriver(app.ticker, 260, (tick) => {
    const next = history.stateAt(tick);
    shell.showTick(tick);
    render(tick);
    if (next.ended) {
      driver.stop();
      shell.logLine(
        next.won
          ? `t${tick}: the old road opens.`
          : `t${tick}: socket ${(next.failedSocket ?? 0) + 1} slammed shut.`,
      );
    } else if (tick >= 60) {
      driver.stop();
    }
  });

  function reset(): void {
    driver.reset();
    activeConfig = configNow();
    history = createHistory(createSporeRun(activeConfig));
    shell.showTick(0);
    app.stage.removeChildren();
    renderer = createSporeRenderer(app, activeConfig, { spouts, mushrooms, sockets, positions });
    render(0);
    shell.resetLog('The chant-totem waits. Wire the switchboard, then sing.');
  }

  mountSporeUi(shell.ui, spouts, mushrooms, sockets, wires, caps, {
    onRun() {
      reset();
      driver.start();
    },
    onReset: reset,
  });

  reset();
}

void main();
