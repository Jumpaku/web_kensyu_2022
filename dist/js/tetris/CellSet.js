import Immutable from "../dependencies/immutable";
export class CellSet {
    constructor(cells) {
        this.cells = Immutable.Set(cells);
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
