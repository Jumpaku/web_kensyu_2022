import { Tetris } from "../../tetris/Tetris";
import { Random } from "../../utils/Random";
import { clearCanvas, drawCellSet } from "../views/views";
import { drawBlockQueue, drawBoard } from "./views";
export class PlayScene {
    prevDownTime;
    downTimeSpan;
    tetris = Tetris({
        columns: 10,
        rows: 20,
    }, new Random(1));
    canvas;
    constructor(prevDownTime, downTimeSpan) {
        this.prevDownTime = prevDownTime;
        this.downTimeSpan = downTimeSpan;
        const context = $("#main-canvas")[0].getContext("2d");
        this.canvas = {
            cellSize: 20,
            context: context,
            height: 480,
            width: 640,
            originX: 20,
            originY: 20,
        };
    }
    update(time, input) {
        if (this.tetris.state.tag === "WaitDown") {
            const _this = this;
            function updateByKey(keycode, operate) {
                if (input.key.down(keycode)) {
                    const result = operate();
                    if (result.changed)
                        _this.tetris = result.tetris;
                }
            }
            updateByKey("KeyA", () => this.tetris.operateRotate(false));
            updateByKey("KeyD", () => this.tetris.operateRotate(true));
            updateByKey("ArrowLeft", () => this.tetris.operateMove(false));
            updateByKey("ArrowRight", () => this.tetris.operateMove(true));
            updateByKey("ArrowDown", () => this.tetris.operateDrop());
            //updateByKey("ArrowUp", () => this.tetris.operateHold());
        }
        if (time - this.prevDownTime > this.downTimeSpan) {
            this.prevDownTime = time;
            switch (this.tetris.state.tag) {
                case "PrepareNext": {
                    const t = this.tetris.nextBlock();
                    if (t.tag === "Err")
                        console.log(t.message);
                    else
                        this.tetris = t.tetris;
                    break;
                }
                case "WaitDown": {
                    const t = this.tetris.downBlock();
                    if (t.tag === "Err")
                        console.log(t.message);
                    else
                        this.tetris = t.tetris;
                    break;
                }
                case "GameOver":
                    break;
            }
        }
        return this;
    }
    draw() {
        clearCanvas(this.canvas);
        const { board, currentBlock, remainingCells, tag } = this.tetris.state;
        drawBoard(this.canvas, board);
        drawCellSet(this.canvas, remainingCells, {
            fillColor: "black",
            padding: 1,
        });
        drawBlockQueue(this.canvas, this.tetris.getBlockQueue());
        for (const [_, cells] of this.tetris.getRemovedLines()) {
            drawCellSet(this.canvas, cells, {
                fillColor: "red",
                padding: 1,
            });
        }
        if (tag === "WaitDown") {
            const ghost = this.tetris.getGhost();
            drawCellSet(this.canvas, ghost, {
                fillColor: "gray",
                padding: 1,
            });
        }
        if (currentBlock != null)
            drawCellSet(this.canvas, currentBlock, {
                fillColor: "orange",
                padding: 1,
            });
    }
}
