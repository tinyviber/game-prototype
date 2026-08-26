import { createPixiHost } from '../../rendering/pixi-host';
import { createTickDriver } from '../../rendering/tick-driver';
import { createEchoRenderer, type EchoView } from './render';
import { mountEchoUi } from './ui';
import { createEchoRun } from './sim';
import type { EchoState, Instr } from './types';
import { advance } from '../../core/kernel';
import { view as projectView } from '../../services/presentation';

async function main(): Promise<void> {
  const stageEl = document.querySelector<HTMLDivElement>('#stage')!;
  const uiEl = document.querySelector<HTMLDivElement>('#ui')!;
  const logEl = document.querySelector<HTMLDivElement>('#log')!;
  const tickEl = document.querySelector<HTMLSpanElement>('#tick')!;

  const echoProgram: Instr[] = ['MOVE', 'MOVE', 'MOVE', 'PRESS'];
  const liveProgram: Instr[] = ['MOVE', 'MOVE', 'MOVE', 'MOVE', 'MOVE', 'PRESS'];
  const echoPlate = 3;
  const livePlate = 5;

  const app = await createPixiHost(stageEl, { width: 460, height: 180, background: '#fdf6e3' });
  const renderer = createEchoRenderer(
    app,
    { plate: echoPlate, length: echoPlate + 2 },
    { plate: livePlate, length: livePlate + 2 },
  );

  let activeRun = createEchoRun({ echoProgram, liveProgram, echoPlate, livePlate });
  let state: EchoState = activeRun.initialState;
  let maxTick = 0;

  function render(tick: number): void {
    const projected: EchoView = projectView(state, tick, {
      echoPos: (current: EchoState) => current.echoPos,
      livePos: (current: EchoState) => current.livePos,
      gateOpened: (current: EchoState) => current.gateOpened,
    });
    renderer.render(projected);
  }

  function logLine(text: string): void {
    logEl.textContent = `${text}\n${logEl.textContent ?? ''}`;
  }

  function onTick(tick: number): void {
    const wasOpen = state.gateOpened;
    state = advance(state, tick, activeRun.inputSource(tick), activeRun.step);
    tickEl.textContent = String(tick);
    render(tick);
    const echoNote = state.echoPressed ? ' Echo PRESSES!' : '';
    const liveNote = state.livePressed ? ' You PRESS!' : '';
    logLine(`t${tick}: echo@${state.echoPos} you@${state.livePos}.${echoNote}${liveNote}`);
    if (state.gateOpened && !wasOpen) logLine('\uD83D\uDD13 GATE OPEN — synchronized!');
    if (tick >= maxTick) {
      driver.stop();
      if (!state.gateOpened) logLine('Presses never lined up. Adjust WAIT steps and try again.');
    }
  }

  const driver = createTickDriver(app.ticker, 380, onTick);

  function reset(): void {
    driver.reset();
    activeRun = createEchoRun({ echoProgram, liveProgram, echoPlate, livePlate });
    state = activeRun.initialState;
    tickEl.textContent = '0';
    render(0);
    logEl.textContent = 'Press Run to execute Echo and You simultaneously, tick by tick.';
  }

  mountEchoUi(uiEl, echoProgram, liveProgram, {
    onRun() {
      reset();
      maxTick = Math.max(echoProgram.length, liveProgram.length);
      driver.start();
    },
    onReset: reset,
  });

  reset();
}

void main();
