import { Input } from "../game/Input";
import { Scene } from "../game/Scene";
import { PlayConfig, PlayScene } from "./PlayScene";

export class DebugScene extends PlayScene implements Scene {
  constructor(config: Omit<PlayConfig, "waitDownTimeSpan">) {
    super({ ...config, waitDownTimeSpan: NaN });
  }
  override shouldUpdate(time: number, input: Input): boolean {
    return input.key.down("Space") > 0;
  }
}
