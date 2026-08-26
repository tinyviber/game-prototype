import type { RunDefinition, StepFn } from '../../core/types';
import { localizedMessage, type LocalizedMessage } from '../../i18n';

export type L4Action = 'move' | 'interact' | 'wait' | 'observe' | 'apply' | 'record-start' | 'record-end' | 'replay';
export interface L4Program { readonly actions: readonly L4Action[]; }
export interface L4State {
  readonly tick: number; readonly position: number; readonly serviced: number; readonly recording: boolean;
  readonly capsule: readonly L4Action[]; readonly replayQueue: readonly L4Action[];
  readonly status: 'running' | 'failed' | 'success'; readonly activity: 'idle' | 'moving' | 'acting' | 'waiting' | 'confused' | 'failed' | 'success';
  readonly message: LocalizedMessage['message']; readonly messageKey: LocalizedMessage['messageKey']; readonly messageParams?: LocalizedMessage['messageParams']; readonly failureBeat?: number; readonly lastAction?: L4Action;
}

export const defaultProgram: L4Program = { actions: ['move', 'interact', 'move', 'move', 'move', 'interact'] };
export const expandedProgram: L4Program = { actions: ['move', 'interact', 'move', 'move', 'interact'] };
export const replayProgram: L4Program = { actions: ['record-start', 'move', 'interact', 'record-end', 'move', 'replay'] };

export const initialState: L4State = { tick: 0, position: 0, serviced: 0, recording: false, capsule: [], replayQueue: [], status: 'running', activity: 'idle', ...localizedMessage('message.level4.initial') };
export const step: StepFn<L4State, L4Action | undefined> = (previous, tick, intent) => {
  if (previous.status !== 'running') return { ...previous, tick };
  let queue = [...previous.replayQueue];
  let action = intent ?? 'wait';
  if (queue.length) { action = queue[0]; queue = queue.slice(1); }
  if (action === 'replay') {
    if (!previous.capsule.length) return { ...previous, tick, lastAction: action, status: 'failed', activity: 'confused', ...localizedMessage('message.level4.emptyCapsule'), failureBeat: tick };
    return { ...previous, tick, replayQueue: [...previous.capsule], lastAction: action, activity: 'acting', ...localizedMessage('message.level4.replay') };
  }
  if (action === 'record-start') return { ...previous, tick, recording: true, lastAction: action, activity: 'acting', ...localizedMessage('message.level4.recording') };
  if (action === 'record-end') return { ...previous, tick, recording: false, lastAction: action, activity: 'acting', ...localizedMessage(previous.capsule.length ? 'message.level4.sealedRoutine' : 'message.level4.sealedEmpty') };
  let capsule = [...previous.capsule];
  if (previous.recording && (action === 'move' || action === 'interact')) capsule.push(action);
  if (action === 'move') {
    const position = previous.position + 1;
    if (position > 3) return { ...previous, tick, capsule, lastAction: action, status: 'failed', activity: 'failed', ...localizedMessage('message.level4.overrun'), failureBeat: tick };
    return { ...previous, tick, position, capsule, replayQueue: queue, lastAction: action, activity: 'moving', ...localizedMessage('message.level4.followRail') };
  }
  if (action === 'interact') {
    if (previous.position === 1 && previous.serviced === 0) return { ...previous, tick, capsule, replayQueue: queue, serviced: 1, lastAction: action, activity: 'acting', ...localizedMessage('message.level4.stationOne') };
    if (previous.position === 3 && previous.serviced === 1) return { ...previous, tick, capsule, replayQueue: queue, serviced: 2, status: 'success', lastAction: action, activity: 'success', ...localizedMessage('message.level4.restored') };
    return { ...previous, tick, capsule, replayQueue: queue, lastAction: action, status: 'failed', activity: 'confused', ...localizedMessage('message.level4.wrongBeat'), failureBeat: tick };
  }
  return { ...previous, tick, capsule, replayQueue: queue, lastAction: action, activity: 'waiting', ...localizedMessage('message.level4.wait') };
};
export function createRun(program: L4Program): RunDefinition<L4State, L4Action | undefined> {
  const actions = [...program.actions];
  return { initialState, step, inputSource: (tick) => actions[tick - 1] };
}
