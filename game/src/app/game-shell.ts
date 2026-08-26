import { Assets, Container, Graphics, Sprite, Text, TextStyle } from 'pixi.js';
import { createHistory, type History } from '../runtime/history';
import { createTickDriver, type TickDriver } from '../rendering/tick-driver';
import { ProtagonistRenderer } from '../character/protagonist';
import { createWorkbenchShell, type WorkbenchShell } from '../workbench/shell';
import { mountSequenceEditor } from '../workbench/sequence-editor';
import { createPixiHost, type PixiHost } from '../rendering/pixi-host';
import { loadSave, saveProgress } from './save-store';
import { nextLevel, previousLevel, type LevelNumber } from './level-flow';
import { subscribe, t, type TranslationKey } from '../i18n';
import * as l1Puzzle from '../levels/level-01/puzzle';
import * as l1 from '../levels/level-01/sim';
import { GATE_WALL_CLIP, toView as toL1View } from '../levels/level-01/view';
import * as l2Puzzle from '../levels/level-02/puzzle';
import * as l2 from '../levels/level-02/sim';
import { toView as toL2View } from '../levels/level-02/view';
import * as l3Puzzle from '../levels/level-03/puzzle';
import * as l3 from '../levels/level-03/sim';
import { toView as toL3View } from '../levels/level-03/view';
import * as l4Puzzle from '../levels/level-04/puzzle';
import * as l4 from '../levels/level-04/sim';
import { toView as toL4View } from '../levels/level-04/view';
import * as l5Puzzle from '../levels/level-05/puzzle';
import * as l5 from '../levels/level-05/sim';
import { toView as toL5View } from '../levels/level-05/view';

type AnyState = l1.L1State | l2.L2State | l3.L3State | l4.L4State | l5.L5State;
type AnyView = ReturnType<typeof toL1View> | ReturnType<typeof toL2View> | ReturnType<typeof toL3View> | ReturnType<typeof toL4View> | ReturnType<typeof toL5View>;
type AnyRun =
  | ReturnType<typeof l1.createRun>
  | ReturnType<typeof l2.createRun>
  | ReturnType<typeof l3.createRun>
  | ReturnType<typeof l4.createRun>
  | ReturnType<typeof l5.createRun>;
type AnyHistory = History<l1.L1State> | History<l2.L2State> | History<l3.L3State> | History<l4.L4State> | History<l5.L5State>;

interface LevelEntry {
  readonly titleKey: TranslationKey;
  readonly descriptionKey: TranslationKey;
  readonly unlocked: readonly TranslationKey[];
  readonly hintKey: TranslationKey;
  readonly sceneLabelKey: TranslationKey;
  readonly initialState: AnyState;
  readonly toView: (state: AnyState) => AnyView;
  readonly createRun: (program: unknown) => AnyRun;
  readonly mountAuthoring: (root: HTMLElement) => MountedAuthoring;
  readonly draw: (layer: Container, view: AnyView) => void;
}

interface MountedAuthoring {
  readonly read: () => unknown;
  destroy(): void;
}

interface LevelNavigation {
  setLevel(level: LevelNumber): void;
  destroy(): void;
}

const MS_PER_TICK = 300;
const MAX_TICKS = 30;
const TIMED_OUT_MESSAGE: TranslationKey = 'message.timeout';
const VISUAL_ASSETS = ['/assets/lever-down.png', '/assets/lever-up.png', '/assets/stone-wall.png'];

export interface GameShellHandle {
  pause(): void;
  resume(): void;
}

export async function createGameShell(): Promise<GameShellHandle> {
  const stage = document.querySelector<HTMLDivElement>('#stage');
  const workbenchRoot = document.querySelector<HTMLDivElement>('#workbench');
  if (!stage || !workbenchRoot) throw new Error('Game shell markup is incomplete.');
  await Assets.load(VISUAL_ASSETS);
  const host = await createPixiHost(stage, { width: 900, height: 440, background: '#102426' });
  const workbench = createWorkbenchShell(workbenchRoot);
  const game = new GameShell(host, workbench);
  game.loadLevel(loadSave().currentLevel);
  return game;
}

