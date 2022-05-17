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
        seed: Math.random(),
        waitDownTimeSpan: 0.5,
      });
    }
    if (input.key.down("Escape")) {
      $("#start").hide();
      return new DebugScene({
        columns: 10,
        rows: 20,
        seed: Math.random(),
      });
    }
    return this;
  }

  draw() {
    const g = ($("#main-canvas")[0] as HTMLCanvasElement).getContext("2d")!;

    // クリア
    g.clearRect(0, 0, 480, 640);
    g.fillStyle = "black";
    g.fillText("Press Space Key!", 200, 200);
  }
}
