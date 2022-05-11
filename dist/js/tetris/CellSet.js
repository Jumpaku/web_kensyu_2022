export function CellSet(cells) {
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
