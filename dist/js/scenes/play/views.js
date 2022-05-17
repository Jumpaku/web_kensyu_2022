import { drawCellSet } from "../views/views";
export function drawBoard(canvas, board) {
    drawCellSet(canvas, board, {
        boarder: 1,
        strokeColor: "black",
    });
}
export function drawBlockQueue(canvas, blockQueue) {
    canvas.context.translate(250, 0);
    for (let index = 0; index < Math.min(7, blockQueue.length); index++) {
        const block = blockQueue[index];
        drawCellSet(canvas, block, {
            padding: 1,
            fillColor: "black",
        });
        canvas.context.translate(0, 50);
    }
    canvas.context.translate(-250, -350);
}
