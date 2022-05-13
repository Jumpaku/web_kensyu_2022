export class KeyInput {
    constructor() {
        $(window).on("keydown", (e) => {
            const prevCount = this._down.get(e.code) ?? 0;
            this._down.set(e.code, prevCount + 1);
        });
        $(window).on("keyup", (e) => {
            const prevCount = this._up.get(e.code) ?? 0;
            this._up.set(e.code, prevCount + 1);
        });
    }
    _down = new Map();
    _up = new Map();
    reset() {
        this._down = new Map();
        this._up = new Map();
    }
    down(code) {
        return this._down.get(code) ?? 0;
    }
    up(code) {
        return this._up.get(code) ?? 0;
    }
}
