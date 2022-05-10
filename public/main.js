class KeyInput {
    constructor() {
        window.addEventListener("keydown", (e) => {
            const prevCount = this.downCount.get(e.code) ?? 0;
            this.downCount.set(e.code, prevCount + 1);
        });
        window.addEventListener("keyup", (e) => {
            const prevCount = this.upCount.get(e.code) ?? 0;
            this.upCount.set(e.code, prevCount + 1);
        });
    }
    downCount = new Map();
    upCount = new Map();
    reset() {
        this.downCount = new Map();
        this.upCount = new Map();
    }
    getDownCount(code) {
        return this.downCount.get(code) ?? 0;
    }
    getUpCount(code) {
        return this.upCount.get(code) ?? 0;
    }
}

class Game {
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

class EmptyScene {
    currentTime = 0;
    currentKey;
    update(time, input) {
        this.currentTime = time;
        this.currentKey = input.key;
        return this;
    }
    draw() {
        console.log("down", this.currentKey?.getDownCount("KeyA") ?? 0, "up", this.currentKey?.getUpCount("KeyA") ?? 0);
    }
}

const main = () => {
    new Game(new EmptyScene()).start();
};
document.querySelector("body").onload = main;

export { main };
//# sourceMappingURL=main.bundle.js.map
