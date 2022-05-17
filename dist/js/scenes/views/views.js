export function clearCanvas({ context, originX, originY, width, height, }) {
    context.clearRect(originX, originY, width, height);
}
export function drawCell({ context, cellSize, originX, originY }, { col, row }, { padding = 0, boarder = 1, fillColor, strokeColor }) {
    if (fillColor != null) {
        context.fillStyle = fillColor;
        context.fillRect(col * cellSize + originX + padding, row * cellSize + originY + padding, cellSize - 2 * padding, cellSize - 2 * padding);
    }
    if (strokeColor != null) {
        context.strokeStyle = strokeColor;
        context.lineWidth = boarder;
        context.strokeRect(col * cellSize + originX + padding - boarder * 0.5, row * cellSize + originY + padding - boarder * 0.5, cellSize - 2 * padding + boarder, cellSize - 2 * padding + boarder);
    }
}
export function drawCellSet(canvas, { cells }, style) {
    cells.forEach((cell) => {
        drawCell(canvas, cell, style);
    });
}
