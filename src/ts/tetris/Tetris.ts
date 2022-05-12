import { Deque } from "../utils/Deque";
import { Random } from "../utils/Random";
import { Block } from "./blocks/Block";
import { BlockI } from "./blocks/BlockI";
import { BlockJ } from "./blocks/BlockJ";
import { BlockL } from "./blocks/BlockL";
import { BlockO } from "./blocks/BlockO";
import { BlockS } from "./blocks/BlockS";
import { BlockT } from "./blocks/BlockT";
import { BlockZ } from "./blocks/BlockZ";
import { Board } from "./Board";
import { CellSet } from "./CellSet";
import { Move, Pos } from "./gridGeometry";

export type TetrisConfig = { columns: number; rows: number };
export type TetrisState = {
  stateTag: "WaitDown" | "PrepareNext" | "GameOver";
  blockQueue: Deque<Block>;
  currentBlock: Block;
  heldBlock: Block | null;
  board: Board;
  remainingCells: CellSet;
  erasedLines: number;
  random: Random;
};
export type TetrisError = {
  tag: "Error";
  message: string;
};
export type OperateResult =
  | { tag: "Ok"; tetris: Tetris; changed: boolean }
  | TetrisError;
export type DownBlockResult = { tag: "Ok"; tetris: Tetris } | TetrisError;
export type NextBlockResult =
  | { tag: "Ok"; tetris: Tetris; previousErasedLines: number }
  | TetrisError;
export interface Tetris {
  readonly config: { columns: number; rows: number };
  readonly state: TetrisState;
  operateRotate(clockwise: boolean): OperateResult;
  operateMove(toRight: boolean): OperateResult;
  operateDrop(): OperateResult;
  operateHold(): OperateResult;
  downBlock(): DownBlockResult;
  nextBlock(): NextBlockResult;
}

