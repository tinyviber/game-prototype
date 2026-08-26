import { createPixiHost } from '../../rendering/pixi-host';
import { createTickDriver } from '../../rendering/tick-driver';
import { createEchoRenderer } from './render';
import { mountEchoUi } from './ui';
import { createEchoRun } from './sim';
import { createHistory } from '../../services/history';
import { mountProbeShell } from '../../ui/shell';
import type { Instr } from './types';

async function main(): Promise<void> {
  const shell = mountProbeShell();

  const echoProgram: Instr[] = ['MOVE', 'MOVE', 'MOVE', 'PRESS'];
  const liveProgram: Instr[] = ['MOVE', 'MOVE', 'MOVE', 'MOVE', 'MOVE', 'PRESS'];
  const echoPlate = 3;
  const livePlate = 5;

  const app = await createPixiHost(shell.stage, { width: 460, height: 180, background: '#fdf6e3' });
  const renderer = createEchoRenderer(
    app,
    { plate: echoPlate, length: echoPlate + 2 },
    { plate: livePlate, length: livePlate + 2 },
  );

  // The history is the playback state: every rendered tick is read from one memoized timeline,
  // so the run can never drift between what was simulated and what is on screen.
  let history = createHistory(createEchoRun({ echoProgram, liveProgram, echoPlate, livePlate }));
  let maxTick = 0;

  function render(tick: number): void {
    const s = history.stateAt(tick);
    renderer.render({ echoPos: s.echoPos, livePos: s.livePos, gateOpened: s.gateOpened });
  }

  const driver = createTickDriver(app.ticker, 380, (tick) => {
    const prev = history.stateAt(tick - 1);
    const next = history.stateAt(tick);
    shell.showTick(tick);
    render(tick);
    const echoNote = next.echoPressed ? ' Echo PRESSES!' : '';
    const liveNote = next.livePressed ? ' You PRESS!' : '';
    shell.logLine(`t${tick}: echo@${next.echoPos} you@${next.livePos}.${echoNote}${liveNote}`);
    if (next.gateOpened && !prev.gateOpened) shell.logLine('\uD83D\uDD13 GATE OPEN — synchronized!');
    if (tick >= maxTick) {
      driver.stop();
      if (!next.gateOpened) shell.logLine('Presses never lined up. Adjust WAIT steps and try again.');
    }
  });

  function reset(): void {
    driver.reset();
    history = createHistory(createEchoRun({ echoProgram, liveProgram, echoPlate, livePlate }));
    shell.showTick(0);
    render(0);
    shell.resetLog('Press Run to execute Echo and You simultaneously, tick by tick.');
  }

  mountEchoUi(shell.ui, echoProgram, liveProgram, {
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
