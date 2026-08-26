import type { L3Action, L3Program } from './sim';

export const titleKey = 'level.3.title' as const;
export const descriptionKey = 'level.3.description' as const;
export const abilities: readonly L3Action[] = ['move', 'interact', 'wait', 'observe', 'apply'];
export const defaultProgram: L3Program = { actions: ['move', 'move', 'move', 'apply'] };
export const repairProgram: L3Program = { actions: ['move', 'observe', 'move', 'move', 'apply'] };
