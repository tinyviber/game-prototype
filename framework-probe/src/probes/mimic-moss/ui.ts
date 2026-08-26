export type MossTool = 'plant' | 'dye' | 'prune';

export interface MossUiHandlers {
  onToolChange(tool: MossTool): void;
  onRun(): void;
  onReset(): void;
}

export function mountMossUi(root: HTMLElement, handlers: MossUiHandlers): void {
  root.innerHTML = '';

  const tools = document.createElement('div');
  tools.className = 'tools';
  const specs: { tool: MossTool; label: string }[] = [
    { tool: 'plant', label: '\uD83C\uDF31 plant moss' },
    { tool: 'dye', label: '\uD83D\uDC9C plant dye' },
    { tool: 'prune', label: '\u2702\uFE0F prune' },
  ];
  const buttons = specs.map(({ tool, label }) => {
    const btn = document.createElement('button');
    btn.className = 'tool';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('on'));
      btn.classList.add('on');
      handlers.onToolChange(tool);
    });
    return btn;
  });
  buttons[0]!.classList.add('on');
  tools.append(...buttons);

  const hint = document.createElement('p');
  hint.className = 'hint';
  hint.textContent =
    'Click the grid to place/remove moss before pressing Grow. Arrow keys move the explorer while it runs. ' +
    'Wire a short plain path (arrives RED) and a longer dyed path (arrives BLUE) to the flower.';

  const controls = document.createElement('div');
  controls.className = 'controls';
  const runBtn = document.createElement('button');
  runBtn.className = 'btn primary';
  runBtn.textContent = '\u25B6 Grow';
  runBtn.addEventListener('click', handlers.onRun);
  const resetBtn = document.createElement('button');
  resetBtn.className = 'btn';
  resetBtn.textContent = '\u21BA Reset';
  resetBtn.addEventListener('click', handlers.onReset);
  controls.append(runBtn, resetBtn);

  root.append(tools, hint, controls);
}
