import type { CapType, NodeId } from './types';

export interface SporeUiHandlers {
  onRun(): void;
  onReset(): void;
}

const CAP_CYCLE: readonly CapType[] = ['RELAY', 'PRISM', 'SNAIL'];

export function mountSporeUi(
  root: HTMLElement,
  spouts: readonly NodeId[],
  mushrooms: readonly NodeId[],
  sockets: readonly NodeId[],
  wires: Record<NodeId, NodeId>,
  caps: Record<NodeId, CapType>,
  handlers: SporeUiHandlers,
): void {
  root.innerHTML = '';

  const hint = document.createElement('p');
  hint.className = 'hint';
  hint.textContent = 'Wire each spout/mushroom to its next stop. Tap a cap to cycle relay \u00BB / prism \u21C4 / snail @.';

  function renderWireRow(from: NodeId, capButton?: HTMLButtonElement): HTMLElement {
    const row = document.createElement('div');
    row.className = 'wire-row';
    const label = document.createElement('span');
    label.textContent = from;
    const select = document.createElement('select');
    const targets = ['', ...mushrooms, ...sockets].filter((t) => t !== from);
    for (const target of targets) {
      const opt = document.createElement('option');
      opt.value = target;
      opt.textContent = target === '' ? '(unwired)' : `\u2192 ${target}`;
      opt.selected = (wires[from] ?? '') === target;
      select.appendChild(opt);
    }
    select.addEventListener('change', () => {
      if (select.value) wires[from] = select.value;
      else delete wires[from];
    });
    row.append(label, select);
    if (capButton) row.appendChild(capButton);
    return row;
  }

  const wireBox = document.createElement('div');
  for (const spout of spouts) wireBox.appendChild(renderWireRow(spout));

  const capBox = document.createElement('div');
  for (const mushroom of mushrooms) {
    const capBtn = document.createElement('button');
    capBtn.className = 'btn';
    capBtn.textContent = caps[mushroom] ?? 'RELAY';
    capBtn.addEventListener('click', () => {
      const current = caps[mushroom] ?? 'RELAY';
      const next = CAP_CYCLE[(CAP_CYCLE.indexOf(current) + 1) % CAP_CYCLE.length]!;
      caps[mushroom] = next;
      capBtn.textContent = next;
    });
    capBox.appendChild(renderWireRow(mushroom, capBtn));
  }

  const controls = document.createElement('div');
  controls.className = 'controls';
  const runBtn = document.createElement('button');
  runBtn.className = 'btn primary';
  runBtn.textContent = 'chantsong \u25B6';
  runBtn.addEventListener('click', handlers.onRun);
  const resetBtn = document.createElement('button');
  resetBtn.className = 'btn';
  resetBtn.textContent = '\u21BA reset workshop';
  resetBtn.addEventListener('click', handlers.onReset);
  controls.append(runBtn, resetBtn);

  root.append(hint, wireBox, capBox, controls);
}
