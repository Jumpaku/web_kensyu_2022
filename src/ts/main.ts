import { Game } from "./game/Game";
import { StartScene } from "./scenes/StartScene";

$(() => {
  $("main > div").hide();
  new Game(new StartScene()).start();
});
