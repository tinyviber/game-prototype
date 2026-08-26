export type Color = 'R' | 'B';
export type PlantType = 'moss' | 'dye';

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface Plant extends Point {
  readonly type: PlantType;
}

export interface MossConfig {
  readonly plants: readonly Plant[];
  readonly source: Point & { readonly color: Color };
  readonly flower: Point;
  readonly fern: Point;
  readonly bounds: { readonly width: number; readonly height: number };
  /** Relaxation iterations for the BFS-style distance solve; must exceed the largest possible path length. */
  readonly relaxationSteps: number;
}

export interface MossState {
  readonly spores: number;
  readonly firstColor: Color | null;
  readonly secondColor: Color | null;
  readonly bloomed: boolean;
}

export type MossIntent = void;
