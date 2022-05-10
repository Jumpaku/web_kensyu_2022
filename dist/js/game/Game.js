import { KeyInput } from "./Input";
export class Game {
    constructor(initialScene) {
        this.performFrame = this.performFrame.bind(this);
        this.currentScene = initialScene;
        this.input = { key: new KeyInput() };
    }
    currentScene;
    input;
    start() {
        window.requestAnimationFrame(this.performFrame);
    }
    performFrame(timeMicroseconds) {
        const timeSeconds = timeMicroseconds / 1000.0;
        this.currentScene = this.currentScene.update(timeSeconds, this.input);
        this.currentScene.draw();
        this.input.key.reset();
        window.requestAnimationFrame(this.performFrame);
    }
}
