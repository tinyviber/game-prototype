import { describe, expect, it } from 'vitest';
import { loadSave, saveProgress } from './save-store';

function memoryStorage(): { getItem: (key: string) => string | null; setItem: (key: string, value: string) => void } {
  let value: string | null = null;
  return { getItem: () => value, setItem: (_key, next) => { value = next; } };
}

describe('save store', () => {
  it('round-trips progress and falls back from corrupt data', () => {
    const storage = memoryStorage();
    expect(loadSave(storage).currentLevel).toBe(1);
    saveProgress({ version: 1, currentLevel: 3, completed: { '1': true, '2': true } }, storage);
    expect(loadSave(storage)).toEqual({ version: 1, currentLevel: 3, completed: { '1': true, '2': true } });
    storage.setItem('quiet-workshop-save-v1', '{bad json');
    expect(loadSave(storage)).toEqual({ version: 1, currentLevel: 1, completed: {} });
  });

  it('clamps out-of-range saved levels back into the campaign', () => {
    const storage = memoryStorage();
    storage.setItem('quiet-workshop-save-v1', JSON.stringify({ version: 1, currentLevel: 99, completed: {} }));
    expect(loadSave(storage).currentLevel).toBe(5);
    storage.setItem('quiet-workshop-save-v1', JSON.stringify({ version: 1, currentLevel: 0, completed: {} }));
    expect(loadSave(storage).currentLevel).toBe(1);
  });

  it('keeps the session alive when persistence fails', () => {
    const failing = { getItem: () => null, setItem: () => { throw new Error('quota exceeded'); } };
    expect(() => saveProgress({ version: 1, currentLevel: 2, completed: {} }, failing)).not.toThrow();
  });
});
