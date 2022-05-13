import { Pos } from "./gridGeometry";
import Immutable from "../dependencies/immutable";

export interface CellSet {
  readonly cells: Immutable.Set<Pos>;
  union(other: CellSet): CellSet;
  intersect(other: CellSet): CellSet;
  remove(other: CellSet): CellSet;
  isEmpty(): boolean;
}

export function CellSet(cells?: Immutable.Set<Pos>): CellSet {
  if (cells == null) return CellSet(Immutable.Set<Pos>());
  return new (class implements CellSet {
    constructor(readonly cells: Immutable.Set<Pos>) {}
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
  })(cells);
}
