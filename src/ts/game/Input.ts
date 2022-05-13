export type Input = {
  key: KeyInput;
};

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
  private _down: Map<string, number> = new Map<string, number>();

  private _up: Map<string, number> = new Map<string, number>();
  reset() {
    this._down = new Map<string, number>();
    this._up = new Map<string, number>();
  }
  down(code: KeyboardEvent["code"]) {
    return this._down.get(code) ?? 0;
  }
  up(code: KeyboardEvent["code"]) {
    return this._up.get(code) ?? 0;
  }
}
