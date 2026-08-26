export type Color = 'R' | 'B';
export type CapType = 'RELAY' | 'PRISM' | 'SNAIL';

/** "S0".."S2" spouts, "M0".."M4" mushrooms, "D0".."D2" door sockets. */
export type NodeId = string;

export interface SporeConfig {
  /** One color broadcast to every wired spout on each beat. */
  readonly sequence: readonly Color[];
  readonly expected: readonly [Color, Color, Color];
  readonly spouts: readonly NodeId[];
  readonly caps: Readonly<Record<NodeId, CapType>>;
  /** Fixed per run: out-port -> in-port. Rewiring only happens between runs (authoring time). */
  readonly wires: Readonly<Record<NodeId, NodeId>>;
  readonly beatEveryTicks: number;
  readonly hopTicks: number;
  readonly dwellTicks: Readonly<Record<CapType, number>>;
}

export interface Pulse {
  readonly from: NodeId;
  readonly to: NodeId;
  readonly color: Color;
  readonly ticksRemaining: number;
}

export interface SporeState {
  readonly pulses: readonly Pulse[];
  readonly filled: readonly [boolean, boolean, boolean];
  /** Monotonic latch: true once the door has opened OR slammed. Terminal either way. */
  readonly ended: boolean;
  readonly won: boolean;
  readonly failedSocket: number | null;
}

export type SporeIntent = void;
