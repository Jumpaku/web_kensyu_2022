export class KeyInput {
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
