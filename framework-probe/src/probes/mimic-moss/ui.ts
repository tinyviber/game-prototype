import { createButton } from '../../ui/shell';

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
    const btn = createButton(label, () => {
      buttons.forEach((b) => b.classList.remove('on'));
      btn.classList.add('on');
      handlers.onToolChange(tool);
    }, 'tool');
    return btn;
  });
  buttons[0]!.classList.add('on');
  tools.append(...buttons);

  const hint = document.createElement('p');
  hint.className = 'hint';
  hint.textContent =
    'Click the grid to place/remove moss before pressing Grow. ' +
    'Wire a short plain path (arrives RED) and a longer dyed path (arrives BLUE) to the flower.';

  const controls = document.createElement('div');
  controls.className = 'controls';
  controls.append(
    createButton('\u25B6 Grow', handlers.onRun, 'btn primary'),
    createButton('\u21BA Reset', handlers.onReset),
  );

  root.append(tools, hint, controls);
}
