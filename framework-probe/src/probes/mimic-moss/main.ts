import { createPixiHost } from '../../rendering/pixi-host';
import { createTickDriver } from '../../rendering/tick-driver';
import { createMossRenderer } from './render';
import { mountMossUi, type MossTool } from './ui';
import { createMossRun } from './sim';
import { computeLitMap, type LitCell } from './topology';
import { createHistory } from '../../services/history';
import { mountProbeShell } from '../../ui/shell';
import type { MossConfig, Plant } from './types';

const CELL = 40;
const RELAXATION_STEPS = 30;

async function main(): Promise<void> {
  const shell = mountProbeShell();

  const layout = {
    bounds: { width: 10, height: 6 },
    source: { x: 0, y: 3, color: 'R' as const },
    flower: { x: 9, y: 3 },
    fern: { x: 5, y: 1 },
  };
  // The intuitive-but-wrong default from the source demo: a moss stub that dies at a gap.
  let plants: Plant[] = [
    { x: 1, y: 3, type: 'moss' },
    { x: 2, y: 3, type: 'moss' },
  ];
  let tool: MossTool = 'plant';
  let running = false;

  const app = await createPixiHost(shell.stage, {
    width: layout.bounds.width * CELL + 20,
    height: layout.bounds.height * CELL + 40,
    background: '#eef3e6',
  });
  const renderer = createMossRenderer(app, layout);

  function configNow(): MossConfig {
    return {
      plants,
      source: layout.source,
      flower: layout.flower,
      fern: layout.fern,
      bounds: layout.bounds,
      relaxationSteps: RELAXATION_STEPS,
    };
  }

  // Topology is static per authoring session: the light map is solved once per edit/reset and
  // only filtered by `dist <= tick` at draw time — never re-propagated per frame.
  let activeConfig = configNow();
  let litMap = computeLitMap(activeConfig.plants, activeConfig.source, activeConfig.relaxationSteps);

  function relight(): void {
    litMap = computeLitMap(activeConfig.plants, activeConfig.source, activeConfig.relaxationSteps);
  }

  // The history is the playback state; draw reads cached timeline entries, never a shadow copy.
  let history = createHistory(createMossRun(activeConfig));

  function draw(tick: number): void {
    const s = history.stateAt(tick);
    const litNow = new Map<string, LitCell>();
    for (const [key, cell] of litMap) if (cell.dist <= tick) litNow.set(key, cell);
    renderer.render({ litNow, bloomed: s.bloomed, spores: s.spores, plants });
  }

  const driver = createTickDriver(app.ticker, 220, (tick) => {
    const prev = history.stateAt(tick - 1);
    const next = history.stateAt(tick);
    shell.showTick(tick);
    draw(tick);
    if (next.bloomed && !prev.bloomed) shell.logLine(`t${tick}: the flower blooms — RED first, then BLUE.`);
    if (tick >= 200) {
      driver.stop();
      running = false;
    }
  });

  function reset(): void {
    driver.reset();
    running = false;
    activeConfig = configNow();
    relight();
    history = createHistory(createMossRun(activeConfig));
    shell.showTick(0);
    draw(0);
    shell.resetLog('The prism glows red at the far wall. The flower stays dormant.');
  }

  app.canvas.addEventListener('click', (ev) => {
    if (running) return;
    const rect = app.canvas.getBoundingClientRect();
    const cx = Math.floor((ev.clientX - rect.left - 10) / CELL);
    const cy = Math.floor((ev.clientY - rect.top - 10) / CELL);
    if (cx < 0 || cy < 0 || cx >= layout.bounds.width || cy >= layout.bounds.height) return;
    const reserved =
      (cx === layout.source.x && cy === layout.source.y) ||
      (cx === layout.flower.x && cy === layout.flower.y) ||
      (cx === layout.fern.x && cy === layout.fern.y);
    if (reserved) return;
    const idx = plants.findIndex((p) => p.x === cx && p.y === cy);
    if (tool === 'prune') {
      if (idx >= 0) plants.splice(idx, 1);
    } else {
      const type = tool === 'dye' ? 'dye' : 'moss';
      if (idx >= 0) plants[idx] = { x: cx, y: cy, type };
      else plants.push({ x: cx, y: cy, type });
    }
    relight();
    draw(0);
  });

  mountMossUi(shell.ui, {
    onToolChange(next) {
      tool = next;
    },
    onRun() {
      reset();
      running = true;
      driver.start();
    },
    onReset: reset,
  });

  reset();
}

void main();
