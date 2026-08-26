import type { RunDefinition, StepFn } from '../../core/types';
import { localizedMessage, type LocalizedMessage } from '../../i18n';

export type L3Action = 'move' | 'interact' | 'observe' | 'apply' | 'wait';
export interface L3Program { readonly actions: readonly L3Action[]; }
export interface L3State {
  readonly tick: number; readonly position: number; readonly pocket: string | null; readonly gateCode: string;
  readonly status: 'running' | 'failed' | 'success'; readonly activity: 'idle' | 'moving' | 'acting' | 'waiting' | 'confused' | 'failed' | 'success';
  readonly message: LocalizedMessage['message']; readonly messageKey: LocalizedMessage['messageKey']; readonly messageParams?: LocalizedMessage['messageParams']; readonly failureBeat?: number; readonly lastAction?: L3Action;
}

export const defaultProgram: L3Program = { actions: ['move', 'move', 'move', 'apply'] };
export const repairProgram: L3Program = { actions: ['move', 'observe', 'move', 'move', 'apply'] };

export const initialState: L3State = { tick: 0, position: 0, pocket: null, gateCode: 'amber', status: 'running', activity: 'idle', ...localizedMessage('message.level3.initial') };
export const step: StepFn<L3State, L3Action | undefined> = (previous, tick, intent) => {
  if (previous.status !== 'running') return { ...previous, tick };
  const action = intent ?? 'wait';
  if (action === 'move') {
    const position = Math.min(3, previous.position + 1);
    return { ...previous, tick, position, lastAction: action, activity: 'moving', ...localizedMessage('message.level3.carry') };
  }
  if (action === 'observe') {
    if (previous.position === 1) return { ...previous, tick, pocket: previous.gateCode, lastAction: action, activity: 'acting', ...localizedMessage('message.level3.observe') };
    return { ...previous, tick, lastAction: action, activity: 'acting', ...localizedMessage('message.level3.nothingToRemember') };
  }
  if (action === 'apply' && previous.position === 3) {
    if (!previous.pocket) return { ...previous, tick, lastAction: action, status: 'failed', activity: 'failed', ...localizedMessage('message.level3.emptyPocket'), failureBeat: tick };
    if (previous.pocket !== previous.gateCode) return { ...previous, tick, lastAction: action, status: 'failed', activity: 'confused', ...localizedMessage('message.level3.wrongGlyph'), failureBeat: tick };
    return { ...previous, tick, lastAction: action, status: 'success', activity: 'success', ...localizedMessage('message.level3.restored') };
  }
  return { ...previous, tick, lastAction: action, activity: action === 'wait' ? 'waiting' : 'acting', ...localizedMessage(action === 'wait' ? 'message.level3.wait' : 'message.level3.tooFar') };
};
export function createRun(program: L3Program): RunDefinition<L3State, L3Action | undefined> {
  const actions = [...program.actions];
  return { initialState, step, inputSource: (tick) => actions[tick - 1] };
}
