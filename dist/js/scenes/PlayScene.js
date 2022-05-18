import { Tetris } from "../tetris/Tetris";
import { Random } from "../utils/Random";
import { ResultScene } from "./ResultScene";
export class PlayScene {
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
        bgm.loop = true;
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
        updateByKey("ArrowUp", () => this.tetris.operateHold());
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
        const { board, currentBlock, remainingCells, heldBlock, tag } = this.tetris.state;
        const g = $("#main-canvas")[0].getContext("2d");
        // クリア
        g.clearRect(0, 0, 480, 640);
        const cellSize = 20;
        // 盤面
        const lineWidth = 5;
        const boardOriginX = 140;
        const boardOriginY = 100;
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
        // ホールドブロック
        const holdOriginX = -20;
        const holdOriginY = 50;
        if (heldBlock != null) {
            for (const { col, row } of heldBlock.toArray()) {
                g.fillStyle = "black";
                g.fillRect(holdOriginX + cellSize * col + 1, holdOriginY + cellSize * row + 1, cellSize - 2, cellSize - 2);
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
