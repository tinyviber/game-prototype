import type { ProtagonistView } from '../../character/types';
import type { L4State } from './sim';

export interface L4View { readonly protagonist: ProtagonistView; readonly tick: number; readonly serviced: number; readonly capsuleLength: number; readonly recording: boolean; readonly replaying: boolean; readonly lastAction?: L4State['lastAction']; readonly status: L4State['status']; readonly message: string; }
export function toView(state: Readonly<L4State>): L4View {
  return { protagonist: { x: 110 + state.position * 190, y: 270, facing: 'right', activity: state.activity }, tick: state.tick, serviced: state.serviced, capsuleLength: state.capsule.length, recording: state.recording, replaying: state.replayQueue.length > 0, lastAction: state.lastAction, status: state.status, message: state.message };
}
