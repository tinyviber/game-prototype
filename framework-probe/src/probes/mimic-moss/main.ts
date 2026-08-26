import { createPixiHost } from '../../rendering/pixi-host';
import { createTickDriver } from '../../rendering/tick-driver';
import { createMossRenderer, type MossView } from './render';
import { mountMossUi, type MossTool } from './ui';
import { createMossStep, initialMossState, mossIntentAt } from './sim';
import { computeLitMap, type LitCell } from './topology';
import { view } from '../../core/query';
import type { Direction, MossConfig, MossState, Plant } from './types';

const CELL = 40;

async function main(): Promise<void> {
  const stageEl = document.querySelector<HTMLDivElement>('#stage')!;
  const uiEl = document.querySelector<HTMLDivElement>('#ui')!;
  const logEl = document.querySelector<HTMLDivElement>('#log')!;
  const tickEl = document.querySelector<HTMLSpanElement>('#tick')!;

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
  let moveLog: { tick: number; move: Direction }[] = [];
  let running = false;

  const app = await createPixiHost(stageEl, {
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
      seed: 12345,
      sproutEveryTicks: 6,
      sproutChance: 0.18,
      matureDistance: 3,
      relaxationSteps: 30,
    };
  }

  let state: MossState = initialMossState(configNow());

  function logLine(text: string): void {
    logEl.textContent = `${text}\n${logEl.textContent ?? ''}`;
  }

  function draw(tick: number): void {
    const config = configNow();
    const v: MossView = view(state, tick, {
      litNow: (s: MossState, t: number) => {
        const lit = computeLitMap(s.plants, config.source, config.relaxationSteps);
        const filtered = new Map<string, LitCell>();
        for (const [key, cell] of lit) if (cell.dist <= t) filtered.set(key, cell);
        return filtered;
      },
      bloomed: (s: MossState) => s.bloomed,
      spores: (s: MossState) => s.spores,
      explorer: (s: MossState) => ({ x: s.explorerX, y: s.explorerY }),
      plants: (s: MossState) => s.plants,
    });
    renderer.render(v);
  }

  function onTick(tick: number): void {
    const config = configNow();
    const wasBloomed = state.bloomed;
    state = createMossStep(config)(state, tick, mossIntentAt(moveLog)(tick));
    tickEl.textContent = String(tick);
    draw(tick);
    if (state.bloomed && !wasBloomed) logLine(`t${tick}: the flower blooms — RED first, then BLUE.`);
    const atFlower = state.explorerX === config.flower.x && state.explorerY === config.flower.y;
    if (atFlower && state.bloomed) {
      logLine(`t${tick}: you step into the tunnel. WIN`);
      driver.stop();
      running = false;
    } else if (tick >= 200) {
      driver.stop();
      running = false;
    }
  }

  const driver = createTickDriver(app.ticker, 220, onTick);

  function reset(): void {
    driver.reset();
    running = false;
    moveLog = [];
    state = initialMossState(configNow());
    tickEl.textContent = '0';
    draw(0);
    logEl.textContent = 'The prism glows red at the far wall. The flower stays dormant.';
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
    draw(0);
  });

  const KEY_DIR: Record<string, Direction> = { ArrowUp: 'U', ArrowDown: 'D', ArrowLeft: 'L', ArrowRight: 'R' };
  window.addEventListener('keydown', (ev) => {
    if (!running) return;
    const dir = KEY_DIR[ev.key];
    if (!dir) return;
    ev.preventDefault();
    // Recorded as a sparse intent log so replay-from-tick-0 can reproduce a live run exactly.
    moveLog.push({ tick: Number(tickEl.textContent) + 1, move: dir });
  });

  mountMossUi(uiEl, {
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
