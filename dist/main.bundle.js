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
            const c = new Chance(this.seed);
            return new Random(c.integer() - c.integer());
        }
    }

    class CellSet {
        constructor(cells) {
            this.cells = Immutable__default["default"].Set(cells);
        }
        cells;
        equals(other) {
            return this.cells.equals(other.cells);
        }
        union(other) {
            return new CellSet(this.cells.union(other.cells));
        }
        intersect(other) {
            return new CellSet(this.cells.intersect(other.cells));
        }
        remove(other) {
            return new CellSet(this.cells.subtract(other.cells));
        }
        has(pos) {
            return this.cells.has(pos);
        }
        isEmpty() {
            return this.cells.isEmpty();
        }
        toArray() {
            return this.cells.toArray();
        }
    }

    class BlockBase extends CellSet {
        state;
        base;
        name;
        constructor(state, base, name, cells) {
            super(cells);
            this.state = state;
            this.base = base;
            this.name = name;
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

    class Board extends CellSet {
        rows;
        columns;
        constructor(rows, columns) {
            super(Immutable__default["default"].Set().withMutations((mutable) => {
                for (let i = 0; i < rows; i++) {
                    for (let j = 0; j < columns; j++) {
                        mutable.add(new Pos(i, j));
                    }
                }
            }));
            this.rows = rows;
            this.columns = columns;
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
            let remaining = remainingCells.union(currentBlock ?? new CellSet());
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

    class ResultScene {
        removedLines;
        constructor(removedLines) {
            this.removedLines = removedLines;
            $("#removed-lines").val(removedLines);
            $("#result").show();
        }
        update(time, input) {
            if (input.key.down("Space")) {
                $("#result").hide();
                return new StartScene();
            }
            return this;
        }
        draw() { }
    }

    class PlayScene {
        config;
        tetris;
        prevDownTime = Number.NaN;
        removedLines = 0;
        constructor(config) {
            this.config = config;
            $("#play").show();
            this.tetris = Tetris({
                columns: config.columns,
                rows: config.rows,
            }, new Random(config.seed));
            const bgm = $("#bgm")[0];
            bgm.volume = bgm.volume * 0.5;
            bgm.currentTime = 0;
            bgm.play();
        }
        shouldUpdate(time, input) {
            return time - this.prevDownTime >= this.config.waitDownTimeSpan;
        }
        update(time, input) {
            this.updateCommon(time, input);
            switch (this.tetris.state.tag) {
                case "PrepareNext":
                    return this.updatePrepareNext(time, input);
                case "WaitDown":
                    return this.updateWaitDown(time, input);
                case "GameOver":
                    return this.updateGameOver(time, input);
            }
        }
        updateCommon(time, input) {
            this.prevDownTime = Number.isNaN(this.prevDownTime)
                ? time
                : this.prevDownTime;
            const bgm = $("#bgm")[0];
            if (bgm.ended) {
                bgm.currentTime = 0;
                bgm.play();
            }
        }
        updatePrepareNext(time, input) {
            if (!this.shouldUpdate(time, input))
                return this;
            const t = this.tetris.nextBlock();
            if (t.tag === "Err")
                console.log(t.message);
            else {
                this.prevDownTime = time;
                this.tetris = t.tetris;
                this.removedLines += t.removedLines.size;
            }
            return this;
        }
        updateWaitDown(time, input) {
            const _this = this;
            function updateByKey(keycode, operate) {
                if (input.key.down(keycode) === 0)
                    return;
                const result = operate();
                if (result.changed === false)
                    return;
                _this.tetris = result.tetris;
                const audio = $("#se-click")[0];
                audio.currentTime = 0;
                audio.play();
            }
            updateByKey("KeyA", () => this.tetris.operateRotate(false));
            updateByKey("KeyD", () => this.tetris.operateRotate(true));
            updateByKey("ArrowLeft", () => this.tetris.operateMove(false));
            updateByKey("ArrowRight", () => this.tetris.operateMove(true));
            updateByKey("ArrowDown", () => this.tetris.operateDrop());
            //updateByKey("ArrowUp", () => this.tetris.operateHold());
            if (!this.shouldUpdate(time, input))
                return this;
            const t = this.tetris.downBlock();
            if (t.tag === "Err")
                console.log(t.message);
            else {
                this.prevDownTime = time;
                this.tetris = t.tetris;
            }
            return this;
        }
        updateGameOver(time, input) {
            if (!this.shouldUpdate(time, input))
                return this;
            if (input.key.down("Space")) {
                const bgm = $("#bgm")[0];
                bgm.pause();
                $("#play").hide();
                return new ResultScene(this.removedLines);
            }
            return this;
        }
        draw() {
            const { board, currentBlock, remainingCells, tag } = this.tetris.state;
            const g = $("#main-canvas")[0].getContext("2d");
            // クリア
            g.clearRect(0, 0, 480, 640);
            const cellSize = 20;
            // 盤面
            const lineWidth = 5;
            const boardOriginX = 50;
            const boardOriginY = 50;
            g.lineWidth = lineWidth;
            g.strokeStyle = "black";
            g.strokeRect(boardOriginX - lineWidth, boardOriginY - lineWidth, cellSize * board.columns + 2 * lineWidth, cellSize * board.rows + 2 * lineWidth);
            // 残存ブロック
            for (const { col, row } of remainingCells.toArray()) {
                g.fillStyle = "black";
                g.fillRect(boardOriginX + cellSize * col + 1, boardOriginY + cellSize * row + 1, cellSize - 2, cellSize - 2);
            }
            // ゴーストブロック
            if (tag === "WaitDown") {
                const ghost = this.tetris.getGhost();
                for (const { col, row } of ghost.toArray()) {
                    g.fillStyle = " gray";
                    g.fillRect(boardOriginX + cellSize * col + 1, boardOriginY + cellSize * row + 1, cellSize - 2, cellSize - 2);
                }
            }
            // 現在のブロック
            if (currentBlock != null) {
                for (const { col, row } of currentBlock.toArray()) {
                    g.fillStyle = "orange";
                    g.fillRect(boardOriginX + cellSize * col + 1, boardOriginY + cellSize * row + 1, cellSize - 2, cellSize - 2);
                }
            }
            // 削除マス
            for (const [_, removedCells] of this.tetris.getRemovedLines()) {
                for (const { col, row } of removedCells.toArray()) {
                    g.fillStyle = "red";
                    g.fillRect(boardOriginX + cellSize * col + 1, boardOriginY + cellSize * row + 1, cellSize - 2, cellSize - 2);
                }
            }
            // 後続ブロック
            const blockQueue = this.tetris.getBlockQueue();
            const queueOriginX = 300;
            const queueOriginY = 50;
            for (let i = 0; i < 7; ++i) {
                const block = blockQueue[i];
                for (const { col, row } of block.toArray()) {
                    g.fillStyle = "black";
                    g.fillRect(queueOriginX + cellSize * col + 1, queueOriginY + i * 50 + cellSize * row + 1, cellSize - 2, cellSize - 2);
                }
            }
        }
    }

    class DebugScene extends PlayScene {
        constructor(config) {
            super({ ...config, waitDownTimeSpan: NaN });
        }
        shouldUpdate(time, input) {
            return input.key.down("Space") > 0;
        }
    }

    class StartScene {
        constructor() {
            $("#start").show();
        }
        update(time, input) {
            if (input.key.down("Space")) {
                $("#start").hide();
                return new PlayScene({
                    columns: 10,
                    rows: 20,
                    seed: Math.random(),
                    waitDownTimeSpan: 0.5,
                });
            }
            if (input.key.down("Escape")) {
                $("#start").hide();
                return new DebugScene({
                    columns: 10,
                    rows: 20,
                    seed: Math.random(),
                });
            }
            return this;
        }
        draw() {
            const g = $("#main-canvas")[0].getContext("2d");
            // クリア
            g.clearRect(0, 0, 480, 640);
            g.fillStyle = "black";
            g.fillText("Press Space Key!", 200, 200);
        }
    }

    $(() => {
        $("main > div").hide();
        new Game(new StartScene()).start();
    });

}));
//# sourceMappingURL=main.bundle.js.map
