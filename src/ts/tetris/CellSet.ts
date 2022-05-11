import { Pos } from "./geometry";
import immutable from "immutable";

export interface CellSet {
  readonly cells: immutable.Set<Pos>;
  union(other: CellSet): CellSet;
  intersect(other: CellSet): CellSet;
  remove(other: CellSet): CellSet;
}
export function CellSet(cells: immutable.Set<Pos>): CellSet {
  return new (class implements CellSet {
    constructor(readonly cells: immutable.Set<Pos>) {}
    union(other: CellSet): CellSet {
      return CellSet(this.cells.union(other.cells));
    }
    intersect(other: CellSet): CellSet {
      return CellSet(this.cells.intersect(other.cells));
    }
    remove(other: CellSet): CellSet {
      return CellSet(this.cells.subtract(other.cells));
    }
  })(cells);
}
