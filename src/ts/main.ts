import { Game } from "./game/Game";
import { DebugScene } from "./scenes/debug/DebugScene";
import { EmptyScene } from "./scenes/EmptyScene";
import { PlayScene } from "./scenes/play/PlayScene";

$(() => {
  console.log("load");
  new Game(new PlayScene(0, 1)).start();
});
