export type Instr = 'MOVE' | 'WAIT' | 'PRESS';

export interface EchoConfig {
  readonly echoProgram: readonly Instr[];
  readonly liveProgram: readonly Instr[];
  readonly echoPlate: number;
  readonly livePlate: number;
}

export interface EchoState {
  readonly echoPos: number;
  readonly livePos: number;
  /** Transient: true only on the tick the lane actually pressed. Recomputed every tick,
   * never carried forward — contrast with `gateOpened`, which is a monotonic latch. */
  readonly echoPressed: boolean;
  readonly livePressed: boolean;
  readonly gateOpened: boolean;
}

export interface EchoIntent {
  readonly echoInstr: Instr | undefined;
  readonly liveInstr: Instr | undefined;
}
