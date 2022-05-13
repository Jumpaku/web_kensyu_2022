import { Game } from "./game/Game";
import { DebugScene } from "./scenes/debug/DebugScene";
$(() => {
    console.log("load");
    new Game(new DebugScene()).start();
});
