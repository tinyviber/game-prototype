export type ProtagonistActivity = 'idle' | 'moving' | 'acting' | 'waiting' | 'confused' | 'failed' | 'success';

export interface ProtagonistView {
  readonly x: number;
  readonly y: number;
  readonly facing: 'left' | 'right';
  readonly activity: ProtagonistActivity;
  readonly held?: string;
}
