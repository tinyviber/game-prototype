import type { RunDefinition, StepFn } from '../../core/types';
import { localizedMessage, type LocalizedMessage } from '../../i18n';

export type L1Action = 'move' | 'interact' | 'wait';
export interface L1Program { readonly actions: readonly L1Action[]; }
export type L1Status = 'running' | 'failed' | 'success';
export interface L1State {
  readonly tick: number;
  readonly position: number;
  readonly gateOpen: boolean;
  /** Tick at which the activator was touched; presentation uses it for the door descent. */
  readonly gateOpenedAt?: number;
  readonly status: L1Status;
  readonly activity: 'idle' | 'moving' | 'acting' | 'waiting' | 'confused' | 'failed' | 'success';
  readonly message: LocalizedMessage['message'];
  readonly messageKey: LocalizedMessage['messageKey'];
  readonly messageParams?: LocalizedMessage['messageParams'];
  readonly failureBeat?: number;
  readonly lastAction?: L1Action;
}

export const defaultProgram: L1Program = { actions: ['move', 'move', 'move'] };
export const repairProgram: L1Program = { actions: ['move', 'interact', 'move', 'move'] };

export const initialState: L1State = {
  tick: 0, position: 0, gateOpen: false, status: 'running', activity: 'idle', ...localizedMessage('message.level1.initial'),
};

export const step: StepFn<L1State, L1Action | undefined> = (previous, tick, intent) => {
  if (previous.status !== 'running') return { ...previous, tick };
  const action = intent ?? 'wait';
  if (action === 'move') {
    if (previous.position === 1 && !previous.gateOpen) {
      return { ...previous, tick, lastAction: action, status: 'failed', activity: 'failed', ...localizedMessage('message.level1.lockedGate'), failureBeat: tick };
    }
    const position = Math.min(3, previous.position + 1);
    return { ...previous, tick, position, lastAction: action, status: position === 3 ? 'success' : 'running', activity: position === 3 ? 'success' : 'moving', ...localizedMessage(position === 3 ? 'message.level1.restored' : 'message.level1.followRail') };
  }
  if (action === 'interact' && previous.position === 1) {
    return { ...previous, tick, gateOpen: true, gateOpenedAt: tick, lastAction: action, activity: 'acting', ...localizedMessage('message.level1.activator') };
  }
  return { ...previous, tick, lastAction: action, activity: action === 'wait' ? 'waiting' : 'acting', ...localizedMessage(action === 'wait' ? 'message.level1.wait' : 'message.level1.noAnswer') };
};

export function createRun(program: L1Program): RunDefinition<L1State, L1Action | undefined> {
  const actions = [...program.actions];
  return { initialState, step, inputSource: (tick) => actions[tick - 1] };
}
