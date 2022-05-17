import { Game } from "./game/Game";
import { PlayScene } from "./scenes/play/PlayScene";
$(() => {
    console.log("load");
    new Game(new PlayScene(0, 1)).start();
});