class GameShell implements GameShellHandle {
  private level: LevelNumber = 1;
  private history?: AnyHistory;
  private driver: TickDriver;
  private authoring?: MountedAuthoring;
  private tick = 0;
  private runState: 'idle' | 'running' | 'debugging' | 'complete' | 'failed' = 'idle';
  private world?: Container;
  private worldLayer?: Container;
  private protagonist?: ProtagonistRenderer;
  private readonly levelNavigation: LevelNavigation;

  constructor(private readonly host: PixiHost, private readonly workbench: WorkbenchShell) {
    this.driver = createTickDriver(host.app.ticker, MS_PER_TICK, (tick) => this.renderTick(tick));
    this.levelNavigation = mountLevelNavigation((level) => this.loadLevel(level));
    subscribe(() => this.refreshLocale());
  }

  loadLevel(level: LevelNumber): void {
    this.driver.reset();
    this.history = undefined;
    this.authoring?.destroy();
    this.authoring = undefined;
    this.tick = 0;
    this.runState = 'idle';
    this.level = level;
    this.levelNavigation.setLevel(level);
    const entry = LEVELS[level];
    this.world = this.host.replaceWorld();
    const worldLayer = new Container();
    const characterLayer = new Container();
    this.world.addChild(worldLayer, characterLayer);
    this.worldLayer = worldLayer;
    this.protagonist = new ProtagonistRenderer(characterLayer);
    this.authoring = entry.mountAuthoring(this.workbench.authoring);
    this.workbench.setRunHandler(() => this.run());
    this.workbench.setStepHandler(() => this.stepDebug());
    this.workbench.setResetHandler(() => this.loadLevel(level));
    this.workbench.setRunState('idle');
    this.refreshLocale();
    this.renderAt(0);
  }

  private run(): void {
    this.beginRun('running');
    this.driver.start();
  }

  private stepDebug(): void {
    if (this.runState === 'running') return;
    if (this.runState !== 'debugging') this.beginRun('debugging');
    this.driver.step();
  }

  private beginRun(mode: 'running' | 'debugging'): void {
    this.driver.reset();
    this.tick = 0;
    this.history = memoizedHistory(LEVELS[this.level].createRun(this.authoring?.read() ?? {}));
    this.runState = mode;
    this.workbench.setRunState(mode);
    this.updateRunStatus();
    this.renderAt(0);
  }

  private renderTick(tick: number): void {
    if (!this.history) return;
    this.tick = tick;
    this.renderAt(tick);
    const state = this.history.stateAt(tick);
    if (state.status === 'running' && tick < MAX_TICKS) return;
    const succeeded = state.status === 'success' && tick < MAX_TICKS;
    this.driver.stop();
    this.runState = succeeded ? 'complete' : 'failed';
    this.workbench.setRunState(succeeded ? 'complete' : 'failed');
    this.workbench.setMessage(state.status === 'running' ? t(TIMED_OUT_MESSAGE) : localizedStateMessage(state));
    this.updateRunStatus();
    if (succeeded) {
      const following = nextLevel(this.level);
      const previousSave = loadSave();
      saveProgress({ version: 1, currentLevel: following ?? this.level, completed: { ...previousSave.completed, [String(this.level)]: true } });
      if (following) this.workbench.showNext(() => this.loadLevel(following));
    }
  }

  private renderAt(tick: number): void {
    const layer = this.worldLayer;
    if (!layer) return;
    layer.removeChildren().forEach((child) => child.destroy({ children: true }));
    const entry = LEVELS[this.level];
    const state = this.history?.stateAt(tick) ?? entry.initialState;
    const view = entry.toView(state);
    drawRail(layer, t(entry.sceneLabelKey));
    entry.draw(layer, view);
    this.protagonist?.render(view.protagonist);
    const message = localizedStateMessage(state);
    setText('#level-kicker', t('app.workshop', { level: String(this.level).padStart(2, '0') }));
    setText('#tick-label', t('app.tick', { tick }));
    setText('#world-caption', message);
    this.workbench.setMessage(message);
  }

  private refreshLocale(): void {
    const entry = LEVELS[this.level];
    this.workbench.setLevel(t(entry.titleKey), t(entry.descriptionKey), entry.unlocked.map((key) => t(key)).join(' · '));
    this.workbench.hint.textContent = t(entry.hintKey);
    this.updateRunStatus();
    if (this.worldLayer) this.renderAt(this.tick);
  }

