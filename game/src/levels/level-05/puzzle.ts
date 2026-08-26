import type { L5Bindings } from './sim';

export const titleKey = 'level.5.title' as const;
export const descriptionKey = 'level.5.description' as const;
export const defaultBindings: L5Bindings = { left: 'rightArm', right: 'leftArm' };
export const correctBindings: L5Bindings = { left: 'leftArm', right: 'rightArm' };
