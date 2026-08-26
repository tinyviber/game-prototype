import type { Ticker } from 'pixi.js';

export interface TickDriver {
  start(): void;
  stop(): void;
  step(): void;
  reset(): void;
  readonly running: boolean;
}

/** Wall-clock time only paces deterministic ticks; it never enters a level simulation. */
export function createTickDriver(ticker: Ticker, msPerTick: number, onTick: (tick: number) => void): TickDriver {
  let elapsed = 0;
  let tick = 0;
  let running = false;
  const emitNextTick = () => {
    tick += 1;
    onTick(tick);
  };
  const listener = (frame: Ticker) => {
    if (!running) return;
    elapsed += frame.deltaMS;
    while (running && elapsed >= msPerTick) {
      elapsed -= msPerTick;
      emitNextTick();
    }
  };
  ticker.add(listener);
  return {
    start() { running = true; },
    stop() { running = false; },
    step() {
      if (!running) emitNextTick();
    },
    reset() { running = false; elapsed = 0; tick = 0; },
    get running() { return running; },
  };
}
