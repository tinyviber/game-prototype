import { clampLevel, type LevelNumber } from './level-flow';

export interface SaveData {
  readonly version: 1;
  readonly currentLevel: LevelNumber;
  readonly completed: Record<string, boolean>;
}

const key = 'quiet-workshop-save-v1';
const blank: SaveData = { version: 1, currentLevel: 1, completed: {} };

export function loadSave(storage: Pick<Storage, 'getItem'> = localStorage): SaveData {
  try {
    const raw = storage.getItem(key);
    if (!raw) return { ...blank, completed: {} };
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...blank, completed: {} };
    const candidate = parsed as Partial<SaveData>;
    const level = typeof candidate.currentLevel === 'number' ? clampLevel(candidate.currentLevel) : 1;
    return { version: 1, currentLevel: level, completed: candidate.completed && typeof candidate.completed === 'object' ? { ...candidate.completed } : {} };
  } catch { return { ...blank, completed: {} }; }
}

export function saveProgress(data: SaveData, storage: Pick<Storage, 'setItem'> = localStorage): void {
  try {
    storage.setItem(key, JSON.stringify(data));
  } catch {
    return;
  }
}
