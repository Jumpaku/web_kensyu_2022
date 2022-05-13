(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('immutable')) :
    typeof define === 'function' && define.amd ? define(['immutable'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Immutable));
})(this, (function (Immutable) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var Immutable__default = /*#__PURE__*/_interopDefaultLegacy(Immutable);

    class KeyInput {
        constructor() {
            $(window).on("keydown", (e) => {
                const prevCount = this._down.get(e.code) ?? 0;
                this._down.set(e.code, prevCount + 1);
            });
            $(window).on("keyup", (e) => {
                const prevCount = this._up.get(e.code) ?? 0;
                this._up.set(e.code, prevCount + 1);
            });
        }
        _down = new Map();
        _up = new Map();
        reset() {
            this._down = new Map();
            this._up = new Map();
        }
        down(code) {
            return this._down.get(code) ?? 0;
        }
        up(code) {
            return this._up.get(code) ?? 0;
        }
    }

    class Game {
        constructor(initialScene) {
            this.performFrame = this.performFrame.bind(this);
            this.currentScene = initialScene;
            this.input = { key: new KeyInput() };
        }
        currentScene;
        input;
        start() {
            window.requestAnimationFrame(this.performFrame);
        }
        performFrame(timeMicroseconds) {
            const timeSeconds = timeMicroseconds / 1000.0;
            this.currentScene = this.currentScene.update(timeSeconds, this.input);
            this.currentScene.draw();
            this.input.key.reset();
            window.requestAnimationFrame(this.performFrame);
        }
    }

    function panic(message) {
        throw new Error(message);
    }

    const Chance = window.Chance;

    class Random {
        seed;
        constructor(seed) {
            this.seed = seed;
        }
        shuffle(array) {
            const result = [...array];
            return new Chance(this.seed).shuffle(result);
        }
        next() {
            let chance = new Chance(this.seed);
            return new Random(chance.integer() + chance.integer());
        }
    }

    function CellSet(cells) {
        if (cells == null)
            return CellSet(Immutable__default["default"].Set());
        return new (class {
            cells;
            constructor(cells) {
                this.cells = cells;
            }
            union(other) {
                return CellSet(this.cells.union(other.cells));
            }
            intersect(other) {
                return CellSet(this.cells.intersect(other.cells));
            }
            remove(other) {
                return CellSet(this.cells.subtract(other.cells));
            }
            isEmpty() {
                return this.cells.isEmpty();
            }
        })(cells);
    }

    class BlockBase {
        state;
        base;
        name;
        cells;
        constructor(state, base, name, cells) {
            this.state = state;
            this.base = base;
            this.name = name;
            this.cells = cells;
        }
        equals(other) {
            return (other instanceof BlockBase &&
                this.name === other.name &&
                this.state === other.state &&
                Immutable__default["default"].is(this.base, other.base) &&
                this.cells.equals(other.cells));
        }
        hashCode() {
            return Immutable__default["default"].hash(this);
        }
        union(other) {
            return CellSet(this.cells.union(other.cells));
        }
        intersect(other) {
            return CellSet(this.cells.intersect(other.cells));
        }
        remove(other) {
            return CellSet(this.cells.subtract(other.cells));
        }
        isEmpty() {
            return this.cells.isEmpty();
        }
        rotate(clockwise) {
            return clockwise
                ? this.with({
                    state: ((this.state + 3) % 4),
                    base: this.base,
                })
                : this.with({
                    state: ((this.state + 1) % 4),
                    base: this.base,
                });
        }
        move(delta) {
            return this.with({
                state: this.state,
                base: this.base.move(delta),
            });
        }
    }

    class Move {
        rowDelta;
        colDelta;
        static up() {
            return new Move(-1, 0);
        }
        static down() {
            return new Move(1, 0);
        }
        static right() {
            return new Move(0, 1);
        }
        static left() {
            return new Move(0, -1);
        }
        constructor(rowDelta, colDelta) {
            this.rowDelta = rowDelta;
            this.colDelta = colDelta;
            if (!(this instanceof Move))
                return new Move(rowDelta, colDelta);
        }
        equals(other) {
            return (other instanceof Move &&
                this.rowDelta === other.rowDelta &&
                this.colDelta === other.colDelta);
        }
        hashCode() {
            return Immutable__default["default"].hash(this.rowDelta) - Immutable__default["default"].hash(this.colDelta);
        }
        move(other) {
            return other.move(this);
        }
    }
    class Pos {
        row;
        col;
        constructor(row, col) {
            this.row = row;
            this.col = col;
            if (!(this instanceof Pos))
                return new Pos(row, col);
        }
        equals(other) {
            return (other instanceof Pos && this.row === other.row && this.col === other.col);
        }
        hashCode() {
            return Immutable__default["default"].hash(this.row) - Immutable__default["default"].hash(this.col);
        }
        move(other) {
            return new Pos(this.row + other.rowDelta, this.col + other.colDelta);
        }
        diff(other) {
            return new Move(this.row - other.row, this.col - other.col);
        }
    }

    class BlockI extends BlockBase {
        static makeCells(state, base) {
            const cellExists = [
                [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ],
                [
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                ],
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                ],
                [
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                ],
            ];
            const cells = Immutable__default["default"].Set().withMutations((mutable) => {
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 4; j++) {
                        if (cellExists[state][i][j]) {
                            mutable.add(base.move(new Move(i, j)));
                        }
                    }
                }
            });
            return cells;
        }
        constructor(state, base) {
            super(state, base, "I", BlockI.makeCells(state, base));
        }
        with({ state, base }) {
            return new BlockI(state, base);
        }
    }

    class BlockJ extends BlockBase {
        static makeCells(state, base) {
            const cellExists = [
                [
                    [1, 0, 0],
                    [1, 1, 1],
                    [0, 0, 0],
                ],
                [
                    [0, 1, 0],
                    [0, 1, 0],
                    [1, 1, 0],
                ],
                [
                    [0, 0, 0],
                    [1, 1, 1],
                    [0, 0, 1],
                ],
                [
                    [0, 1, 1],
                    [0, 1, 0],
                    [0, 1, 0],
                ],
            ];
            const cells = Immutable__default["default"].Set().withMutations((mutable) => {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (cellExists[state][i][j]) {
                            mutable.add(base.move(new Move(i, j)));
                        }
                    }
                }
            });
            return cells;
        }
        constructor(state, base) {
            super(state, base, "J", BlockJ.makeCells(state, base));
        }
        with({ state, base }) {
            return new BlockJ(state, base);
        }
    }

    class BlockL extends BlockBase {
        static makeCells(state, base) {
            const cellExists = [
                [
                    [0, 0, 1],
                    [1, 1, 1],
                    [0, 0, 0],
                ],
                [
                    [1, 1, 0],
                    [0, 1, 0],
                    [0, 1, 0],
                ],
                [
                    [0, 0, 0],
                    [1, 1, 1],
                    [1, 0, 0],
                ],
                [
                    [0, 1, 0],
                    [0, 1, 0],
                    [0, 1, 1],
                ],
            ];
            const cells = Immutable__default["default"].Set().withMutations((mutable) => {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (cellExists[state][i][j]) {
                            mutable.add(base.move(new Move(i, j)));
                        }
                    }
                }
            });
            return cells;
        }
        constructor(state, base) {
            super(state, base, "L", BlockL.makeCells(state, base));
        }
        with({ state, base }) {
            return new BlockL(state, base);
        }
    }

    class BlockO extends BlockBase {
        static makeCells(state, base) {
            const cellExists = [
                [
                    [1, 1],
                    [1, 1],
                ],
                [
                    [1, 1],
                    [1, 1],
                ],
                [
                    [1, 1],
                    [1, 1],
                ],
                [
                    [1, 1],
                    [1, 1],
                ],
            ];
            const cells = Immutable__default["default"].Set().withMutations((mutable) => {
                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < 2; j++) {
                        if (cellExists[state][i][j]) {
                            mutable.add(base.move(new Move(i, j)));
                        }
                    }
                }
            });
            return cells;
        }
        constructor(state, base) {
            super(state, base, "O", BlockO.makeCells(state, base));
        }
        with({ state, base }) {
            return new BlockO(state, base);
        }
    }

    class BlockS extends BlockBase {
        static makeCells(state, base) {
            const cellExists = [
                [
                    [0, 1, 1],
                    [1, 1, 0],
                    [0, 0, 0],
                ],
                [
                    [1, 0, 0],
                    [1, 1, 0],
                    [0, 1, 0],
                ],
                [
                    [0, 0, 0],
                    [0, 1, 1],
                    [1, 1, 0],
                ],
                [
                    [0, 1, 0],
                    [0, 1, 1],
                    [0, 0, 1],
                ],
            ];
            const cells = Immutable__default["default"].Set().withMutations((mutable) => {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (cellExists[state][i][j]) {
                            mutable.add(base.move(new Move(i, j)));
                        }
                    }
                }
            });
            return cells;
        }
        constructor(state, base) {
            super(state, base, "S", BlockS.makeCells(state, base));
        }
        with({ state, base }) {
            return new BlockS(state, base);
        }
    }

    class BlockT extends BlockBase {
        static makeCells(state, base) {
            const cellExists = [
                [
                    [0, 1, 0],
                    [1, 1, 1],
                    [0, 0, 0],
                ],
                [
                    [0, 1, 0],
                    [1, 1, 0],
                    [0, 1, 0],
                ],
                [
                    [0, 0, 0],
                    [1, 1, 1],
                    [0, 1, 0],
                ],
                [
                    [0, 1, 0],
                    [0, 1, 1],
                    [0, 1, 0],
                ],
            ];
            const cells = Immutable__default["default"].Set().withMutations((mutable) => {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (cellExists[state][i][j]) {
                            mutable.add(base.move(new Move(i, j)));
                        }
                    }
                }
            });
            return cells;
        }
        constructor(state, base) {
            super(state, base, "T", BlockT.makeCells(state, base));
        }
        with({ state, base }) {
            return new BlockT(state, base);
        }
    }

    class BlockZ extends BlockBase {
        static makeCells(state, base) {
            const cellExists = [
                [
                    [1, 1, 0],
                    [0, 1, 1],
                    [0, 0, 0],
                ],
                [
                    [0, 1, 0],
                    [1, 1, 0],
                    [1, 0, 0],
                ],
                [
                    [0, 0, 0],
                    [1, 1, 0],
                    [0, 1, 1],
                ],
                [
                    [0, 0, 1],
                    [0, 1, 1],
                    [0, 1, 0],
                ],
            ];
            const cells = Immutable__default["default"].Set().withMutations((mutable) => {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (cellExists[state][i][j]) {
                            mutable.add(base.move(new Move(i, j)));
                        }
                    }
                }
            });
            return cells;
        }
        constructor(state, base) {
            super(state, base, "Z", BlockZ.makeCells(state, base));
        }
        with({ state, base }) {
            return new BlockZ(state, base);
        }
    }

    class Board {
        rows;
        columns;
        constructor(rows, columns) {
            this.rows = rows;
            this.columns = columns;
            this.cells = Immutable__default["default"].Set().withMutations((mutable) => {
                for (let i = 0; i < rows; i++) {
                    for (let j = 0; j < columns; j++) {
                        mutable.add(new Pos(i, j));
                    }
                }
            });
        }
        cells;
        union(other) {
            return CellSet(this.cells.union(other.cells));
        }
        intersect(other) {
            return CellSet(this.cells.intersect(other.cells));
        }
        remove(other) {
            return CellSet(this.cells.subtract(other.cells));
        }
        isEmpty() {
            return this.cells.isEmpty();
        }
    }

    function Tetris(config, random) {
        return new TetrisImpl(config, random);
    }
    class TetrisImpl {
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
                const line = Immutable__default["default"].Set().withMutations((mutable) => {
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

    class DebugScene {
        tetris = Tetris({
            columns: 10,
            rows: 20,
        }, new Random(1));
        constructor() { }
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
                updateByKey("ArrowUp", () => this.tetris.operateHold());
            }
            if (input.key.down("Space")) {
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
                }
            }
            return this;
        }
        draw() {
            const ctx = $("#main-canvas")[0].getContext("2d");
            const canvas = {
                cellSize: 20,
                context: ctx,
                height: 480,
                width: 640,
                originX: 20,
                originY: 20,
            };
            clearCanvas(canvas);
            drawBoard(canvas, this.tetris.state.board);
            drawCellSet(canvas, this.tetris.state.remainingCells, {
                fillColor: "black",
                padding: 1,
            });
            for (const [_, cells] of this.tetris.getRemovedLines()) {
                drawCellSet(canvas, cells, {
                    fillColor: "red",
                    padding: 1,
                });
            }
            const ghost = this.tetris.getGhost();
            if (ghost != null && this.tetris.state.tag === "WaitDown")
                drawCellSet(canvas, ghost, {
                    fillColor: "gray",
                    padding: 1,
                });
            if (this.tetris.state.currentBlock != null)
                drawCellSet(canvas, this.tetris.state.currentBlock, {
                    fillColor: "orange",
                    padding: 1,
                });
        }
    }
    function clearCanvas({ context, originX, originY, width, height }) {
        context.clearRect(originX, originY, width, height);
    }
    function drawCell({ context, cellSize, originX, originY }, { col, row }, { padding = 0, boarder = 1, fillColor, strokeColor }) {
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
    function drawCellSet(canvas, { cells }, style) {
        cells.forEach((cell) => {
            drawCell(canvas, cell, style);
        });
    }
    function drawBoard(canvas, board) {
        const { context: ctx, cellSize } = canvas;
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 1;
        ctx.strokeRect(cellSize - 1, cellSize - 1, cellSize * board.columns + 2, cellSize * board.rows + 2);
    }

    $(() => {
        console.log("load");
        new Game(new DebugScene()).start();
    });

}));
//# sourceMappingURL=main.bundle.js.map