  private updateRunStatus(): void {
    const key: TranslationKey = this.runState === 'running' ? 'app.running' : this.runState === 'debugging' ? 'app.debugging' : this.runState === 'complete' ? 'app.restored' : this.runState === 'failed' ? 'app.jammed' : 'app.ready';
    setText('#run-status', t(key));
  }

  pause(): void {
    if (this.runState === 'running') this.driver.stop();
  }

  resume(): void {
    if (this.runState === 'running') this.driver.start();
  }
}

function localizedStateMessage(state: AnyState): string {
  return t(state.messageKey, state.messageParams);
}

function memoizedHistory(run: AnyRun): AnyHistory {
  return (createHistory as unknown as (definition: unknown) => AnyHistory)(run);
}

const LEVELS: Record<LevelNumber, LevelEntry> = {
  1: {
    titleKey: l1Puzzle.titleKey,
    descriptionKey: l1Puzzle.descriptionKey,
    unlocked: ['ability.move', 'ability.interact'],
    hintKey: 'level.1.hint',
    sceneLabelKey: 'scene.restorationRail',
    initialState: l1.initialState,
    toView: (state) => toL1View(state as l1.L1State),
    createRun: (program) => l1.createRun(program as l1.L1Program),
    mountAuthoring: (root) => {
      const editor = mountSequenceEditor({ root, initial: [...l1Puzzle.defaultProgram.actions], palette: l1Puzzle.abilities, label: labelAction });
      return { read: () => ({ actions: editor.read() as l1.L1Action[] }), destroy: editor.destroy };
    },
    draw: (layer, view) => drawLevelOne(layer, view as ReturnType<typeof toL1View>),
  },
  2: {
    titleKey: l2Puzzle.titleKey,
    descriptionKey: l2Puzzle.descriptionKey,
    unlocked: ['ability.move', 'ability.interact', 'ability.wait'],
    hintKey: 'level.2.hint',
    sceneLabelKey: 'scene.restorationRail',
    initialState: l2.initialState,
    toView: (state) => toL2View(state as l2.L2State),
    createRun: (program) => l2.createRun(program as l2.L2Program),
    mountAuthoring: (root) => {
      const editor = mountSequenceEditor({ root, initial: [...l2Puzzle.defaultProgram.actions], palette: l2Puzzle.abilities, label: labelAction });
      return { read: () => ({ actions: editor.read() as l2.L2Action[] }), destroy: editor.destroy };
    },
    draw: (layer, view) => {
      const v = view as ReturnType<typeof toL2View>;
      drawTile(layer, v.tile, v.phase, v.lastAction, v.tick);
    },
  },
  3: {
    titleKey: l3Puzzle.titleKey,
    descriptionKey: l3Puzzle.descriptionKey,
    unlocked: ['ability.move', 'ability.interact', 'ability.wait', 'ability.observe', 'ability.apply'],
    hintKey: 'level.3.hint',
    sceneLabelKey: 'scene.restorationRail',
    initialState: l3.initialState,
    toView: (state) => toL3View(state as l3.L3State),
    createRun: (program) => l3.createRun(program as l3.L3Program),
    mountAuthoring: (root) => {
      const sequence = prepareAbilityPanel(root, 'panel.memoryPocket', 'panel.memoryPocketDescription');
      const editor = mountSequenceEditor({ root: sequence, initial: [...l3Puzzle.defaultProgram.actions], palette: l3Puzzle.abilities, label: labelAction });
      return { read: () => ({ actions: editor.read() as l3.L3Action[] }), destroy: () => { editor.destroy(); root.replaceChildren(); } };
    },
    draw: (layer, view) => drawGlyphSites(layer, view as ReturnType<typeof toL3View>),
  },
  4: {
    titleKey: l4Puzzle.titleKey,
    descriptionKey: l4Puzzle.descriptionKey,
    unlocked: ['ability.move', 'ability.interact', 'ability.wait', 'ability.pocket', 'ability.capsule'],
    hintKey: 'level.4.hint',
    sceneLabelKey: 'scene.restorationRail',
    initialState: l4.initialState,
    toView: (state) => toL4View(state as l4.L4State),
    createRun: (program) => l4.createRun(program as l4.L4Program),
    mountAuthoring: (root) => {
      const sequence = prepareAbilityPanel(root, 'panel.recordReplayCapsule', 'panel.recordReplayCapsuleDescription');
      const editor = mountSequenceEditor({ root: sequence, initial: [...l4Puzzle.defaultProgram.actions], palette: l4Puzzle.abilities, label: labelAction });
      return { read: () => ({ actions: editor.read() as l4.L4Action[] }), destroy: () => { editor.destroy(); root.replaceChildren(); } };
    },
    draw: (layer, view) => {
      const v = view as ReturnType<typeof toL4View>;
      drawStations(layer, v.serviced, v.replaying, v.recording, v.capsuleLength, v.lastAction, v.tick);
    },
  },
  5: {
    titleKey: l5Puzzle.titleKey,
    descriptionKey: l5Puzzle.descriptionKey,
    unlocked: ['ability.move', 'ability.interact', 'ability.wait', 'ability.pocket', 'ability.capsule', 'ability.wiring'],
    hintKey: 'level.5.hint',
    sceneLabelKey: 'scene.reflexChamber',
    initialState: l5.initialState,
    toView: (state) => toL5View(state as l5.L5State),
    createRun: (program) => l5.createRun(program as l5.L5Bindings),
    mountAuthoring: (root) => {
      return mountBindings(root);
    },
    draw: (layer, view) => drawWires(layer, view as ReturnType<typeof toL5View>),
  },
};

