import { Game } from "./game/Game";
import { EmptyScene } from "./scenes/EmptyScene";
export const main = () => {
    new Game(new EmptyScene()).start();
};
document.querySelector("body").onload = main;
