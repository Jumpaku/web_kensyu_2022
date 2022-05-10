import { Input, KeyInput } from "./Input";
import { Scene } from "./Scene";

export class Game {
  constructor(initialScene: Scene) {
    this.performFrame = this.performFrame.bind(this);
    this.currentScene = initialScene;
    this.input = { key: new KeyInput() };
  }
  private currentScene: Scene;
  private input: Input;
  start() {
    window.requestAnimationFrame(this.performFrame);
  }
  performFrame(timeMicroseconds: number) {
    const timeSeconds = timeMicroseconds / 1000.0;
    this.currentScene = this.currentScene.update(timeSeconds, this.input);
    this.currentScene.draw();
    this.input.key.reset();
    window.requestAnimationFrame(this.performFrame);
  }
}