const LEVEL_ORDER: readonly LevelNumber[] = [1, 2, 3, 4, 5];

function mountLevelNavigation(onSelect: (level: LevelNumber) => void): LevelNavigation {
  const list = document.querySelector<HTMLDivElement>('#level-list');
  const previous = document.querySelector<HTMLButtonElement>('#level-previous');
  const next = document.querySelector<HTMLButtonElement>('#level-next');
  if (!list || !previous || !next) throw new Error('Level navigation markup is incomplete.');

  let active = 1 as LevelNumber;
  const render = () => {
    list.replaceChildren();
    LEVEL_ORDER.forEach((level) => {
      const entry = LEVELS[level];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'level-nav-item';
      button.dataset.level = String(level);
      button.setAttribute('aria-label', `${t('levelNav.room', { level: String(level).padStart(2, '0') })}: ${t(entry.titleKey)}`);
      if (level === active) button.setAttribute('aria-current', 'page');
      button.addEventListener('click', () => onSelect(level));

      const number = document.createElement('span');
      number.className = 'level-nav-number';
      number.textContent = String(level).padStart(2, '0');
      const title = document.createElement('span');
      title.className = 'level-nav-title';
      title.textContent = t(entry.titleKey);
      button.append(number, title);
      list.append(button);
    });

    previous.textContent = t('levelNav.previous');
    previous.disabled = active === 1;
    next.textContent = t('levelNav.next');
    next.disabled = active === 5;
  };

  previous.onclick = () => {
    const level = previousLevel(active);
    if (level) onSelect(level);
  };
  next.onclick = () => {
    const level = nextLevel(active);
    if (level) onSelect(level);
  };
  const unsubscribe = subscribe(render);
  render();

  return {
    setLevel(level) {
      active = level;
      render();
    },
    destroy() {
      unsubscribe();
      previous.onclick = null;
      next.onclick = null;
      list.replaceChildren();
    },
  };
}

function setText(selector: string, text: string): void {
  const node = document.querySelector(selector);
  if (node) node.textContent = text;
}

function mountBindings(root: HTMLElement): MountedAuthoring {
  const values: { left: l5.L5Actuator; right: l5.L5Actuator } = { ...l5Puzzle.defaultBindings };
  const render = () => {
    root.replaceChildren();
    (['left', 'right'] as const).forEach((sensor) => {
      const sensorKey = sensor === 'left' ? 'binding.leftSensor' : 'binding.rightSensor';
      const row = document.createElement('label');
      row.className = 'wire-row';
      row.textContent = `${t(sensorKey)} → `;
      const select = document.createElement('select');
      select.className = 'command-select';
      select.setAttribute('aria-label', t('binding.sensorActuator', { sensor: t(sensorKey) }));
      (['leftArm', 'rightArm'] as const).forEach((arm) => {
        const option = document.createElement('option');
        option.value = arm;
        option.textContent = t(arm === 'leftArm' ? 'binding.leftArm' : 'binding.rightArm');
        option.selected = values[sensor] === arm;
        select.append(option);
      });
      select.addEventListener('change', () => { values[sensor] = select.value as l5.L5Actuator; });
      row.append(select);
      root.append(row);
    });
  };
  render();
  const unsubscribe = subscribe(render);
  return { read: () => ({ ...values }), destroy: () => { unsubscribe(); root.replaceChildren(); } };
}

