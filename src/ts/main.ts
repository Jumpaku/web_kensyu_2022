import { Game } from "./game/Game";
import { DebugScene } from "./scenes/debug/DebugScene";
import { EmptyScene } from "./scenes/EmptyScene";

$(() => {
  console.log("load");
  new Game(new DebugScene()).start();
});
