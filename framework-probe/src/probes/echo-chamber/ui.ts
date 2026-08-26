import type { Instr } from './types';
import { createButton } from '../../ui/shell';

export interface EchoUiHandlers {
  onRun(): void;
  onReset(): void;
}

const OPS: readonly Instr[] = ['MOVE', 'WAIT', 'PRESS'];

/** Edits the program array in place; the next Run snapshots whatever is authored by then. */
function buildEditor(title: string, program: Instr[]): HTMLElement {
  const box = document.createElement('div');
  box.className = 'editor';
  const heading = document.createElement('h3');
  heading.textContent = title;
  const list = document.createElement('div');
  box.append(heading, list);

  function renderList() {
    list.innerHTML = '';
    program.forEach((step, idx) => {
      const row = document.createElement('div');
      row.className = 'step-row';
      const label = document.createElement('span');
      label.textContent = `T${idx + 1}`;
      const select = document.createElement('select');
      for (const op of OPS) {
        const opt = document.createElement('option');
        opt.value = op;
        opt.textContent = op;
        opt.selected = step === op;
        select.appendChild(opt);
      }
      select.addEventListener('change', () => {
        program[idx] = select.value as Instr;
      });
      const del = createButton('\u2715', () => {
        program.splice(idx, 1);
        renderList();
      });
      row.append(label, select, del);
      list.appendChild(row);
    });
  }
  renderList();
  box.appendChild(createButton('+ step', () => { program.push('WAIT'); renderList(); }));
  return box;
}

export function mountEchoUi(
  root: HTMLElement,
  echoProgram: Instr[],
  liveProgram: Instr[],
  handlers: EchoUiHandlers,
): void {
  root.innerHTML = '';
  const editors = document.createElement('div');
  editors.className = 'editors';
  editors.append(buildEditor('Echo Program', echoProgram), buildEditor('Live Program', liveProgram));
  const controls = document.createElement('div');
  controls.className = 'controls';
  controls.append(
    createButton('\u25B6 Run Both Tracks', handlers.onRun),
    createButton('\u21BA Reset', handlers.onReset),
  );
  root.append(editors, controls);
}
