import type { ThresholdRule } from './types';
import { createButton } from '../../ui/shell';

export interface DamUiHandlers {
  onRun(): void;
  onReset(): void;
}

export function mountDamUi(root: HTMLElement, rules: ThresholdRule[], handlers: DamUiHandlers): void {
  root.innerHTML = '';

  const hint = document.createElement('p');
  hint.className = 'hint';
  hint.textContent =
    'WHEN level < X -> sluice Y%. The first matching rule wins (declared order, not priority).';

  const ruleBox = document.createElement('div');

  function renderRules(): void {
    ruleBox.innerHTML = '';
    rules.forEach((rule, idx) => {
      const card = document.createElement('div');
      card.className = 'rule-card';
      const l1 = document.createElement('span');
      l1.textContent = 'WHEN level <';
      const in1 = document.createElement('input');
      in1.type = 'number';
      in1.value = String(rule.below);
      in1.addEventListener('change', () => {
        rules[idx] = { ...rules[idx]!, below: Number(in1.value) || 0 };
      });
      const l2 = document.createElement('span');
      l2.textContent = '\u2192 sluice';
      const in2 = document.createElement('input');
      in2.type = 'number';
      in2.value = String(rule.opening);
      in2.addEventListener('change', () => {
        rules[idx] = { ...rules[idx]!, opening: Number(in2.value) || 0 };
      });
      const l3 = document.createElement('span');
      l3.textContent = '%';
      const del = createButton('\u2715', () => {
        rules.splice(idx, 1);
        renderRules();
      });
      card.append(l1, in1, l2, in2, l3, del);
      ruleBox.appendChild(card);
    });
  }
  renderRules();

  const addBtn = createButton('+ rule', () => {
    rules.push({ below: 50, opening: 50 });
    renderRules();
  });

  const controls = document.createElement('div');
  controls.className = 'controls';
  controls.append(createButton('\u25B6 Run the river', handlers.onRun), createButton('\u21BA Reset', handlers.onReset));

  root.append(hint, ruleBox, addBtn, controls);
}
