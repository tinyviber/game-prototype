import { subscribe, t } from '../i18n';

export interface WorkbenchShell {
  readonly authoring: HTMLDivElement;
  readonly hint: HTMLParagraphElement;
  setLevel(title: string, description: string, unlocked: string): void;
  setRunState(state: 'idle' | 'running' | 'debugging' | 'complete' | 'failed'): void;
  setMessage(message: string): void;
  setRunHandler(handler: () => void): void;
  setStepHandler(handler: () => void): void;
  setResetHandler(handler: () => void): void;
  showNext(handler: () => void): void;
}

export function createWorkbenchShell(root: HTMLElement): WorkbenchShell {
  root.replaceChildren();
  root.className = 'workbench-card';
  const title = element('h2', 'workbench-title');
  const description = element('p', 'workbench-description');
  const unlocked = element('p', 'unlocked-line');
  const authoringLabel = element('p', 'section-label');
  const authoring = document.createElement('div');
  authoring.className = 'authoring-area';
  const hint = element('p', 'workbench-hint');
  const controls = document.createElement('div');
  controls.className = 'workbench-controls';
  const run = button('', 'run-button');
  const step = button('', 'step-button');
  const reset = button('', 'reset-button');
  controls.append(run, step, reset);
  const next = button('', 'next-button');
  next.hidden = true;
  const message = element('p', 'workbench-message');
  root.append(title, description, unlocked, authoringLabel, authoring, hint, controls, next, message);
  let runState: 'idle' | 'running' | 'debugging' | 'complete' | 'failed' = 'idle';
  const updateLabels = () => {
    authoringLabel.textContent = t('workbench.authoringArea');
    run.textContent = runState === 'running' ? t('workbench.running') : t('workbench.run');
    step.textContent = runState === 'debugging' ? t('workbench.stepNext') : t('workbench.stepDebug');
    reset.textContent = t('workbench.reset');
    next.textContent = t('workbench.openNextRoom');
  };
  updateLabels();
  subscribe(updateLabels);
  return {
    authoring,
    hint,
    setLevel(levelTitle, levelDescription, abilities) {
      title.textContent = levelTitle;
      description.textContent = levelDescription;
      unlocked.textContent = t('workbench.atHand', { abilities });
    },
    setRunState(state) {
      runState = state;
      root.dataset.runState = state;
      run.disabled = state === 'running' || state === 'debugging';
      step.disabled = state === 'running';
      reset.disabled = state === 'running';
      updateLabels();
      if (state !== 'complete') next.hidden = true;
    },
    setMessage(text) { message.textContent = text; },
    setRunHandler(handler) { run.onclick = handler; },
    setStepHandler(handler) { step.onclick = handler; },
    setResetHandler(handler) { reset.onclick = handler; },
    showNext(handler) { next.hidden = false; next.onclick = handler; },
  };
}

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  return node;
}
function button(text: string, className: string): HTMLButtonElement {
  const node = document.createElement('button');
  node.type = 'button';
  node.className = className;
  node.textContent = text;
  return node;
}
