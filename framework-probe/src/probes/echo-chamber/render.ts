import type { Application } from 'pixi.js';
import { Container, Graphics, Text } from 'pixi.js';

export interface EchoView {
  readonly echoPos: number;
  readonly livePos: number;
  readonly gateOpened: boolean;
}

export interface EchoLaneSpec {
  readonly plate: number;
  readonly length: number;
}

const CELL = 42;
const GAP = 5;
const LANE_GAP = 64;

function buildLane(spec: EchoLaneSpec, tokenColor: number) {
  const container = new Container();
  const bg = new Graphics();
  for (let i = 0; i < spec.length; i++) {
    bg.rect(i * (CELL + GAP), 0, CELL, CELL).fill(i === spec.plate ? 0xffe3a8 : 0xffffff);
  }
  container.addChild(bg);
  const token = new Graphics().circle(CELL / 2, CELL / 2, CELL / 3).fill(tokenColor);
  token.y = 0;
  container.addChild(token);
  return { container, token };
}

/** Draws the two echo/live lanes and the gate readout. Reads only the `EchoView` shape —
 * never `EchoState` directly — so this file cannot depend on simulation internals changing. */
export function createEchoRenderer(app: Application, echo: EchoLaneSpec, live: EchoLaneSpec) {
  const root = new Container();
  root.x = 16;
  root.y = 16;
  app.stage.addChild(root);

  const echoLane = buildLane(echo, 0x3fae6a);
  const liveLane = buildLane(live, 0x6d5fce);
  liveLane.container.y = LANE_GAP;
  root.addChild(echoLane.container, liveLane.container);

  const gateText = new Text({
    text: '\uD83D\uDD12 GATE SHUT',
    style: { fill: 0x8c2a1a, fontSize: 16, fontWeight: 'bold' },
  });
  gateText.y = LANE_GAP * 2 + 8;
  root.addChild(gateText);

  return {
    render(view: EchoView) {
      echoLane.token.x = view.echoPos * (CELL + GAP);
      liveLane.token.x = view.livePos * (CELL + GAP);
      gateText.text = view.gateOpened ? '\uD83D\uDD13 GATE OPEN' : '\uD83D\uDD12 GATE SHUT';
      gateText.style.fill = view.gateOpened ? 0x1c6b3a : 0x8c2a1a;
    },
  };
}
