import type { ProtagonistView } from '../../character/types';
import { t } from '../../i18n';
import type { L3State } from './sim';

export interface L3View { readonly protagonist: ProtagonistView; readonly tick: number; readonly pocket: string | null; readonly lastAction?: L3State['lastAction']; readonly status: L3State['status']; readonly message: string; }
export function toView(state: Readonly<L3State>): L3View {
  return { protagonist: { x: 110 + state.position * 190, y: 270, facing: 'right', activity: state.activity, held: state.pocket ? t('scene.amberGlyph') : undefined }, tick: state.tick, pocket: state.pocket, lastAction: state.lastAction, status: state.status, message: state.message };
}
