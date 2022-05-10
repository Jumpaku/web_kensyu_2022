import { Input, KeyInput } from "../game/Input";
import { Scene } from "../game/Scene";

export class EmptyScene implements Scene {
  private currentTime: number = 0;
  private currentKey: KeyInput | undefined;
  update(time: number, input: Input): Scene {
    this.currentTime = time;
    this.currentKey = input.key;
    return this;
  }
  draw() {
    console.log(
      "down",
      this.currentKey?.getDownCount("KeyA") ?? 0,
      "up",
      this.currentKey?.getUpCount("KeyA") ?? 0
    );
  }
}
