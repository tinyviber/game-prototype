import type { L2Action, L2Program } from './sim';

export const titleKey = 'level.2.title' as const;
export const descriptionKey = 'level.2.description' as const;
export const abilities: readonly L2Action[] = ['move', 'interact', 'wait'];
export const defaultProgram: L2Program = { actions: ['move', 'move', 'move'] };
export const repairProgram: L2Program = { actions: ['move', 'wait', 'move', 'move'] };
