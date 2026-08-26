import type { L4Action, L4Program } from './sim';

export const titleKey = 'level.4.title' as const;
export const descriptionKey = 'level.4.description' as const;
export const abilities: readonly L4Action[] = ['move', 'interact', 'wait', 'observe', 'apply', 'record-start', 'record-end', 'replay'];
export const defaultProgram: L4Program = { actions: ['move', 'interact', 'move', 'move', 'move', 'interact'] };
export const expandedProgram: L4Program = { actions: ['move', 'interact', 'move', 'move', 'interact'] };
export const replayProgram: L4Program = { actions: ['record-start', 'move', 'interact', 'record-end', 'move', 'replay'] };
