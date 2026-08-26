import type { Application } from 'pixi.js';
import { Container, Graphics, Text } from 'pixi.js';
import type { LitCell } from './topology';
import type { Color, Plant, Point } from './types';

export interface MossView {
  readonly litNow: ReadonlyMap<string, LitCell>;
  readonly bloomed: boolean;
  readonly spores: number;
  readonly explorer: Point;
  readonly plants: readonly Plant[];
}

export interface MossLayout {
  readonly bounds: { readonly width: number; readonly height: number };
  readonly source: Point;
  readonly flower: Point;
  readonly fern: Point;
}

const CELL = 40;

function colorOf(color: Color): number {
  return color === 'R' ? 0xe8623a : 0x3a6fd8;
}

/** Draws the garden grid. Reads only `MossView` (a bag of post-tick queries), never `MossState`. */
export function createMossRenderer(app: Application, layout: MossLayout) {
  const root = new Container();
  root.x = 10;
  root.y = 10;
  app.stage.addChild(root);

  const gridBg = new Graphics();
  for (let x = 0; x < layout.bounds.width; x++) {
    for (let y = 0; y < layout.bounds.height; y++) {
      gridBg.rect(x * CELL, y * CELL, CELL, CELL).fill((x + y) % 2 ? 0xe9f0dc : 0xe4ecd4);
    }
  }
  root.addChild(gridBg);

  const sx = layout.source.x * CELL;
  const sy = layout.source.y * CELL;
  root.addChild(new Graphics().moveTo(sx + 6, sy + 32).lineTo(sx + 34, sy + 10).lineTo(sx + 34, sy + 32).fill(0xff8f6b));

  const fernG = new Graphics();
  root.addChild(fernG);

  const plantsLayer = new Container();
  root.addChild(plantsLayer);

  const flowerG = new Graphics();
  root.addChild(flowerG);

  const explorerG = new Graphics().circle(0, 0, 10).fill(0x37c8a5);
  root.addChild(explorerG);

  const sporesText = new Text({ text: '', style: { fill: 0xb98b4a, fontSize: 12 } });
  sporesText.y = layout.bounds.height * CELL + 6;
  root.addChild(sporesText);

  return {
    render(view: MossView) {
      plantsLayer.removeChildren();
      for (const plant of view.plants) {
        const lit = view.litNow.get(`${plant.x},${plant.y}`);
        const cx = plant.x * CELL + CELL / 2;
        const cy = plant.y * CELL + CELL / 2;
        const g = new Graphics().circle(cx, cy, lit ? 13 : 10).fill(lit ? colorOf(lit.color) : 0x79a860);
        if (plant.type === 'dye') g.circle(cx, cy, 4).fill(0x6b4a8a);
        plantsLayer.addChild(g);
      }

      const fx = layout.fern.x * CELL + CELL / 2;
      const fy = layout.fern.y * CELL + CELL / 2;
      fernG.clear().circle(fx, fy, 9).fill(view.spores > 0 ? 0xe8623a : 0x5f6e52);

      const flx = layout.flower.x * CELL + CELL / 2;
      const fly = layout.flower.y * CELL + CELL / 2;
      flowerG.clear().circle(flx, fly, view.bloomed ? 14 : 8).fill(view.bloomed ? 0xf28bb2 : 0x9aa8a0);

      explorerG.x = view.explorer.x * CELL + CELL / 2;
      explorerG.y = view.explorer.y * CELL + CELL / 2;

      sporesText.text = view.spores > 0 ? `spores: ${view.spores}` : '';
    },
  };
}
