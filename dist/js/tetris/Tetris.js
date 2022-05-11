import immutable from "immutable";
import { BlockI } from "./blocks/BlockI";
import { BlockJ } from "./blocks/BlockJ";
import { BlockL } from "./blocks/BlockL";
import { BlockO } from "./blocks/BlockO";
import { BlockS } from "./blocks/BlockS";
import { BlockT } from "./blocks/BlockT";
import { BlockZ } from "./blocks/BlockZ";
import { CellSet } from "./CellSet";
import { Move, Pos } from "./geometry";
class TetrisImpl {
    config;
    state;
    constructor(config, state) {
        this.config = config;
        this.state = state;
    }
    newOperateResultNoChange() {
        return {
            tag: "Ok",
            changed: false,
            tetris: this,
        };
    }
    newOperateResult(newState) {
        return {
            tag: "Ok",
            changed: false,
            tetris: new TetrisImpl(this.config, newState),
        };
    }
    newDownBlockResult(newState) {
        return {
            tag: "Ok",
            tetris: new TetrisImpl(this.config, newState),
        };
    }
    newNextBlockResult(newState, previousErasedLines) {
        return {
            tag: "Ok",
            previousErasedLines: previousErasedLines,
            tetris: new TetrisImpl(this.config, newState),
        };
    }
    newTetrisError(message) {
        return { tag: "Error", message: message };
    }
    blocksAreAcceptable(currentBlock, board, remainingCells) {
        return (currentBlock.remove(board).isEmpty() &&
            remainingCells.remove(board).isEmpty() &&
            !currentBlock.intersect(remainingCells).isEmpty());
    }
    operateRotate(clockwise) {
        const { stateTag, currentBlock, board, remainingCells } = this.state;
        if (stateTag !== "WaitDown")
            return this.newTetrisError("operateRotate method must be called in WaitDown state");
        const rotated = currentBlock.rotate(clockwise);
        if (!this.blocksAreAcceptable(rotated, board, remainingCells))
            return this.newOperateResultNoChange();
        return this.newOperateResult({
            ...this.state,
            currentBlock: rotated,
        });
    }
    operateMove(toRight) {
        const { stateTag, currentBlock, board, remainingCells } = this.state;
        if (stateTag !== "WaitDown")
            return this.newTetrisError("operateMove method must be called in WaitDown state");
        const moved = currentBlock.move(toRight ? Move.right() : Move.left());
        if (!this.blocksAreAcceptable(moved, board, remainingCells))
            return this.newOperateResultNoChange();
        return this.newOperateResult({
            ...this.state,
            currentBlock: moved,
        });
    }
    operateDrop() {
        const { stateTag, currentBlock, board, remainingCells } = this.state;
        if (stateTag !== "WaitDown")
            return this.newTetrisError("operateDrop method must be called in WaitDown state");
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
    operateHold() {
        return this.newTetrisError("operateHold method is not implemented");
    }
    downBlock() {
        const { stateTag, currentBlock, board, remainingCells } = this.state;
        if (stateTag !== "WaitDown")
            return this.newTetrisError("downBlock method must be called in WaitDown state");
        let moved = currentBlock.move(Move.down());
        if (!this.blocksAreAcceptable(moved, board, remainingCells))
            return this.newDownBlockResult({
                ...this.state,
                stateTag: "PrepareNext",
            });
        return this.newDownBlockResult({ ...this.state, currentBlock: moved });
    }
    removeLines() {
        const { currentBlock, remainingCells } = this.state;
        let remaining = remainingCells.union(currentBlock).cells;
        const removeRows = [];
        for (let i = 0; i < this.config.rows; i++) {
            if (remaining.count((pos) => pos.row === i) === this.config.columns)
                removeRows.push(i);
        }
        for (let i = 0; i < removeRows.length; i++) {
            const removeRow = removeRows[i];
            const stay = remaining.filter((pos) => pos.row > removeRow);
            const down = remaining
                .filter((pos) => pos.row < removeRow)
                .map((pos) => pos.move(Move.down()));
            remaining = stay.union(down);
        }
        return [removeRows.length, CellSet(remaining)];
    }
    nextPreparedBlocks() {
        return immutable.Stack(this.state.random.shuffle([
            new BlockI(0, new Pos(0, 3)),
            new BlockJ(0, new Pos(0, 3)),
            new BlockL(0, new Pos(0, 3)),
            new BlockO(0, new Pos(0, 3)),
            new BlockS(0, new Pos(0, 3)),
            new BlockT(0, new Pos(0, 3)),
            new BlockZ(0, new Pos(0, 3)),
        ]));
    }
    prepareBlockQueue() {
        const { blockQueue } = this.state;
        const next = blockQueue.peekFront();
        let prepared = blockQueue.popFront();
        if (blockQueue.size <= 7) {
            for (const block of this.nextPreparedBlocks()) {
                prepared.pushBack(block);
            }
        }
        return [next, blockQueue];
    }
    nextBlock() {
        const { stateTag, board } = this.state;
        if (stateTag !== "PrepareNext")
            return this.newTetrisError("nextBlock method must be called in PrepareNext state");
        const [nRemovals, remaining] = this.removeLines();
        if (!remaining.remove(board).isEmpty())
            return this.newNextBlockResult({
                ...this.state,
                stateTag: "GameOver",
            }, nRemovals);
        const [next, prepared] = this.prepareBlockQueue();
        return this.newNextBlockResult({
            ...this.state,
            currentBlock: next,
            blockQueue: prepared,
        }, nRemovals);
    }
}
