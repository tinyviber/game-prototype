import { createPixiHost } from '../../rendering/pixi-host';
import { createTickDriver } from '../../rendering/tick-driver';
import { createDamRenderer } from './render';
import { mountDamUi } from './ui';
import { createDamRun } from './sim';
import { createHistory } from '../../services/history';
import { mountProbeShell } from '../../ui/shell';
import type { ThresholdRule } from './types';

async function main(): Promise<void> {
  const shell = mountProbeShell();

  // The intuitive-but-wrong default from the source demo: stingy when low.
  const rules: ThresholdRule[] = [{ below: 50, opening: 30 }];

  const app = await createPixiHost(shell.stage, { width: 300, height: 190, background: '#eef2f6' });
  const renderer = createDamRenderer(app);

  function configNow() {
    return { rules, initialLevel: 48, initialOpening: 0 };
  }

  // The history is the playback state; every tick shown is a cached entry of one timeline.
  let history = createHistory(createDamRun(configNow()));

  function render(tick: number): void {
    const s = history.stateAt(tick);
    renderer.render({
      level: s.level,
      opening: s.opening,
      outflow: s.outflow,
      streak: s.streak,
      gate: s.gate,
      burst: s.burst,
    });
  }

  const driver = createTickDriver(app.ticker, 90, (tick) => {
    const prev = history.stateAt(tick - 1);
    const next = history.stateAt(tick);
    shell.showTick(tick);
    render(tick);
    if (next.gate && !prev.gate) shell.logLine(`t${tick}: the wheel hums steady — the gate grinds OPEN.`);
    if (next.burst) {
      shell.logLine(`t${tick}: the dam BURSTS — the valley floods! FAIL`);
      driver.stop();
    }
    if (tick % 10 === 0) shell.logLine(`t${tick}: level ${next.level.toFixed(1)}, outflow ${next.outflow.toFixed(2)}.`);
    if (tick >= 300) driver.stop();
  });

  function reset(): void {
    driver.reset();
    history = createHistory(createDamRun(configNow()));
    shell.showTick(0);
    render(0);
    shell.resetLog('The reservoir is at 48. Somewhere downstream a wheel waits for steady water…');
  }

  mountDamUi(shell.ui, rules, {
    onRun() {
      reset();
      driver.start();
    },
    onReset: reset,
  });

  reset();
}

void main();