function prepareAbilityPanel(root: HTMLElement, titleKey: TranslationKey, descriptionKey: TranslationKey): HTMLElement {
  const sequence = document.createElement('div');
  const panel = document.createElement('div');
  panel.className = 'ability-panel';
  const heading = document.createElement('span');
  heading.dataset.i18n = titleKey;
  heading.textContent = t(titleKey);
  const detail = document.createElement('strong');
  detail.dataset.i18n = descriptionKey;
  detail.textContent = t(descriptionKey);
  panel.append(heading, detail);
  root.replaceChildren(sequence, panel);
  return sequence;
}

function labelAction(token: string): string {
  const keys: Record<string, TranslationKey> = {
    move: 'action.move', interact: 'action.interact', wait: 'action.wait', observe: 'action.observe',
    apply: 'action.apply', 'record-start': 'action.record-start', 'record-end': 'action.record-end', replay: 'action.replay',
  };
  return keys[token] ? t(keys[token]) : token;
}

function drawRail(layer: Container, sceneLabel: string): void {
  const bg = new Graphics().roundRect(18, 18, 864, 404, 24).fill('#173437');
  layer.addChild(bg);
  const railLine = new Graphics().moveTo(80, 290).lineTo(820, 290).stroke({ color: '#466c68', width: 5 });
  layer.addChild(railLine);
  for (let i = 0; i < 4; i += 1) {
    layer.addChild(new Graphics().circle(110 + i * 190, 290, 11).fill('#294b4c'));
  }
  const label = new Text({ text: sceneLabel, style: new TextStyle({ fontSize: 14, fill: '#9ab6ad', letterSpacing: 3 }) });
  label.position.set(60, 50);
  layer.addChild(label);
}

function drawLevelOne(layer: Container, view: ReturnType<typeof toL1View>): void {
  drawLever(layer, view.gateOpen, view.lastAction === 'interact');
  drawGate(layer, view.gateOpen, view.gateWallY, view.gateWallHeight);
}

function drawLever(layer: Container, active: boolean, justTouched: boolean): void {
  const glow = new Graphics().circle(300, 218, 37).fill({ color: active ? '#d2aa70' : '#5f817a', alpha: justTouched ? 0.28 : 0.1 });
  const casing = new Graphics().roundRect(263, 181, 74, 85, 14).fill('#203b3d').stroke({ color: '#62847d', width: 3 });
  const base = new Graphics().roundRect(267, 258, 66, 18, 9).fill('#294b4c').stroke({ color: '#62847d', width: 2 });
  const lever = Sprite.from(active ? '/assets/lever-down.png' : '/assets/lever-up.png');
  lever.anchor.set(0.5);
  lever.position.set(300, 222);
  lever.width = 64;
  lever.height = 64;
  lever.roundPixels = true;
  layer.addChild(glow, casing, base, lever);
  addText(layer, t('scene.lever'), 272, 160, '#efc98b');
}

function drawGate(layer: Container, open: boolean, wallY: number, wallHeight: number): void {
  const frame = new Graphics().roundRect(462, 118, 70, 184, 14).stroke({ color: '#55736d', width: 5 });
  const wall = Sprite.from('/assets/stone-wall.png');
  wall.position.set(GATE_WALL_CLIP.x, wallY);
  wall.width = 62;
  wall.height = wallHeight;
  wall.visible = wallHeight > 0;
  wall.tint = open ? 0x91aa9f : 0x738b87;
  wall.alpha = 0.98;
  layer.addChild(frame, wall);
  const labelKey: TranslationKey = !open ? 'scene.locked' : wallHeight > 0 ? 'scene.releasing' : 'scene.open';
  addText(layer, t(labelKey), 434, 95, '#efc98b');
}

