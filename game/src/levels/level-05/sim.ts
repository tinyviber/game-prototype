import type { RunDefinition, StepFn } from '../../core/types';
import { localizedMessage, reference, type LocalizedMessage } from '../../i18n';

export type L5Sensor = 'left' | 'right';
export type L5Actuator = 'leftArm' | 'rightArm';
export interface L5Bindings { readonly left: L5Actuator; readonly right: L5Actuator; }
export interface L5State {
  readonly tick: number; readonly bindings: L5Bindings; readonly sensor?: L5Sensor; readonly actuator?: L5Actuator;
  readonly status: 'running' | 'failed' | 'success'; readonly activity: 'idle' | 'acting' | 'confused' | 'failed' | 'success';
  readonly wallHit: boolean; readonly message: LocalizedMessage['message']; readonly messageKey: LocalizedMessage['messageKey']; readonly messageParams?: LocalizedMessage['messageParams']; readonly failureBeat?: number;
}

export const defaultBindings: L5Bindings = { left: 'rightArm', right: 'leftArm' };
export const correctBindings: L5Bindings = { left: 'leftArm', right: 'rightArm' };

export const initialState: L5State = { tick: 0, bindings: defaultBindings, status: 'running', activity: 'idle', wallHit: false, ...localizedMessage('message.level5.initial') };
export const step: StepFn<L5State, L5Bindings> = (previous, tick, bindings) => {
  if (previous.status !== 'running') return { ...previous, tick, bindings };
  const sensor: L5Sensor | undefined = tick === 1 ? 'left' : tick === 2 ? 'right' : undefined;
  if (!sensor) return { ...previous, tick, bindings, ...localizedMessage('message.level5.settles') };
  const actuator = bindings[sensor];
  const correct = actuator === (sensor === 'left' ? 'leftArm' : 'rightArm');
  if (!correct) return { ...previous, tick, bindings, sensor, actuator, status: 'failed', activity: 'confused', wallHit: true, ...localizedMessage('message.level5.wallHit', { sensor: reference(sensor === 'left' ? 'binding.leftSensor' : 'binding.rightSensor'), actuator: reference(actuator === 'leftArm' ? 'binding.leftArm' : 'binding.rightArm') }), failureBeat: tick };
  const success = sensor === 'right';
  return { ...previous, tick, bindings, sensor, actuator, status: success ? 'success' : 'running', activity: success ? 'success' : 'acting', ...localizedMessage(success ? 'message.level5.restored' : 'message.level5.leftAnswers') };
};
export function createRun(bindings: L5Bindings): RunDefinition<L5State, L5Bindings> {
  const snapshot = { ...bindings };
  return { initialState: { ...initialState, bindings: snapshot }, step, inputSource: () => snapshot };
}
