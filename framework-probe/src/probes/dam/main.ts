import { createPixiHost } from '../../rendering/pixi-host';
import { createTickDriver } from '../../rendering/tick-driver';
import { createDamRenderer, type DamView } from './render';
import { mountDamUi } from './ui';
import { createDamStep, damIntentAt, initialDamState } from './sim';
import type { DamConfig, DamState, ThresholdRule } from './types';
import { view as projectView } from '../../core/view';

async function main(): Promise<void> {
  const stageEl = document.querySelector<HTMLDivElement>('#stage')!;
  const uiEl = document.querySelector<HTMLDivElement>('#ui')!;
  const logEl = document.querySelector<HTMLDivElement>('#log')!;
  const tickEl = document.querySelector<HTMLSpanElement>('#tick')!;

  // The intuitive-but-wrong default from the source demo: stingy when low.
  const rules: ThresholdRule[] = [{ below: 50, opening: 30 }];

  const app = await createPixiHost(stageEl, { width: 300, height: 190, background: '#eef2f6' });
  const renderer = createDamRenderer(app);

  function configNow(): DamConfig {
    return { rules, initialLevel: 48, initialOpening: 0 };
  }

  let state: DamState = initialDamState(configNow());

  function render(tick: number): void {
    const projected: DamView = projectView(state, tick, {
      level: (current: DamState) => current.level,
      opening: (current: DamState) => current.opening,
      outflow: (current: DamState) => current.outflow,
      streak: (current: DamState) => current.streak,
      gate: (current: DamState) => current.gate,
      burst: (current: DamState) => current.burst,
    });
    renderer.render(projected);
  }

  function logLine(text: string): void {
    logEl.textContent = `${text}\n${logEl.textContent ?? ''}`;
  }

  function onTick(tick: number): void {
    const wasGate = state.gate;
    state = createDamStep(configNow())(state, tick, damIntentAt(tick));
    tickEl.textContent = String(tick);
    render(tick);
    if (state.gate && !wasGate) logLine(`t${tick}: the wheel hums steady — the gate grinds OPEN.`);
    if (state.burst) {
      logLine(`t${tick}: the dam BURSTS — the valley floods! FAIL`);
      driver.stop();
    }
    if (tick % 10 === 0) logLine(`t${tick}: level ${state.level.toFixed(1)}, outflow ${state.outflow.toFixed(2)}.`);
    if (tick >= 300) driver.stop();
  }

  const driver = createTickDriver(app.ticker, 90, onTick);

  function reset(): void {
    driver.reset();
    state = initialDamState(configNow());
    tickEl.textContent = '0';
    render(0);
    logEl.textContent = 'The reservoir is at 48. Somewhere downstream a wheel waits for steady water…';
  }

  mountDamUi(uiEl, rules, {
    onRun() {
      reset();
      driver.start();
    },
    onReset: reset,
  });

  reset();
}

void main();
