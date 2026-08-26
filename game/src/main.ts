import './styles.css';
import './workbench/styles.css';
import { createGameShell, type GameShellHandle } from './app/game-shell';
import { navigate, readRoute, type Route } from './app/router';
import { initializeI18n, t } from './i18n';

initializeI18n();

const homePage = requiredElement<HTMLElement>('home-page');
const settingsPage = requiredElement<HTMLElement>('settings-page');
const gamePage = requiredElement<HTMLElement>('game-page');
const gameMenu = requiredElement<HTMLElement>('game-menu');
const settingsBackLabel = requiredElement<HTMLElement>('settings-back-label');
let gameInitialization: Promise<GameShellHandle> | undefined;
let activeRoute: Route = readRoute();

document.querySelector<HTMLButtonElement>('#home-start')?.addEventListener('click', () => navigate('/game'));
document.querySelector<HTMLButtonElement>('#home-settings')?.addEventListener('click', () => navigate('/settings'));
document.querySelector<HTMLButtonElement>('#game-menu-button')?.addEventListener('click', () => {
  gameMenu.hidden = !gameMenu.hidden;
  void gameInitialization?.then((game) => gameMenu.hidden ? game.resume() : game.pause());
});
document.querySelector<HTMLButtonElement>('#menu-continue')?.addEventListener('click', () => {
  gameMenu.hidden = true;
  void gameInitialization?.then((game) => game.resume());
});
document.querySelector<HTMLButtonElement>('#menu-settings')?.addEventListener('click', () => navigate('/settings?from=game'));
document.querySelector<HTMLButtonElement>('#menu-home')?.addEventListener('click', () => navigate('/'));
document.querySelector<HTMLButtonElement>('#settings-back')?.addEventListener('click', () => {
  navigate(activeRoute.name === 'settings' && activeRoute.from === 'game' ? '/game' : '/');
});
gameMenu.addEventListener('click', (event) => {
  if (event.target === gameMenu) {
    gameMenu.hidden = true;
    void gameInitialization?.then((game) => game.resume());
  }
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !gameMenu.hidden) {
    gameMenu.hidden = true;
    void gameInitialization?.then((game) => game.resume());
  }
});
window.addEventListener('popstate', () => renderRoute(readRoute()));

renderRoute(activeRoute);

function renderRoute(route: Route): void {
  activeRoute = route;
  homePage.hidden = route.name !== 'home';
  settingsPage.hidden = route.name !== 'settings';
  gamePage.hidden = route.name !== 'game';
  gameMenu.hidden = true;
  if (route.name === 'game') void gameInitialization?.then((game) => game.resume());
  else void gameInitialization?.then((game) => game.pause());

  if (route.name === 'settings') {
    const backKey = route.from === 'game' ? 'settings.backGame' : 'settings.backHome';
    settingsBackLabel.dataset.i18n = backKey;
    settingsBackLabel.textContent = t(backKey);
  }

  if (route.name === 'game') {
    gameInitialization ??= createGameShell();
    void gameInitialization.catch((error: unknown) => {
      console.error('Unable to load the workshop.', error);
    });
  }
}

function requiredElement<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing app element: ${id}`);
  return node as T;
}
