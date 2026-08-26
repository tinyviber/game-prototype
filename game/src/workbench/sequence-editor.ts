import { subscribe, t } from '../i18n';

export interface SequenceEditorOptions {
  readonly root: HTMLElement;
  readonly initial: readonly string[];
  readonly palette: readonly string[];
  readonly label: (token: string) => string;
  readonly onChange?: (tokens: readonly string[]) => void;
}

export interface MountedSequenceEditor {
  readonly read: () => string[];
  destroy(): void;
}

export function mountSequenceEditor(options: SequenceEditorOptions): MountedSequenceEditor {
  let tokens = [...options.initial];
  const render = () => {
    options.root.replaceChildren();
    options.root.className = 'sequence-editor';
    tokens.forEach((token, index) => {
      const row = document.createElement('div');
      row.className = 'command-row';
      const number = document.createElement('span');
      number.className = 'command-number';
      number.textContent = `${index + 1}`;
      const select = document.createElement('select');
      select.className = 'command-select';
      options.palette.forEach((choice) => {
        const option = document.createElement('option');
        option.value = choice;
        option.textContent = options.label(choice);
        option.selected = choice === token;
        select.append(option);
      });
      select.addEventListener('change', () => {
        tokens[index] = select.value;
        options.onChange?.(tokens);
      });
      const up = button('↑', t('sequence.moveEarlier'), () => {
        if (index > 0) [tokens[index - 1], tokens[index]] = [tokens[index], tokens[index - 1]];
        render();
        options.onChange?.(tokens);
      });
      const down = button('↓', t('sequence.moveLater'), () => {
        if (index < tokens.length - 1) [tokens[index + 1], tokens[index]] = [tokens[index], tokens[index + 1]];
        render();
        options.onChange?.(tokens);
      });
      const remove = button('×', t('sequence.removeCommand'), () => {
        tokens.splice(index, 1);
        render();
        options.onChange?.(tokens);
      });
      row.append(number, select, up, down, remove);
      options.root.append(row);
    });
    const add = document.createElement('button');
    add.className = 'add-command';
    add.type = 'button';
    add.textContent = t('sequence.addBeat');
    add.addEventListener('click', () => {
      if (options.palette[0]) tokens.push(options.palette[0]);
      render();
      options.onChange?.(tokens);
    });
    options.root.append(add);
  };
  render();
  const unsubscribe = subscribe(render);
  return { read: () => [...tokens], destroy: () => { unsubscribe(); options.root.replaceChildren(); } };
}

function button(text: string, label: string, onClick: () => void): HTMLButtonElement {
  const result = document.createElement('button');
  result.type = 'button';
  result.className = 'icon-button';
  result.textContent = text;
  result.ariaLabel = label;
  result.addEventListener('click', onClick);
  return result;
}
