import type { IntentSource, RunDefinition, StepFn, Tick } from '../../core/types';
import type { EchoConfig, EchoIntent, EchoState, Instr } from './types';

export function initialEchoState(): EchoState {
  return { echoPos: 0, livePos: 0, echoPressed: false, livePressed: false, gateOpened: false };
}

/**
 * One lane's per-tick rule: MOVE advances (clamped at the plate), PRESS only succeeds while
 * standing exactly on the plate. Intentionally duplicated for the echo/live lanes below rather
 * than promoted to a shared `src/adapters/sequence` module — see REPORT.md "Directive verdict"
 * for why a single two-call-site helper did not clear the extraction bar.
 */
function stepLane(instr: Instr | undefined, pos: number, plate: number): { pos: number; pressed: boolean } {
  const nextPos = instr === 'MOVE' ? Math.min(plate, pos + 1) : pos;
  const pressed = instr === 'PRESS' && nextPos === plate;
  return { pos: nextPos, pressed };
}

export function createEchoStep(config: EchoConfig): StepFn<EchoState, EchoIntent> {
  const snapshot: EchoConfig = { ...config, echoProgram: [...config.echoProgram], liveProgram: [...config.liveProgram] };
  return (prev, _tick, intent) => {
    const echo = stepLane(intent.echoInstr, prev.echoPos, snapshot.echoPlate);
    const live = stepLane(intent.liveInstr, prev.livePos, snapshot.livePlate);
    return {
      echoPos: echo.pos,
      livePos: live.pos,
      echoPressed: echo.pressed,
      livePressed: live.pressed,
      // Monotonic latch: once both plates land on the same tick, the gate stays open forever.
      gateOpened: prev.gateOpened || (echo.pressed && live.pressed),
    };
  };
}

/**
 * Reads the instruction scheduled for `tick` from a fixed, pre-authored program (1-indexed
 * ticks -> 0-indexed array). Past the end of the program the lookup yields `undefined`
 * (a no-op) forever — finite sequences terminate, they never wrap via modulo.
 */
export function echoIntentAt(config: EchoConfig): IntentSource<EchoIntent> {
  const snapshot: EchoConfig = { ...config, echoProgram: [...config.echoProgram], liveProgram: [...config.liveProgram] };
  return (tick: Tick) => ({
    echoInstr: snapshot.echoProgram[tick - 1],
    liveInstr: snapshot.liveProgram[tick - 1],
  });
}

export function createEchoRun(config: EchoConfig): RunDefinition<EchoState, EchoIntent> {
  const snapshot: EchoConfig = { ...config, echoProgram: [...config.echoProgram], liveProgram: [...config.liveProgram] };
  return { initialState: initialEchoState(), step: createEchoStep(snapshot), inputSource: echoIntentAt(snapshot) };
}

/** Same-tick aggregate: both lanes are ordinary current-tick fields, so "did both press right
 * now" needs no new primitive — it is just a query over State(t). */
export const bothPressedThisTick = (state: EchoState): boolean => state.echoPressed && state.livePressed;
