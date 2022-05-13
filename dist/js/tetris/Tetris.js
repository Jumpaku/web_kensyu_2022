import Immutable from "immutable";
import { panic } from "../utils/panic";
import { Random } from "../utils/Random";
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
export function Tetris(config, random) {
    return new TetrisImpl(config, random);
}
export class TetrisImpl {
    config;
    static nextPreparedBlocks(random) {
        return random.shuffle([
            new BlockI(0, new Pos(0, 3)),
            new BlockJ(0, new Pos(0, 3)),
            new BlockL(0, new Pos(0, 3)),
            new BlockO(0, new Pos(0, 4)),
            new BlockS(0, new Pos(0, 3)),
            new BlockT(0, new Pos(0, 3)),
            new BlockZ(0, new Pos(0, 3)),
        ]);
    }
    constructor(config, stateOrRandom) {
        this.config = config;
        if (stateOrRandom instanceof Random) {
            this.state = {
                board: new Board(config.rows, config.columns),
                random: stateOrRandom.next(),
                heldBlock: null,
                remainingCells: CellSet(),
                tag: "PrepareNext",
                blockQueue: TetrisImpl.nextPreparedBlocks(stateOrRandom),
                currentBlock: null,
            };
        }
        else {
            this.state = stateOrRandom;
        }
        console.log(this.state);
    }
    state;
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
            changed: true,
            tetris: new TetrisImpl(this.config, newState),
        };
    }
    newDownBlockResult(newState) {
        return {
            tag: "Ok",
            tetris: new TetrisImpl(this.config, newState),
        };
    }
    newNextBlockResult(newState, removedLines) {
        return {
            tag: "Ok",
            removedLines: removedLines,
            tetris: new TetrisImpl(this.config, newState),
        };
    }
    newTetrisError(message) {
        return { tag: "Err", message: message };
    }
    blocksAreAcceptable(currentBlock, board, remainingCells) {
        return (currentBlock.remove(board).isEmpty() &&
            remainingCells.remove(board).isEmpty() &&
            currentBlock.intersect(remainingCells).isEmpty());
    }
    operateRotate(clockwise) {
        console.log(`operateRotate(clockwise:${clockwise})`);
        const { tag: stateTag, currentBlock, board, remainingCells } = this.state;
        if (stateTag !== "WaitDown")
            panic("operateRotate method must be called in WaitDown state");
        const rotated = currentBlock?.rotate(clockwise);
        if (rotated == null ||
            !this.blocksAreAcceptable(rotated, board, remainingCells))
            return this.newOperateResultNoChange();
        return this.newOperateResult({
            ...this.state,
            currentBlock: rotated,
        });
    }
    operateMove(toRight) {
        console.log(`operateMove(toRight:${toRight})`);
        const { tag: stateTag, currentBlock, board, remainingCells } = this.state;
        if (stateTag !== "WaitDown")
            panic("operateMove method must be called in WaitDown state");
        const moved = currentBlock?.move(toRight ? Move.right() : Move.left());
        if (moved == null ||
            !this.blocksAreAcceptable(moved, board, remainingCells))
            return this.newOperateResultNoChange();
        return this.newOperateResult({
            ...this.state,
            currentBlock: moved,
        });
    }
    getGhost() {
        const { tag: stateTag, currentBlock, board, remainingCells } = this.state;
        let before = currentBlock;
        if (before == null)
            return null;
        let after = before.move(Move.down());
        while (true) {
            if (!this.blocksAreAcceptable(after, board, remainingCells))
                return before;
            before = after;
            after = before.move(Move.down());
        }
    }
    operateDrop() {
        console.log("operateDrop");
        const { tag: stateTag, currentBlock } = this.state;
        if (stateTag !== "WaitDown")
            panic("operateDrop method must be called in WaitDown state");
        const ghost = this.getGhost();
        if (ghost == null || ghost.equals(currentBlock))
            return this.newOperateResultNoChange();
        return this.newOperateResult({ ...this.state, currentBlock: ghost });
    }
    operateHold() {
        console.log("operateHold");
        panic("operateHold method is not implemented");
    }
    downBlock() {
        console.log("downBlock");
        const { tag: stateTag, currentBlock, board, remainingCells } = this.state;
        if (stateTag !== "WaitDown")
            panic("downBlock method must be called in WaitDown state");
        let moved = currentBlock?.move(Move.down());
        if (moved == null ||
            !this.blocksAreAcceptable(moved, board, remainingCells))
            return this.newDownBlockResult({
                ...this.state,
                tag: "PrepareNext",
                currentBlock: null,
                remainingCells: remainingCells.union(currentBlock),
            });
        return this.newDownBlockResult({ ...this.state, currentBlock: moved });
    }
    getRemovedLines() {
        const { currentBlock, remainingCells } = this.state;
        let remaining = remainingCells.union(currentBlock ?? CellSet()).cells;
        const removedLines = new Map();
        for (let i = 0; i < this.config.rows; i++) {
            const line = Immutable.Set().withMutations((mutable) => {
                for (let j = 0; j < this.config.columns; j++) {
                    const cell = new Pos(i, j);
                    if (remaining.has(cell))
                        mutable.add(cell);
                }
            });
            if (line.size === this.config.columns)
                removedLines.set(i, CellSet(line));
        }
        return removedLines;
    }
    removeLines() {
        const { currentBlock, remainingCells } = this.state;
        const removedLines = this.getRemovedLines();
        let remaining = remainingCells.union(currentBlock ?? CellSet()).cells;
        for (let i = 0; i < this.config.rows; i++) {
            if (!removedLines.has(i))
                continue;
            const down = remaining
                .filter((pos) => pos.row < i)
                .map((pos) => pos.move(Move.down()));
            const stay = remaining.filter((pos) => pos.row > i);
            remaining = stay.union(down);
        }
        return [removedLines, CellSet(remaining)];
    }
    prepareBlockQueue() {
        const { blockQueue, random } = this.state;
        let [next, ...prepared] = blockQueue;
        if (prepared.length < 7) {
            prepared.push(...TetrisImpl.nextPreparedBlocks(random));
        }
        return [next, prepared];
    }
    nextBlock() {
        const { tag: stateTag, board, random } = this.state;
        console.log("nextBlock", stateTag);
        if (stateTag !== "PrepareNext")
            return this.newTetrisError("nextBlock method must be called in PrepareNext state");
        const [removedLines, remaining] = this.removeLines();
        const [next, prepared] = this.prepareBlockQueue();
        if (!this.blocksAreAcceptable(next, board, remaining))
            return this.newNextBlockResult({
                ...this.state,
                currentBlock: next,
                tag: "GameOver",
            }, removedLines);
        return this.newNextBlockResult({
            ...this.state,
            tag: "WaitDown",
            currentBlock: next,
            blockQueue: prepared,
            remainingCells: remaining,
            random: random.next(),
        }, removedLines);
    }
}
