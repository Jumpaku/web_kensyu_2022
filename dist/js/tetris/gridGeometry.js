import Immutable from "../dependencies/immutable";
export class Move {
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
        return Immutable.hash(this.rowDelta) - Immutable.hash(this.colDelta);
    }
    move(other) {
        return other.move(this);
    }
}
export class Pos {
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
        return Immutable.hash(this.row) - Immutable.hash(this.col);
    }
    move(other) {
        return new Pos(this.row + other.rowDelta, this.col + other.colDelta);
    }
    diff(other) {
        return new Move(this.row - other.row, this.col - other.col);
    }
}
