import { Application } from 'pixi.js';

export interface PixiHostOptions {
  width: number;
  height: number;
  background: string;
}

/**
 * The only file in the repository allowed to construct a PixiJS Application. Every probe's
 * render.ts receives the already-initialized `app` from here — none of them import PixiJS
 * bootstrap concerns, they only draw into `app.stage`.
 */
export async function createPixiHost(container: HTMLElement, options: PixiHostOptions): Promise<Application> {
  const app = new Application();
  await app.init({
    width: options.width,
    height: options.height,
    background: options.background,
    antialias: true,
  });
  container.appendChild(app.canvas);
  return app;
}
