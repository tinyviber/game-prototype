import type { Tick } from '../core/types';

export interface ProbeShell {
  readonly stage: HTMLDivElement;
  readonly ui: HTMLDivElement;
  readonly log: HTMLDivElement;
  showTick(tick: Tick): void;
  logLine(text: string): void;
  resetLog(message: string): void;
}

/** The one place probe pages touch their DOM scaffold (#stage/#ui/#log/#tick). Each page's
 * markup provides these ids; everything above this layer stays DOM-free. */
export function mountProbeShell(): ProbeShell {
  const stage = document.querySelector<HTMLDivElement>('#stage')!;
  const ui = document.querySelector<HTMLDivElement>('#ui')!;
  const log = document.querySelector<HTMLDivElement>('#log')!;
  const tickLabel = document.querySelector<HTMLSpanElement>('#tick')!;
  return {
    stage,
    ui,
    log,
    showTick(tick) {
      tickLabel.textContent = String(tick);
    },
    logLine(text) {
      log.textContent = `${text}\n${log.textContent ?? ''}`;
    },
    resetLog(message) {
      log.textContent = message;
    },
  };
}

/** Shared button factory so probe UIs don't each rebuild the same createElement dance. */
export function createButton(label: string, onClick: () => void, className = 'btn'): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = className;
  btn.textContent = label;
  btn.addEventListener('click', onClick);
  return btn;
}