function drawTile(layer: Container, tile: string, phase: number, lastAction: string | undefined, tick: number): void {
  const color = tile === 'safe' ? '#82b99a' : tile === 'unstable' ? '#d0a361' : '#c26c61';
  const y = tile === 'safe' ? 245 : tile === 'unstable' ? 252 : 267;
  const pulseAlpha = lastAction === 'wait' ? 0.18 + (tick % 2) * 0.06 : 0.08;
  layer.addChild(new Graphics().circle(505, 280, 75).fill({ color, alpha: pulseAlpha }));
  layer.addChild(new Graphics().moveTo(465, 325).lineTo(480, 303).moveTo(545, 325).lineTo(530, 303).stroke({ color: '#49655f', width: 5 }));
  layer.addChild(new Graphics().roundRect(455, y, 100, 74, 14).fill(color).stroke({ color: '#e8d39e', width: tile === 'safe' ? 1 : 3, alpha: 0.5 }));
  if (tile === 'unstable') {
    layer.addChild(new Graphics().moveTo(480, y + 16).lineTo(496, y + 31).lineTo(488, y + 49).lineTo(512, y + 65).stroke({ color: '#6d533a', width: 3 }));
  }
  if (tile === 'collapsed') {
    layer.addChild(new Graphics().moveTo(467, y + 16).lineTo(491, y + 33).lineTo(478, y + 58).moveTo(520, y + 10).lineTo(505, y + 29).lineTo(535, y + 57).stroke({ color: '#633d3e', width: 4 }));
  }
  for (let index = 0; index < 3; index += 1) {
    const active = index === phase;
    layer.addChild(new Graphics().circle(470 + index * 35, 203, active ? 8 : 5).fill({ color: active ? color : '#345653', alpha: active ? 1 : 0.8 }).stroke({ color: '#d7e1cf', width: active ? 2 : 1, alpha: active ? 0.8 : 0.25 }));
  }
  const tileKey: TranslationKey = tile === 'safe' ? 'scene.safe' : tile === 'unstable' ? 'scene.unstable' : 'scene.collapsed';
  addText(layer, t(tileKey), 465, y + 27, '#163033');
}

function drawGlyphSites(layer: Container, view: ReturnType<typeof toL3View>): void {
  const sourceActive = view.lastAction === 'observe';
  const targetActive = view.lastAction === 'apply';
  const restored = view.status === 'success';
  layer.addChild(new Graphics().circle(300, 265, 48).fill({ color: '#bd9562', alpha: sourceActive ? 0.22 : 0.1 }).stroke({ color: '#806548', width: 3 }));
  layer.addChild(new Graphics().circle(300, 265, 28).fill('#bd9562'));
  drawGlyph(layer, 300, 265, '#f1c56e', sourceActive ? 1.2 : 1);

  layer.addChild(new Graphics().roundRect(638, 190, 84, 108, 20).fill({ color: restored ? '#82b99a' : '#294b4c', alpha: 0.9 }).stroke({ color: restored ? '#c6e2ba' : '#62847d', width: 4 }));
  layer.addChild(new Graphics().circle(680, 255, 30).fill({ color: targetActive ? '#d2aa70' : view.pocket ? '#c99555' : '#466c68', alpha: targetActive ? 1 : 0.95 }).stroke({ color: '#e8d39e', width: 3 }));
  drawGlyph(layer, 680, 255, view.pocket || restored ? '#f1c56e' : '#73918a', targetActive ? 1.2 : 0.8);
  addText(layer, t('scene.glyphSource'), 261, 325, '#d7e1cf');
  addText(layer, t(restored ? 'scene.connected' : view.pocket ? 'scene.glyphReady' : 'scene.lockSocket'), 631, 325, '#d7e1cf');
}

function drawGlyph(layer: Container, x: number, y: number, color: string, scale: number): void {
  layer.addChild(new Graphics().circle(x, y, 8 * scale).fill(color).stroke({ color: '#fff0c4', width: 2 }));
  layer.addChild(new Graphics().moveTo(x - 12 * scale, y).lineTo(x + 12 * scale, y).moveTo(x, y - 12 * scale).lineTo(x, y + 12 * scale).stroke({ color, width: 2 }));
}

