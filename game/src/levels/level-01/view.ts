import type { L1State } from './sim';
import type { ProtagonistView } from '../../character/types';

export interface L1View {
  readonly protagonist: ProtagonistView;
  readonly gateOpen: boolean;
  readonly gateProgress: number;
  readonly gateWallY: number;
  readonly gateWallHeight: number;
  readonly lastAction?: L1State['lastAction'];
  readonly status: L1State['status'];
  readonly message: string;
}

export const GATE_WALL_CLIP = { x: 466, y: 135, width: 62, height: 165 } as const;
const GATE_WALL_TRAVEL = 287;

export function gateWallView(progress: number): { readonly y: number; readonly height: number } {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const y = GATE_WALL_CLIP.y + clampedProgress * GATE_WALL_TRAVEL;
  const height = Math.max(0, Math.min(GATE_WALL_CLIP.height, GATE_WALL_CLIP.y + GATE_WALL_CLIP.height - y));
  return { y, height };
}

export function toView(state: Readonly<L1State>): L1View {
  const gateProgress = state.gateOpen ? Math.min(1, Math.max(0, (state.tick - (state.gateOpenedAt ?? state.tick)) / 2)) : 0;
  const gateWall = gateWallView(gateProgress);
  return {
    protagonist: { x: 110 + state.position * 190, y: 270, facing: 'right', activity: state.activity },
    gateOpen: state.gateOpen,
    gateProgress,
    gateWallY: gateWall.y,
    gateWallHeight: gateWall.height,
    lastAction: state.lastAction,
    status: state.status,
    message: state.message,
  };
}
