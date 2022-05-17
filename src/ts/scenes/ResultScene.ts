import { Input } from "../game/Input";
import { Scene } from "../game/Scene";
import { OperateResult, Tetris } from "../tetris/Tetris";
import { Random } from "../utils/Random";
import { StartScene } from "./StartScene";

export class ResultScene implements Scene {
  constructor(private removedLines: number) {
    $("#removed-lines").val(removedLines);
    $("#result").show();
  }
  update(time: number, input: Input): Scene {
    if (input.key.down("Space")) {
      $("#result").hide();
      return new StartScene();
    }
    return this;
  }
  draw() {}
}
