import type { ProtagonistView } from '../../character/types';
import type { L5State } from './sim';

export interface L5View { readonly protagonist: ProtagonistView; readonly tick: number; readonly bindings: L5State['bindings']; readonly sensor?: L5State['sensor']; readonly actuator?: L5State['actuator']; readonly wallHit: boolean; readonly status: L5State['status']; readonly message: string; }
export function toView(state: Readonly<L5State>): L5View {
  return { protagonist: { x: 450, y: 270, facing: 'right', activity: state.activity }, tick: state.tick, bindings: state.bindings, sensor: state.sensor, actuator: state.actuator, wallHit: state.wallHit, status: state.status, message: state.message };
}
