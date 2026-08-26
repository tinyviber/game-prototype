export const DEFAULT_LOCALE = 'zh-CN' as const;
export const SUPPORTED_LOCALES = ['en', 'zh-CN'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

const en = {
  'app.documentTitle': 'The Quiet Workshop',
  'app.name': 'THE QUIET WORKSHOP',
  'app.ariaLabel': 'The Quiet Workshop',
  'app.headline': 'Wake the old machines.',
  'app.ready': 'Ready to tinker',
  'app.running': 'Running…',
  'app.debugging': 'Step debugging',
  'app.restored': 'Room restored',
  'app.jammed': 'Something jammed',
  'app.workshopWorld': 'Workshop world',
  'app.workbench': 'Workbench',
  'app.workshop': 'Workshop {{level}}',
  'app.tick': 'Tick {{tick}}',
  'home.tagline': 'A quiet puzzle game about bringing old machines back to life.',
  'home.start': 'Enter the workshop',
  'home.settings': 'Settings',
  'home.version': 'A small machine, a careful hand.',
  'language.label': 'Language',
  'language.english': 'English',
  'language.chinese': '中文',
  'workbench.authoringArea': 'AUTHORING AREA',
  'workbench.run': 'Run',
  'workbench.reset': 'Reset',
  'workbench.openNextRoom': 'Open next room →',
  'workbench.running': 'Running…',
  'workbench.stepDebug': 'Step debug',
  'workbench.stepNext': 'Step forward',
  'workbench.atHand': 'At hand: {{abilities}}',
  'levelNav.title': 'LEVELS',
  'levelNav.freeSelect': 'Choose any room',
  'levelNav.previous': '← Previous',
  'levelNav.next': 'Next →',
  'levelNav.room': 'Room {{level}}',
  'menu.button': 'Menu',
  'menu.title': 'Pause menu',
  'menu.continue': 'Continue',
  'menu.settings': 'Settings',
  'menu.home': 'Return to home',
  'settings.title': 'Settings',
  'settings.subtitle': 'Tune the workshop to your preference.',
  'settings.language': 'Language',
  'settings.languageDescription': 'Choose the language used throughout the game.',
  'settings.backHome': 'Back to home',
  'settings.backGame': 'Back to game',
  'sequence.moveEarlier': 'Move earlier',
  'sequence.moveLater': 'Move later',
  'sequence.removeCommand': 'Remove command',
  'sequence.addBeat': '+ add a beat',
  'ability.move': 'Move',
  'ability.interact': 'Interact',
  'ability.wait': 'Wait',
  'ability.observe': 'Observe',
  'ability.apply': 'Apply',
  'ability.pocket': 'Pocket',
  'ability.capsule': 'Capsule',
  'ability.wiring': 'Wiring',
  'action.move': 'Move forward',
  'action.interact': 'Touch mechanism',
  'action.wait': 'Wait a beat',
  'action.observe': 'Look closely',
  'action.apply': 'Use pocket glyph',
  'action.record-start': 'Open capsule',
  'action.record-end': 'Seal capsule',
  'action.replay': 'Replay capsule',
  'panel.memoryPocket': 'MEMORY POCKET',
  'panel.memoryPocketDescription': 'empty until the helper observes a glyph',
  'panel.recordReplayCapsule': 'RECORD / REPLAY CAPSULE',
  'panel.recordReplayCapsuleDescription': 'sealed until a routine is recorded',
  'binding.leftSensor': 'Left sensor',
  'binding.rightSensor': 'Right sensor',
  'binding.leftArm': 'Left arm',
  'binding.rightArm': 'Right arm',
  'binding.sensorActuator': '{{sensor}} actuator',
  'scene.restorationRail': 'RESTORATION RAIL',
  'scene.reflexChamber': 'REFLEX CHAMBER',
  'scene.open': 'OPEN',
  'scene.locked': 'LOCKED',
  'scene.releasing': 'RELEASING',
  'scene.lever': 'LEVER',
  'scene.safe': 'SAFE',
  'scene.unstable': 'UNSTABLE',
  'scene.collapsed': 'COLLAPSED',
  'scene.look': 'LOOK',
  'scene.glyphReady': 'GLYPH READY',
  'scene.amberGlyph': 'AMBER',
  'scene.empty': 'EMPTY',
  'scene.glyphSource': 'RUNTIME GLYPH',
  'scene.lockSocket': 'LOCK SOCKET',
  'scene.connected': 'CONNECTED',
  'scene.capsule': 'BRASS CAPSULE',
  'scene.capsuleRecording': 'CAPSULE RECORDING',
  'scene.capsulePlaying': 'CAPSULE PLAYING',
  'scene.brassStations': 'BRASS STATIONS',
  'scene.clang': 'CLANG',
  'scene.leftSensor': 'LEFT SENSOR',
  'scene.rightSensor': 'RIGHT SENSOR',
  'level.1.title': 'The sleeping latch',
  'level.1.description': 'The door is not stubborn. Something nearby is still waiting for a hand.',
  'level.1.hint': 'The first attempt should leave a useful trace.',
  'level.2.title': 'The breathing floor',
  'level.2.description': 'The workshop floor changes under its own rhythm. One quiet beat is enough.',
  'level.2.hint': 'The floor has its own rhythm. Watch when the tile changes.',
  'level.3.title': 'The pocket of light',
  'level.3.description': 'A tiny glyph appears only when the helper looks closely, then travels with it.',
  'level.3.hint': 'The helper can carry something the workbench cannot see yet.',
  'level.4.title': 'A useful little loop',
  'level.4.description': 'The same two-beat repair belongs in two places. The brass capsule can remember how.',
  'level.4.hint': 'The capsule is physical: it records while the helper moves.',
  'level.5.title': 'The crossed wires',
  'level.5.description': 'The conservatory has reflexes now. Give each sensor the arm it can safely reach.',
  'level.5.hint': 'A sensor only knows the arm it is physically connected to.',
  'message.timeout': 'Time runs out with the repair still unfinished.',
  'message.level1.initial': 'The helper waits beside a dark latch.',
  'message.level1.lockedGate': 'The locked gate stops the helper. The activator was left dark.',
  'message.level1.restored': 'The old workshop exhales. The latch is awake.',
  'message.level1.followRail': 'The helper follows the rail.',
  'message.level1.activator': 'A small activator catches. Somewhere, a larger lock releases.',
  'message.level1.wait': 'The helper waits.',
  'message.level1.noAnswer': 'Nothing answers here.',
  'message.level2.initial': 'The floor hums in a slow three-beat rhythm.',
  'message.level2.floorUnstable': 'The unstable floor gives beneath the helper. One beat too late.',
  'message.level2.floorCollapsed': 'The collapsed floor gives beneath the helper. One beat too late.',
  'message.level2.crosses': 'The helper crosses with the workshop rhythm.',
  'message.level2.advance': 'The helper advances while the floor breathes.',
  'message.level2.wait': 'A beat passes. The helper watches the floor.',
  'message.level2.noTouch': 'Nothing here needs a touch yet.',
  'message.level3.initial': 'The far lock waits for a glyph the helper has not seen yet.',
  'message.level3.carry': 'The helper carries the quiet question onward.',
  'message.level3.observe': 'A warm amber glyph settles into the helper’s pocket.',
  'message.level3.nothingToRemember': 'There is nothing here to remember.',
  'message.level3.emptyPocket': 'The gate inspection flashes an empty pocket.',
  'message.level3.wrongGlyph': 'The gate rejects the wrong glyph.',
  'message.level3.restored': 'The remembered glyph fits. A whole room lights up.',
  'message.level3.wait': 'The helper waits with its pocket closed.',
  'message.level3.tooFar': 'The lock is not close enough to inspect.',
  'message.level4.initial': 'Two brass stations wait along the same rail.',
  'message.level4.emptyCapsule': 'The empty capsule clicks, then gives up.',
  'message.level4.replay': 'The capsule unfolds its saved movement, one beat at a time.',
  'message.level4.recording': 'The brass capsule begins listening.',
  'message.level4.sealedRoutine': 'The capsule seals a two-beat routine.',
  'message.level4.sealedEmpty': 'The capsule seals empty.',
  'message.level4.overrun': 'The machine jams: the capsule repeated one move too many.',
  'message.level4.followRail': 'The helper follows the rail.',
  'message.level4.stationOne': 'Station one accepts the first beat.',
  'message.level4.restored': 'The same routine wakes both stations.',
  'message.level4.wrongBeat': 'The station receives the wrong beat and jams.',
  'message.level4.wait': 'The helper waits beside the brasswork.',
  'message.level5.initial': 'Two quiet sensors wait for the workshop to twitch.',
  'message.level5.settles': 'The workshop settles into a listening hush.',
  'message.level5.wallHit': '{{sensor}} sensor fires; the {{actuator}} swings into the wall.',
  'message.level5.restored': 'Both arms answer the sensors cleanly.',
  'message.level5.leftAnswers': 'The left arm answers and waits for its partner.',
} as const;

export type TranslationKey = keyof typeof en;
export type TranslationReference = { readonly key: TranslationKey; readonly values?: MessageParams };
export type TranslationValue = string | number | TranslationReference;
export type MessageParams = Readonly<Record<string, TranslationValue>>;

const zhCN: Record<TranslationKey, string> = {
  'app.documentTitle': '寂静工坊',
  'app.name': '寂静工坊',
  'app.ariaLabel': '寂静工坊',
  'app.headline': '唤醒沉睡的机器。',
  'app.ready': '准备动手',
  'app.running': '运行中…',
  'app.debugging': '按步调试中',
  'app.restored': '房间已修复',
  'app.jammed': '发生卡顿',
  'app.workshopWorld': '工坊世界',
  'app.workbench': '工作台',
  'app.workshop': '工坊 {{level}}',
  'app.tick': '节拍 {{tick}}',
  'home.tagline': '一款让古老机器重新运转起来的安静解谜游戏。',
  'home.start': '进入工坊',
  'home.settings': '设置',
  'home.version': '一台小机器，一双细心的手。',
  'language.label': '语言',
  'language.english': 'English',
  'language.chinese': '中文',
  'workbench.authoringArea': '编程区域',
  'workbench.run': '运行',
  'workbench.reset': '重置',
  'workbench.openNextRoom': '进入下一间 →',
  'workbench.running': '运行中…',
  'workbench.stepDebug': '按步调试',
  'workbench.stepNext': '推进一拍',
  'workbench.atHand': '当前能力：{{abilities}}',
  'levelNav.title': '关卡',
  'levelNav.freeSelect': '自由选关',
  'levelNav.previous': '← 上一关',
  'levelNav.next': '下一关 →',
  'levelNav.room': '工坊 {{level}}',
  'menu.button': '菜单',
  'menu.title': '暂停菜单',
  'menu.continue': '继续游戏',
  'menu.settings': '设置',
  'menu.home': '返回主页',
  'settings.title': '设置',
  'settings.subtitle': '调整工坊，让它更合你的心意。',
  'settings.language': '语言',
  'settings.languageDescription': '选择整个游戏使用的语言。',
  'settings.backHome': '返回主页',
  'settings.backGame': '返回游戏',
  'sequence.moveEarlier': '上移',
  'sequence.moveLater': '下移',
  'sequence.removeCommand': '移除指令',
  'sequence.addBeat': '+ 添加一个节拍',
  'ability.move': '移动',
  'ability.interact': '互动',
  'ability.wait': '等待',
  'ability.observe': '观察',
  'ability.apply': '应用',
  'ability.pocket': '口袋',
  'ability.capsule': '胶囊',
  'ability.wiring': '接线',
  'action.move': '向前移动',
  'action.interact': '触碰机关',
  'action.wait': '等待一拍',
  'action.observe': '仔细观察',
  'action.apply': '使用口袋里的符文',
  'action.record-start': '打开胶囊',
  'action.record-end': '封存胶囊',
  'action.replay': '重放胶囊',
  'panel.memoryPocket': '记忆口袋',
  'panel.memoryPocketDescription': '助手观察到符文前保持空置',
  'panel.recordReplayCapsule': '记录 / 重放胶囊',
  'panel.recordReplayCapsuleDescription': '记录一段流程后才能封存',
  'binding.leftSensor': '左侧传感器',
  'binding.rightSensor': '右侧传感器',
  'binding.leftArm': '左臂',
  'binding.rightArm': '右臂',
  'binding.sensorActuator': '{{sensor}}执行器',
  'scene.restorationRail': '修复轨道',
  'scene.reflexChamber': '反射室',
  'scene.open': '开启',
  'scene.locked': '锁定',
  'scene.releasing': '下降中',
  'scene.lever': '拉杆',
  'scene.safe': '安全',
  'scene.unstable': '不稳定',
  'scene.collapsed': '坍塌',
  'scene.look': '观察点',
  'scene.glyphReady': '符文就绪',
  'scene.amberGlyph': '琥珀符文',
  'scene.empty': '空',
  'scene.glyphSource': '运行符文',
  'scene.lockSocket': '锁孔',
  'scene.connected': '已接通',
  'scene.capsule': '黄铜胶囊',
  'scene.capsuleRecording': '胶囊记录中',
  'scene.capsulePlaying': '胶囊播放中',
  'scene.brassStations': '黄铜站点',
  'scene.clang': '铛！',
  'scene.leftSensor': '左侧传感器',
  'scene.rightSensor': '右侧传感器',
  'level.1.title': '沉睡的门闩',
  'level.1.description': '门并不固执，只是附近有什么东西还在等待一只手。',
  'level.1.hint': '第一次尝试应该留下有用的轨迹。',
  'level.2.title': '呼吸的地板',
  'level.2.description': '工坊地板按照自己的节奏变化。安静地等待一拍就够了。',
  'level.2.hint': '地板有自己的节奏，留意砖块何时变化。',
  'level.3.title': '光之口袋',
  'level.3.description': '只有仔细观察时，微小的符文才会出现，然后随助手一起移动。',
  'level.3.hint': '助手可以携带工作台暂时看不见的东西。',
  'level.4.title': '实用的小循环',
  'level.4.description': '同一段两拍的修复流程要用在两个地方。黄铜胶囊可以记住它。',
  'level.4.hint': '胶囊是实体：助手移动时，它会记录过程。',
  'level.5.title': '交叉的线路',
  'level.5.description': '温室现在有了反射能力。为每个传感器连接它能安全够到的手臂。',
  'level.5.hint': '传感器只能感知与它实际连接的手臂。',
  'message.timeout': '时间耗尽，修复仍未完成。',
  'message.level1.initial': '助手在一根昏暗的门闩旁等待。',
  'message.level1.lockedGate': '锁住的闸门挡住了助手，启动器仍然没有亮起。',
  'message.level1.restored': '古老的工坊吐出一口气，门闩醒了过来。',
  'message.level1.followRail': '助手沿着轨道前进。',
  'message.level1.activator': '小小的启动器接通了，某处更大的锁随之释放。',
  'message.level1.wait': '助手等待着。',
  'message.level1.noAnswer': '这里没有任何回应。',
  'message.level2.initial': '地板发出缓慢的三拍节奏。',
  'message.level2.floorUnstable': '不稳定的地板在助手脚下松动了，慢了一拍。',
  'message.level2.floorCollapsed': '坍塌的地板在助手脚下陷落了，慢了一拍。',
  'message.level2.crosses': '助手踩着工坊的节奏穿了过去。',
  'message.level2.advance': '地板呼吸之间，助手继续前进。',
  'message.level2.wait': '一拍过去了，助手观察着地板。',
  'message.level2.noTouch': '这里暂时不需要触碰任何东西。',
  'message.level3.initial': '远处的锁等待着一个助手尚未见过的符文。',
  'message.level3.carry': '助手带着这个安静的问题继续前进。',
  'message.level3.observe': '一枚温暖的琥珀符文落入助手的口袋。',
  'message.level3.nothingToRemember': '这里没有值得记住的东西。',
  'message.level3.emptyPocket': '闸门检查闪过一道光：口袋是空的。',
  'message.level3.wrongGlyph': '闸门拒绝了错误的符文。',
  'message.level3.restored': '记住的符文严丝合缝，整间房间亮了起来。',
  'message.level3.wait': '助手合上口袋等待着。',
  'message.level3.tooFar': '锁离得太远，还无法检查。',
  'message.level4.initial': '两座黄铜站点沿着同一条轨道等待着。',
  'message.level4.emptyCapsule': '空胶囊咔哒一声，然后放弃了。',
  'message.level4.replay': '胶囊逐拍展开保存的移动流程。',
  'message.level4.recording': '黄铜胶囊开始倾听。',
  'message.level4.sealedRoutine': '胶囊封存了一段两拍流程。',
  'message.level4.sealedEmpty': '胶囊封存了空内容。',
  'message.level4.overrun': '机器卡住了：胶囊多重复了一次移动。',
  'message.level4.followRail': '助手沿着轨道前进。',
  'message.level4.stationOne': '一号站点接受了第一拍。',
  'message.level4.restored': '同一段流程唤醒了两座站点。',
  'message.level4.wrongBeat': '站点接收到错误的节拍并卡住了。',
  'message.level4.wait': '助手在黄铜装置旁等待着。',
  'message.level5.initial': '两个安静的传感器等待工坊颤动。',
  'message.level5.settles': '工坊归于倾听般的寂静。',
  'message.level5.wallHit': '{{sensor}}触发，{{actuator}}撞向了墙。',
  'message.level5.restored': '两只手臂干净利落地回应了传感器。',
  'message.level5.leftAnswers': '左臂回应后，等待它的搭档。',
};

const translations: Record<Locale, Record<TranslationKey, string>> = { en, 'zh-CN': zhCN };
const localeStorageKey = 'quiet-workshop-locale-v1';
const subscribers = new Set<() => void>();
let locale: Locale = DEFAULT_LOCALE;
let initialized = false;

export interface LocalizedMessage {
  readonly message: string;
  readonly messageKey: TranslationKey;
  readonly messageParams?: MessageParams;
}

export function reference(key: TranslationKey, values?: MessageParams): TranslationReference {
  return values ? { key, values } : { key };
}

export function localizedMessage(key: TranslationKey, values?: MessageParams): LocalizedMessage {
  return {
    message: translate(key, values, 'en'),
    messageKey: key,
    ...(values ? { messageParams: values } : {}),
  };
}

export function t(key: TranslationKey, values?: MessageParams): string {
  return translate(key, values, locale);
}

export function translate(key: TranslationKey, values: MessageParams | undefined, targetLocale: Locale): string {
  const template = translations[targetLocale][key] ?? translations.en[key] ?? key;
  return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
    const value = values?.[name];
    if (value === undefined) return `{{${name}}}`;
    if (typeof value === 'object') return translate(value.key, value.values, targetLocale);
    return String(value);
  });
}

