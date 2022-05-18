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
                canHold: true,
                remainingCells: new CellSet(),
                tag: "PrepareNext",
                blockQueue: TetrisImpl.nextPreparedBlocks(stateOrRandom),
                currentBlock: null,
            };
        }
        else {
            this.state = stateOrRandom;
        }
    }
    state;
    getBlockQueue() {
        const [b0, b1, b2, b3, b4, b5, b6, ..._] = this.state.blockQueue;
        return [b0, b1, b2, b3, b4, b5, b6];
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
            currentBlock.intersect(remainingCells).isEmpty() &&
            remainingCells
                .toArray()
                .map(({ row }) => row > 1)
                .reduce((a, b) => a && b, true));
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
        console.log("operateDrop()");
        const { tag: stateTag, currentBlock } = this.state;
        if (stateTag !== "WaitDown")
            panic("operateDrop method must be called in WaitDown state");
        const ghost = this.getGhost();
        if (ghost == null || ghost.equals(currentBlock))
            return this.newOperateResultNoChange();
        return this.newOperateResult({ ...this.state, currentBlock: ghost });
    }
    operateHold() {
        console.log("operateHold()");
        const { tag, canHold, currentBlock, blockQueue, heldBlock, random } = this.state;
        if (tag !== "WaitDown")
            return panic("operateDrop method must be called in WaitDown state");
        if (!canHold)
            return this.newOperateResultNoChange();
        const toBeHeld = new Map([
            ["I", new BlockI(0, new Pos(0, 3))],
            ["J", new BlockJ(0, new Pos(0, 3))],
            ["L", new BlockL(0, new Pos(0, 3))],
            ["O", new BlockO(0, new Pos(0, 4))],
            ["S", new BlockS(0, new Pos(0, 3))],
            ["T", new BlockT(0, new Pos(0, 3))],
            ["Z", new BlockZ(0, new Pos(0, 3))],
        ]).get(currentBlock.name);
        if (heldBlock == null) {
            const [next, prepared] = TetrisImpl.prepareBlockQueue(blockQueue, random);
            return this.newOperateResult({
                ...this.state,
                heldBlock: toBeHeld,
                currentBlock: next,
                blockQueue: prepared,
                random: random.next(),
            });
        }
        else {
            const next = heldBlock;
            return this.newOperateResult({
                ...this.state,
                heldBlock: toBeHeld,
                currentBlock: next,
                canHold: false,
            });
        }
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
        let remaining = remainingCells.union(currentBlock ?? new CellSet());
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
                removedLines.set(i, new CellSet(line));
        }
        return removedLines;
    }
    removeLines() {
        const { currentBlock, remainingCells } = this.state;
        const removedLines = this.getRemovedLines();
        let remaining = remainingCells.union(currentBlock ?? new CellSet());
        for (let i = 0; i < this.config.rows; i++) {
            if (!removedLines.has(i))
                continue;
            const down = remaining
                .toArray()
                .filter((pos) => pos.row < i)
                .map((pos) => pos.move(Move.down()));
            const stay = remaining.toArray().filter((pos) => pos.row > i);
            remaining = new CellSet(stay).union(new CellSet(down));
        }
        return [removedLines, remaining];
    }
    static prepareBlockQueue(blockQueue, random) {
        let [next, ...prepared] = blockQueue;
        if (prepared.length < 7) {
            prepared.push(...TetrisImpl.nextPreparedBlocks(random));
        }
        return [next, prepared];
    }
    nextBlock() {
        const { tag: stateTag, board, blockQueue, random, canHold } = this.state;
        console.log("nextBlock", stateTag);
        if (stateTag !== "PrepareNext")
            return this.newTetrisError("nextBlock method must be called in PrepareNext state");
        const [removedLines, remaining] = this.removeLines();
        const [next, prepared] = TetrisImpl.prepareBlockQueue(blockQueue, random);
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
            canHold: true,
        }, removedLines);
    }
}
