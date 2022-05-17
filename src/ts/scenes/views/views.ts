import { Board } from "../../tetris/Board";
import { CellSet } from "../../tetris/CellSet";
import { Pos } from "../../tetris/gridGeometry";

export type Canvas = {
  context: CanvasRenderingContext2D;
  originX: number;
  originY: number;
  width: number;
  height: number;
  cellSize: number;
};

export type Viewport = {
  originX: number;
  originY: number;
  width: number;
  height: number;
};

export type CellStyle = Partial<{
  padding: number;
  boarder: number;
  fillColor: string;
  strokeColor: string;
}>;

export function clearCanvas({
  context,
  originX,
  originY,
  width,
  height,
}: Canvas) {
  context.clearRect(originX, originY, width, height);
}
export function drawCell(
  { context, cellSize, originX, originY }: Canvas,
  { col, row }: Pos,
  { padding = 0, boarder = 1, fillColor, strokeColor }: CellStyle
) {
  if (fillColor != null) {
    context.fillStyle = fillColor;
    context.fillRect(
      col * cellSize + originX + padding,
      row * cellSize + originY + padding,
      cellSize - 2 * padding,
      cellSize - 2 * padding
    );
  }
  if (strokeColor != null) {
    context.strokeStyle = strokeColor;
    context.lineWidth = boarder;
    context.strokeRect(
      col * cellSize + originX + padding - boarder * 0.5,
      row * cellSize + originY + padding - boarder * 0.5,
      cellSize - 2 * padding + boarder,
      cellSize - 2 * padding + boarder
    );
  }
}
export function drawCellSet(
  canvas: Canvas,
  { cells }: CellSet,
  style: CellStyle
) {
  cells.forEach((cell) => {
    drawCell(canvas, cell, style);
  });
}
