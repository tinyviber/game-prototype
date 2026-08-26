import type { Instr } from './types';

export interface EchoUiHandlers {
  onRun(): void;
  onReset(): void;
}

const OPS: readonly Instr[] = ['MOVE', 'WAIT', 'PRESS'];

function button(label: string, onClick: () => void): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = label;
  btn.addEventListener('click', onClick);
  return btn;
}

function buildEditor(title: string, program: Instr[], onChange: () => void): HTMLElement {
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
        onChange();
      });
      const del = button('\u2715', () => {
        program.splice(idx, 1);
        renderList();
        onChange();
      });
      row.append(label, select, del);
      list.appendChild(row);
    });
  }
  renderList();
  box.appendChild(button('+ step', () => { program.push('WAIT'); renderList(); onChange(); }));
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
  editors.append(
    buildEditor('Echo Program', echoProgram, () => undefined),
    buildEditor('Live Program', liveProgram, () => undefined),
  );
  const controls = document.createElement('div');
  controls.className = 'controls';
  controls.append(button('\u25B6 Run Both Tracks', handlers.onRun), button('\u21BA Reset', handlers.onReset));
  root.append(editors, controls);
}
