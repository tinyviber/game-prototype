export type Color = 'R' | 'B';
export type PlantType = 'moss' | 'dye';

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface Plant extends Point {
  readonly type: PlantType;
}

export type Direction = 'U' | 'D' | 'L' | 'R';

export interface MossConfig {
  readonly plants: readonly Plant[];
  readonly source: Point & { readonly color: Color };
  readonly flower: Point;
  readonly fern: Point;
  readonly bounds: { readonly width: number; readonly height: number };
  readonly seed: number;
  readonly sproutEveryTicks: number;
  readonly sproutChance: number;
  /** Minimum lit distance from the source before a plant counts as "mature" enough to sprout. */
  readonly matureDistance: number;
  /** Relaxation iterations for the BFS-style distance solve; must exceed the largest possible path length. */
  readonly relaxationSteps: number;
}

export interface MossState {
  readonly plants: readonly Plant[];
  readonly spores: number;
  readonly firstColor: Color | null;
  readonly secondColor: Color | null;
  readonly bloomed: boolean;
  readonly explorerX: number;
  readonly explorerY: number;
  readonly rngState: number;
}

export interface MossIntent {
  readonly move?: Direction;
}