class TetrisImpl implements Tetris {
  constructor(readonly config: TetrisConfig, readonly state: TetrisState) {}
  private newOperateResultNoChange(): OperateResult {
    return {
      tag: "Ok",
      changed: false,
      tetris: this,
    };
  }
  private newOperateResult(newState: TetrisState): OperateResult {
    return {
      tag: "Ok",
      changed: false,
      tetris: new TetrisImpl(this.config, newState),
    };
  }
  private newDownBlockResult(newState: TetrisState): DownBlockResult {
    return {
      tag: "Ok",
      tetris: new TetrisImpl(this.config, newState),
    };
  }
  private newNextBlockResult(
    newState: TetrisState,
    previousErasedLines: number
  ): NextBlockResult {
    return {
      tag: "Ok",
      previousErasedLines: previousErasedLines,
      tetris: new TetrisImpl(this.config, newState),
    };
  }
  private newTetrisError(message: string): TetrisError {
    return { tag: "Error", message: message };
  }
  private blocksAreAcceptable(
    currentBlock: Block,
    board: Board,
    remainingCells: CellSet
  ): boolean {
    return (
      currentBlock.remove(board).isEmpty() &&
      remainingCells.remove(board).isEmpty() &&
      !currentBlock.intersect(remainingCells).isEmpty()
    );
  }
  operateRotate(clockwise: boolean): OperateResult {
    const { stateTag, currentBlock, board, remainingCells } = this.state;
    if (stateTag !== "WaitDown")
      return this.newTetrisError(
        "operateRotate method must be called in WaitDown state"
      );
    const rotated = currentBlock.rotate(clockwise);
    if (!this.blocksAreAcceptable(rotated, board, remainingCells))
      return this.newOperateResultNoChange();
    return this.newOperateResult({
      ...this.state,
      currentBlock: rotated,
    });
  }
  operateMove(toRight: boolean): OperateResult {
    const { stateTag, currentBlock, board, remainingCells } = this.state;
    if (stateTag !== "WaitDown")
      return this.newTetrisError(
        "operateMove method must be called in WaitDown state"
      );
    const moved = currentBlock.move(toRight ? Move.right() : Move.left());
    if (!this.blocksAreAcceptable(moved, board, remainingCells))
      return this.newOperateResultNoChange();
    return this.newOperateResult({
      ...this.state,
      currentBlock: moved,
    });
  }
  operateDrop(): OperateResult {
    const { stateTag, currentBlock, board, remainingCells } = this.state;
    if (stateTag !== "WaitDown")
      return this.newTetrisError(
        "operateDrop method must be called in WaitDown state"
      );
    let before = currentBlock;
    let after = before.move(Move.down());
    if (!this.blocksAreAcceptable(after, board, remainingCells))
      return this.newOperateResultNoChange();
    while (true) {
      before = after;
      after = before.move(Move.down());
      if (!this.blocksAreAcceptable(after, board, remainingCells))
        return this.newOperateResult({ ...this.state, currentBlock: before });
    }
  }
  operateHold(): OperateResult {
    return this.newTetrisError("operateHold method is not implemented");
  }
  downBlock(): DownBlockResult {
    const { stateTag, currentBlock, board, remainingCells } = this.state;
    if (stateTag !== "WaitDown")
      return this.newTetrisError(
        "downBlock method must be called in WaitDown state"
      );
    let moved = currentBlock.move(Move.down());
    if (!this.blocksAreAcceptable(moved, board, remainingCells))
      return this.newDownBlockResult({
        ...this.state,
        stateTag: "PrepareNext",
      });
    return this.newDownBlockResult({ ...this.state, currentBlock: moved });
  }
  private removeLines(): [number, CellSet] {
    const { currentBlock, remainingCells } = this.state;
    let remaining = remainingCells.union(currentBlock).cells;
    const removeRows = [];
    for (let i = 0; i < this.config.rows; i++) {
      if (remaining.count((pos) => pos.row === i) === this.config.columns)
        removeRows.push(i);
    }
    for (let i = 0; i < removeRows.length; i++) {
      const removeRow = removeRows[i]!;
      const stay = remaining.filter((pos) => pos.row > removeRow);
      const down = remaining
        .filter((pos) => pos.row < removeRow)
        .map((pos) => pos.move(Move.down()));
      remaining = stay.union(down);
    }
    return [removeRows.length, CellSet(remaining)];
  }
  private nextPreparedBlocks(): Block[] {
    return this.state.random.shuffle([
      new BlockI(0, new Pos(0, 3)),
      new BlockJ(0, new Pos(0, 3)),
      new BlockL(0, new Pos(0, 3)),
      new BlockO(0, new Pos(0, 3)),
      new BlockS(0, new Pos(0, 3)),
      new BlockT(0, new Pos(0, 3)),
      new BlockZ(0, new Pos(0, 3)),
    ]);
  }
  private prepareBlockQueue(): [Block, Deque<Block>] {
    const { blockQueue } = this.state;
    const next = blockQueue.peekFront()!;
    let prepared = blockQueue.popFront()!;
    if (blockQueue.size <= 7) {
      for (const block of this.nextPreparedBlocks()) {
        prepared.pushBack(block);
      }
    }
    return [next, blockQueue];
  }
  nextBlock(): NextBlockResult {
    const { stateTag, board, random } = this.state;
    if (stateTag !== "PrepareNext")
      return this.newTetrisError(
        "nextBlock method must be called in PrepareNext state"
      );
    const [nRemovals, remaining] = this.removeLines();
    if (!remaining.remove(board).isEmpty())
      return this.newNextBlockResult(
        {
          ...this.state,
          stateTag: "GameOver",
          random: random.next(),
        },
        nRemovals
      );
    const [next, prepared] = this.prepareBlockQueue();
    return this.newNextBlockResult(
      {
        ...this.state,
        currentBlock: next,
        blockQueue: prepared,
        random: random.next(),
      },
      nRemovals
    );
  }
}
