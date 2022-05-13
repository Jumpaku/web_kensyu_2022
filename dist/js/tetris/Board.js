import Immutable from "../dependencies/immutable";
import { CellSet } from "./CellSet";
import { Pos } from "./gridGeometry";
export class Board {
    rows;
    columns;
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.cells = Immutable.Set().withMutations((mutable) => {
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
