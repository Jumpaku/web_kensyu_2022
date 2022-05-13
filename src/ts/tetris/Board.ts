import Immutable from "../dependencies/immutable";
import { CellSet } from "./CellSet";
import { Pos } from "./gridGeometry";

export class Board implements CellSet {
  constructor(readonly rows: number, readonly columns: number) {
    this.cells = Immutable.Set<Pos>().withMutations((mutable) => {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          mutable.add(new Pos(i, j));
        }
      }
    });
  }
  cells: Immutable.Set<Pos>;
  union(other: CellSet): CellSet {
    return CellSet(this.cells.union(other.cells));
  }
  intersect(other: CellSet): CellSet {
    return CellSet(this.cells.intersect(other.cells));
  }
  remove(other: CellSet): CellSet {
    return CellSet(this.cells.subtract(other.cells));
  }
  isEmpty(): boolean {
    return this.cells.isEmpty();
  }
}
