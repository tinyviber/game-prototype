import type { ProtagonistView } from '../../character/types';
import type { L2State } from './sim';

export interface L2View { readonly protagonist: ProtagonistView; readonly tick: number; readonly phase: L2State['phase']; readonly tile: L2State['tile']; readonly lastAction?: L2State['lastAction']; readonly status: L2State['status']; readonly message: string; }
export function toView(state: Readonly<L2State>): L2View {
  return { protagonist: { x: 110 + state.position * 190, y: 270, facing: 'right', activity: state.activity }, tick: state.tick, phase: state.phase, tile: state.tile, lastAction: state.lastAction, status: state.status, message: state.message };
}
