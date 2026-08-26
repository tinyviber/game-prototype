export type LevelNumber = 1 | 2 | 3 | 4 | 5;

export function nextLevel(level: LevelNumber): LevelNumber | undefined {
  return level < 5 ? ((level + 1) as LevelNumber) : undefined;
}

export function previousLevel(level: LevelNumber): LevelNumber | undefined {
  return level > 1 ? ((level - 1) as LevelNumber) : undefined;
}

export function clampLevel(value: number): LevelNumber {
  return Math.max(1, Math.min(5, Math.floor(value))) as LevelNumber;
}