function drawStations(layer: Container, serviced: number, replaying: boolean, recording: boolean, capsuleLength: number, lastAction: string | undefined, tick: number): void {
  [300, 680].forEach((x, index) => {
    const active = index < serviced;
    const pulsing = lastAction === 'interact' && active;
    layer.addChild(new Graphics().circle(x, 255, 54).fill({ color: active ? '#82b99a' : '#b07c57', alpha: pulsing ? 0.22 + (tick % 2) * 0.08 : 0.08 }));
    layer.addChild(new Graphics().roundRect(x - 35, 220, 70, 70, 12).fill(active ? '#82b99a' : '#b07c57').stroke({ color: '#e8d39e', width: 3 }));
    layer.addChild(new Graphics().circle(x, 255, 14).fill(active ? '#d7efc2' : '#624a3e'));
    addText(layer, String(index + 1), x - 4, 300, '#d7e1cf');
  });
  const capsule = new Graphics().roundRect(446, 170, 88, 62, 18).fill('#3c5e5b').stroke({ color: recording ? '#e7bf72' : '#82b99a', width: 4 });
  layer.addChild(capsule);
  layer.addChild(new Graphics().roundRect(461, 187, 58, 27, 8).fill('#152d30'));
  for (let index = 0; index < 2; index += 1) {
    layer.addChild(new Graphics().circle(477 + index * 20, 200, 6).fill(index < capsuleLength ? '#e7bf72' : '#466c68'));
  }
  addText(layer, t(replaying ? 'scene.capsulePlaying' : recording ? 'scene.capsuleRecording' : 'scene.capsule'), 360, 105, '#efc98b');
}
function drawWires(layer: Container, view: ReturnType<typeof toL5View>): void {
  const rows = { left: 230, right: 330 } as const;
  const arms = { leftArm: 230, rightArm: 330 } as const;
  (['left', 'right'] as const).forEach((sensor) => {
    const sourceY = rows[sensor];
    const destinationY = arms[view.bindings[sensor]];
    const active = view.sensor === sensor;
    const color = active ? (view.wallHit ? '#c26c61' : '#e7bf72') : '#4f7772';
    layer.addChild(new Graphics().moveTo(220, sourceY).lineTo(375, sourceY).lineTo(525, destinationY).lineTo(680, destinationY).stroke({ color, width: active ? 10 : 7 }));
    layer.addChild(new Graphics().circle(220, sourceY, active ? 14 : 11).fill(color).stroke({ color: '#d7e1cf', width: 2 }));
  });
  layer.addChild(new Graphics().roundRect(755, 170, 80, 220, 18).fill('#173437').stroke({ color: '#466c68', width: 3 }));
  drawArm(layer, 700, arms.leftArm, view.actuator === 'leftArm', view.wallHit && view.actuator === 'leftArm');
  drawArm(layer, 700, arms.rightArm, view.actuator === 'rightArm', view.wallHit && view.actuator === 'rightArm');
  addText(layer, t('scene.leftSensor'), 94, 218, '#d7e1cf');
  addText(layer, t('scene.rightSensor'), 94, 318, '#d7e1cf');
  addText(layer, t('binding.leftArm'), 680, 198, '#d7e1cf');
  addText(layer, t('binding.rightArm'), 680, 398, '#d7e1cf');
  if (view.wallHit) addText(layer, t('scene.clang'), 770, 275, '#efc98b');
}

function drawArm(layer: Container, x: number, y: number, active: boolean, hit: boolean): void {
  const arm = new Container();
  arm.position.set(x, y);
  arm.rotation = active ? (hit ? -0.65 : 0.45) : 0;
  arm.addChild(new Graphics().roundRect(-8, -52, 16, 52, 8).fill(hit ? '#c26c61' : active ? '#e7bf72' : '#b07c57'));
  arm.addChild(new Graphics().circle(0, -56, 12).fill(hit ? '#c26c61' : active ? '#e7bf72' : '#b07c57').stroke({ color: '#f8e4bb', width: 2 }));
  layer.addChild(arm);
}
function addText(layer: Container, text: string, x: number, y: number, fill: string): void {
  const label = new Text({ text, style: new TextStyle({ fontSize: 13, fill, fontWeight: '700' }) });
  label.position.set(x, y);
  layer.addChild(label);
}
