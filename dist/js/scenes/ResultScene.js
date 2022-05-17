import { StartScene } from "./StartScene";
export class ResultScene {
    removedLines;
    constructor(removedLines) {
        this.removedLines = removedLines;
        $("#removed-lines").val(removedLines);
        $("#result").show();
    }
    update(time, input) {
        if (input.key.down("Space")) {
            $("#result").hide();
            return new StartScene();
        }
        return this;
    }
    draw() { }
}