export function getLocale(): Locale {
  return locale;
}

export function setLocale(next: Locale): void {
  if (locale === next) {
    updateDocumentLocale();
    return;
  }
  locale = next;
  try {
    localStorage.setItem(localeStorageKey, next);
  } catch {
    // Storage can be unavailable in private browsing and test environments.
  }
  updateDocumentLocale();
  subscribers.forEach((listener) => listener());
}

export function subscribe(listener: () => void): () => void {
  subscribers.add(listener);
  return () => subscribers.delete(listener);
}

export function initializeI18n(): void {
  if (initialized) return;
  initialized = true;
  locale = readInitialLocale();
  updateDocumentLocale();
  applyStaticTranslations();
  document.querySelectorAll<HTMLSelectElement>('[data-locale-select]').forEach((select) => {
    select.value = locale;
    select.addEventListener('change', () => {
      const next = select.value;
      if (isLocale(next)) setLocale(next);
    });
  });
  subscribe(() => {
    updateDocumentLocale();
    applyStaticTranslations();
    document.querySelectorAll<HTMLSelectElement>('[data-locale-select]').forEach((currentSelect) => {
      currentSelect.value = locale;
    });
  });
}

function readInitialLocale(): Locale {
  try {
    const saved = localStorage.getItem(localeStorageKey);
    if (saved && isLocale(saved)) return saved;
  } catch {
    // Use the product default when storage is unavailable.
  }
  return DEFAULT_LOCALE;
}

function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

function updateDocumentLocale(): void {
  if (typeof document !== 'undefined') document.documentElement.lang = locale;
}

function applyStaticTranslations(): void {
  if (typeof document === 'undefined') return;
  document.title = t('app.documentTitle');
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (key && isTranslationKey(key)) node.textContent = t(key);
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-aria-label]').forEach((node) => {
    const key = node.dataset.i18nAriaLabel;
    if (key && isTranslationKey(key)) node.setAttribute('aria-label', t(key));
  });
}

function isTranslationKey(value: string): value is TranslationKey {
  return value in en;
}
