import type { Application } from 'pixi.js';
import { Container, Graphics, Text } from 'pixi.js';
import type { CapType, NodeId, Pulse, SporeConfig } from './types';

export interface SporeView {
  readonly pulses: readonly Pulse[];
  readonly filled: readonly [boolean, boolean, boolean];
  readonly ended: boolean;
  readonly won: boolean;
  readonly failedSocket: number | null;
}

export interface SporeLayout {
  readonly spouts: readonly NodeId[];
  readonly mushrooms: readonly NodeId[];
  readonly sockets: readonly NodeId[];
  readonly positions: Readonly<Record<NodeId, { x: number; y: number }>>;
}

const CAP_GLYPH: Record<CapType, string> = { RELAY: '\u00BB', PRISM: '\u21C4', SNAIL: '@' };
const COLOR_HEX = { R: 0xff6b81, B: 0x5ab7ff } as const;

/** Draws spouts/mushrooms/sockets, current wiring, and in-flight pulses. Reads only
 * `SporeView` + the frozen `SporeConfig` (wires/caps do not change mid-run). */
export function createSporeRenderer(app: Application, config: SporeConfig, layout: SporeLayout) {
  const root = new Container();
  root.x = 20;
  root.y = 20;
  app.stage.addChild(root);
  const pos = (id: NodeId) => layout.positions[id]!;

  const wireLayer = new Graphics();
  root.addChild(wireLayer);
  for (const [from, to] of Object.entries(config.wires)) {
    const a = pos(from);
    const b = pos(to);
    wireLayer.moveTo(a.x, a.y).lineTo(b.x, b.y).stroke({ width: 3, color: 0x6a5fae });
  }

  const nodeLayer = new Container();
  root.addChild(nodeLayer);
  for (const spout of layout.spouts) {
    const p = pos(spout);
    nodeLayer.addChild(new Graphics().circle(p.x, p.y, 10).fill(0x8f7fd8));
  }
  for (const mushroom of layout.mushrooms) {
    const p = pos(mushroom);
    nodeLayer.addChild(new Graphics().circle(p.x, p.y, 14).fill(0x79c99b).stroke({ width: 2, color: 0x241f47 }));
    const label = new Text({ text: CAP_GLYPH[config.caps[mushroom]!], style: { fill: 0x241f47, fontSize: 13, fontWeight: 'bold' } });
    label.anchor.set(0.5);
    label.x = p.x;
    label.y = p.y;
    nodeLayer.addChild(label);
  }
  layout.sockets.forEach((socket, idx) => {
    const p = pos(socket);
    nodeLayer.addChild(new Graphics().circle(p.x, p.y, 16).fill(0x241f47).stroke({ width: 2, color: 0x564993 }));
    nodeLayer.addChild(new Graphics().circle(p.x, p.y, 7).fill(COLOR_HEX[config.expected[idx]!]));
  });

  const pulseLayer = new Graphics();
  root.addChild(pulseLayer);

  const statusText = new Text({ text: '', style: { fill: 0x26313b, fontSize: 14, fontWeight: 'bold' } });
  statusText.y = 240;
  root.addChild(statusText);

  const maxSpan = config.hopTicks + Math.max(...Object.values(config.dwellTicks));

  return {
    render(view: SporeView) {
      pulseLayer.clear();
      for (const pulse of view.pulses) {
        const a = pos(pulse.from);
        const b = pos(pulse.to);
        const progress = 1 - Math.max(0, Math.min(1, pulse.ticksRemaining / maxSpan));
        pulseLayer.circle(a.x + (b.x - a.x) * progress, a.y + (b.y - a.y) * progress, 6).fill(COLOR_HEX[pulse.color]);
      }

      if (view.won) {
        statusText.text = 'The old road opens!';
        statusText.style.fill = 0x1c6b3a;
      } else if (view.ended) {
        statusText.text = `Socket ${(view.failedSocket ?? 0) + 1} slammed shut.`;
        statusText.style.fill = 0xc0392b;
      } else {
        statusText.text = `${view.filled.filter(Boolean).length}/3 sockets filled`;
        statusText.style.fill = 0x26313b;
      }
    },
  };
}
