import type { Ticker } from 'pixi.js';

export interface TickDriver {
  start(): void;
  stop(): void;
  reset(): void;
  readonly running: boolean;
}

/**
 * Converts PixiJS's real-time ticker into discrete simulation ticks at a fixed rate. This is
 * the ONLY place real time (`deltaMS`) is read anywhere in the four probes — it exists purely
 * to pace playback, never to compute gameplay values, so `src/core` never sees wall-clock time.
 */
export function createTickDriver(ticker: Ticker, msPerTick: number, onTick: (tick: number) => void): TickDriver {
  let elapsedMs = 0;
  let tick = 0;
  let running = false;

  ticker.add((t) => {
    if (!running) return;
    elapsedMs += t.deltaMS;
    while (running && elapsedMs >= msPerTick) {
      elapsedMs -= msPerTick;
      tick += 1;
      onTick(tick);
    }
  });

  return {
    start() {
      running = true;
    },
    stop() {
      running = false;
    },
    reset() {
      tick = 0;
      elapsedMs = 0;
      running = false;
    },
    get running() {
      return running;
    },
  };
}
