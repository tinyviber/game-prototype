import type { Application } from 'pixi.js';
import { Container, Graphics, Text } from 'pixi.js';

export interface DamView {
  readonly level: number;
  readonly opening: number;
  readonly outflow: number;
  readonly streak: number;
  readonly gate: boolean;
  readonly burst: boolean;
}

const BASIN_X = 20;
const BASIN_Y = 10;
const BASIN_W = 110;
const BASIN_H = 160;
const BURST_LEVEL = 100;

/** Draws the reservoir/sluice readout. Reads only `DamView`, never `DamState` directly. */
export function createDamRenderer(app: Application) {
  const root = new Container();
  root.x = 10;
  root.y = 10;
  app.stage.addChild(root);

  root.addChild(new Graphics().rect(BASIN_X, BASIN_Y, BASIN_W, BASIN_H).fill(0xcfd8d0));
  const burstLevelY = BASIN_Y + BASIN_H - (BURST_LEVEL / BURST_LEVEL) * BASIN_H;
  root.addChild(
    new Graphics()
      .moveTo(BASIN_X, burstLevelY)
      .lineTo(BASIN_X + BASIN_W, burstLevelY)
      .stroke({ width: 2, color: 0xc0392b }),
  );

  const water = new Graphics();
  root.addChild(water);
  const sluice = new Graphics();
  root.addChild(sluice);

  const gateText = new Text({ text: '\uD83D\uDD12 GATE SHUT', style: { fill: 0x8c2a1a, fontSize: 16, fontWeight: 'bold' } });
  gateText.x = BASIN_X + BASIN_W + 24;
  gateText.y = 16;
  root.addChild(gateText);

  const statsText = new Text({ text: '', style: { fill: 0x26313b, fontSize: 13, lineHeight: 20 } });
  statsText.x = BASIN_X + BASIN_W + 24;
  statsText.y = 48;
  root.addChild(statsText);

  return {
    render(view: DamView) {
      const heightPx = Math.min(BASIN_H, Math.max(0, (view.level / BURST_LEVEL) * BASIN_H));
      water
        .clear()
        .rect(BASIN_X + 3, BASIN_Y + BASIN_H - heightPx, BASIN_W - 6, heightPx)
        .fill(view.burst ? 0xc0392b : 0x4aa8e8);

      const openPx = (view.opening / 100) * 30;
      sluice
        .clear()
        .rect(BASIN_X + BASIN_W + 4, BASIN_Y + BASIN_H - 30, 10, 30)
        .fill(0xe8eef2)
        .rect(BASIN_X + BASIN_W + 4, BASIN_Y + BASIN_H - openPx, 10, openPx)
        .fill(0x5b6b7a);

      gateText.text = view.burst ? '\uD83D\uDCA5 DAM BURST' : view.gate ? '\uD83D\uDD13 GATE OPEN' : '\uD83D\uDD12 GATE SHUT';
      gateText.style.fill = view.burst ? 0xc0392b : view.gate ? 0x1c6b3a : 0x8c2a1a;
      statsText.text =
        `level ${view.level.toFixed(1)}\n` +
        `opening ${view.opening}%\n` +
        `outflow ${view.outflow.toFixed(2)}\n` +
        `band streak ${view.streak}`;
    },
  };
}
