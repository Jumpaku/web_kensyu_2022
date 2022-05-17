import { Input } from "../../game/Input";
import { Scene } from "../../game/Scene";
import { Block } from "../../tetris/blocks/Block";
import { Board } from "../../tetris/Board";
import { CellSet } from "../../tetris/CellSet";
import { Pos } from "../../tetris/gridGeometry";
import { OperateResult, Tetris } from "../../tetris/Tetris";
import { Random } from "../../utils/Random";

export class DebugScene implements Scene {
  tetris: Tetris = Tetris(
    {
      columns: 10,
      rows: 20,
    },
    new Random(1)
  );
  canvas: Canvas;
  constructor() {
    const ctx = ($("#main-canvas")[0] as HTMLCanvasElement).getContext("2d")!;
    this.canvas = {
      cellSize: 20,
      context: ctx,
      height: 480,
      width: 640,
      originX: 20,
      originY: 20,
    };
  }

  update(time: number, input: Input): Scene {
    if (this.tetris.state.tag === "WaitDown") {
      const _this = this;
      function updateByKey(keycode: string, operate: () => OperateResult) {
        if (input.key.down(keycode)) {
          const result = operate();
          if (result.changed) _this.tetris = result.tetris;
        }
      }
      updateByKey("KeyA", () => this.tetris.operateRotate(false));
      updateByKey("KeyD", () => this.tetris.operateRotate(true));
      updateByKey("ArrowLeft", () => this.tetris.operateMove(false));
      updateByKey("ArrowRight", () => this.tetris.operateMove(true));
      updateByKey("ArrowDown", () => this.tetris.operateDrop());
      updateByKey("ArrowUp", () => this.tetris.operateHold());
    }
    if (input.key.down("Space")) {
      switch (this.tetris.state.tag) {
        case "PrepareNext": {
          const t = this.tetris.nextBlock();
          if (t.tag === "Err") console.log(t.message);
          else this.tetris = t.tetris;
          break;
        }
        case "WaitDown": {
          const t = this.tetris.downBlock();
          if (t.tag === "Err") console.log(t.message);
          else this.tetris = t.tetris;
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
    for (const [_, cells] of this.tetris.getRemovedLines()) {
      drawCellSet(this.canvas, cells, {
        fillColor: "red",
        padding: 1,
      });
    }
    if (tag === "WaitDown") {
      const ghost = this.tetris.getGhost()!;
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

type Canvas = {
  context: CanvasRenderingContext2D;
  originX: number;
  originY: number;
  width: number;
  height: number;
  cellSize: number;
};

type CellStyle = Partial<{
  padding: number;
  boarder: number;
  fillColor: string;
  strokeColor: string;
}>;

function clearCanvas({ context, originX, originY, width, height }: Canvas) {
  context.clearRect(originX, originY, width, height);
}
function drawCell(
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
function drawCellSet(canvas: Canvas, { cells }: CellSet, style: CellStyle) {
  cells.forEach((cell) => {
    drawCell(canvas, cell, style);
  });
}
function drawBoard(canvas: Canvas, board: Board) {
  drawCellSet(canvas, board, {
    padding: 0,
    boarder: 1,
    strokeColor: "black",
  });
}
