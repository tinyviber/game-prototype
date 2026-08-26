import type { L1Action, L1Program } from './sim';

export const titleKey = 'level.1.title' as const;
export const descriptionKey = 'level.1.description' as const;
export const abilities: readonly L1Action[] = ['move', 'interact'];
export const defaultProgram: L1Program = { actions: ['move', 'move', 'move'] };
export const repairProgram: L1Program = { actions: ['move', 'interact', 'move', 'move'] };
