import { Application, Container } from 'pixi.js';

export interface PixiHostOptions {
  readonly width: number;
  readonly height: number;
  readonly background: string;
}

export interface PixiHost {
  readonly app: Application;
  readonly world: Container;
  replaceWorld(): Container;
  destroy(): void;
}

export async function createPixiHost(container: HTMLElement, options: PixiHostOptions): Promise<PixiHost> {
  const app = new Application();
  await app.init({
    width: options.width,
    height: options.height,
    background: options.background,
    antialias: true,
    resizeTo: container,
  });
  container.appendChild(app.canvas);
  let world = new Container();
  app.stage.addChild(world);
  return {
    app,
    get world() { return world; },
    replaceWorld() {
      app.stage.removeChild(world);
      world.destroy({ children: true });
      world = new Container();
      app.stage.addChild(world);
      return world;
    },
    destroy() {
      world.destroy({ children: true });
      app.destroy(true, { children: true });
    },
  };
}
