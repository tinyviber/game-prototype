import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import type { ProtagonistView } from './types';

export class ProtagonistRenderer {
  private readonly root = new Container();
  private readonly body = new Graphics();
  private readonly face = new Graphics();
  private readonly held = new Text({ text: '', style: new TextStyle({ fontSize: 14, fill: '#f8d79a' }) });

  constructor(parent: Container) {
    this.root.addChild(this.body, this.face, this.held);
    parent.addChild(this.root);
  }

  render(view: ProtagonistView): void {
    this.root.position.set(view.x, view.y);
    this.root.scale.x = view.facing === 'left' ? -1 : 1;
    this.body.clear().roundRect(-18, -24, 36, 38, 13).fill(view.activity === 'failed' || view.activity === 'confused' ? '#d47761' : '#e4ad70');
    this.face.clear().circle(-8, -5, 3).fill('#273548').circle(8, -5, 3).fill('#273548');
    if (view.activity === 'success') this.face.arc(0, 3, 8, 0.2, 2.9).stroke({ color: '#273548', width: 2 });
    if (view.activity === 'confused' || view.activity === 'failed') this.face.moveTo(-7, 5).lineTo(7, 5).stroke({ color: '#273548', width: 2 });
    this.held.text = view.held ? `◈ ${view.held}` : '';
    this.held.position.set(20, -16);
  }
}
