import Immutable from "../dependencies/immutable";
import { CellSet } from "./CellSet";
import { Pos } from "./gridGeometry";
export class Board extends CellSet {
    rows;
    columns;
    constructor(rows, columns) {
        super(Immutable.Set().withMutations((mutable) => {
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
