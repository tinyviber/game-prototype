import type { RunDefinition, StepFn } from '../../core/types';
import { localizedMessage, type LocalizedMessage } from '../../i18n';

export type L2Action = 'move' | 'interact' | 'wait';
export type L2Phase = 0 | 1 | 2;
export interface L2Program { readonly actions: readonly L2Action[]; }
export interface L2State {
  readonly tick: number; readonly position: number; readonly phase: L2Phase;
  readonly tile: 'safe' | 'unstable' | 'collapsed';   readonly status: 'running' | 'failed' | 'success';
  readonly activity: 'idle' | 'moving' | 'acting' | 'waiting' | 'confused' | 'failed' | 'success';
  readonly message: LocalizedMessage['message']; readonly messageKey: LocalizedMessage['messageKey']; readonly messageParams?: LocalizedMessage['messageParams']; readonly failureBeat?: number; readonly lastAction?: L2Action;
}

export const defaultProgram: L2Program = { actions: ['move', 'move', 'move'] };
export const repairProgram: L2Program = { actions: ['move', 'wait', 'move', 'move'] };

export const initialState: L2State = { tick: 0, position: 0, phase: 0, tile: 'safe', status: 'running', activity: 'idle', ...localizedMessage('message.level2.initial') };
const nextPhase = (phase: L2Phase): L2Phase => ((phase + 1) % 3) as L2Phase;

export const step: StepFn<L2State, L2Action | undefined> = (previous, tick, intent) => {
  if (previous.status !== 'running') return { ...previous, tick };
  const phase = nextPhase(previous.phase);
  const action = intent ?? 'wait';
  const tile = phase === 0 ? 'safe' : phase === 1 ? 'unstable' : 'collapsed';
  if (action === 'move') {
    const position = Math.min(3, previous.position + 1);
    if (position === 2 && phase !== 0) {
      return { ...previous, tick, phase, tile, lastAction: action, status: 'failed', activity: 'failed', ...localizedMessage(tile === 'collapsed' ? 'message.level2.floorCollapsed' : 'message.level2.floorUnstable'), failureBeat: tick };
    }
    return { ...previous, tick, phase, tile, position, lastAction: action, status: position === 3 ? 'success' : 'running', activity: position === 3 ? 'success' : 'moving', ...localizedMessage(position === 3 ? 'message.level2.crosses' : 'message.level2.advance') };
  }
  return { ...previous, tick, phase, tile, lastAction: action, activity: action === 'wait' ? 'waiting' : 'acting', ...localizedMessage(action === 'wait' ? 'message.level2.wait' : 'message.level2.noTouch') };
};

export function createRun(program: L2Program): RunDefinition<L2State, L2Action | undefined> {
  const actions = [...program.actions];
  return { initialState, step, inputSource: (tick) => actions[tick - 1] };
}
