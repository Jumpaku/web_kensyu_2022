export type Input = {
  key: KeyInput;
};

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
  private downCount: Map<string, number> = new Map<string, number>();
  private upCount: Map<string, number> = new Map<string, number>();
  reset() {
    this.downCount = new Map<string, number>();
    this.upCount = new Map<string, number>();
  }
  getDownCount(code: KeyboardEvent["code"]) {
    return this.downCount.get(code) ?? 0;
  }
  getUpCount(code: KeyboardEvent["code"]) {
    return this.upCount.get(code) ?? 0;
  }
}
