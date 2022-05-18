import { Input } from "../game/Input";
import { Scene } from "../game/Scene";
import { DebugScene } from "./DebugScene";
import { PlayScene } from "./PlayScene";

export class StartScene implements Scene {
  constructor() {
    $("#start").show();
  }

  update(time: number, input: Input): Scene {
    if (input.key.down("Space")) {
      $("#start").hide();
      return new PlayScene({
        columns: 10,
        rows: 20,
        seed: new Date().getMilliseconds() + time,
        waitDownTimeSpan: 0.5,
      });
    }
    if (input.key.down("Escape")) {
      $("#start").hide();
      return new DebugScene({
        columns: 10,
        rows: 20,
        seed: 123456,
      });
    }
    return this;
  }

  draw() {}
}
