import { Pos } from "./gridGeometry";
import Immutable from "../dependencies/immutable";

export class CellSet {
  constructor();
  constructor(cells: Pos[]);
  constructor(cells: Immutable.Set<Pos>);
  constructor(cells?: Pos[] | Immutable.Set<Pos>) {
    this.cells = Immutable.Set<Pos>(cells);
  }
  readonly cells: Immutable.Set<Pos>;
  equals(other: CellSet): boolean {
    return this.cells.equals(other.cells);
  }
  union(other: CellSet): CellSet {
    return new CellSet(this.cells.union(other.cells));
  }
  intersect(other: CellSet): CellSet {
    return new CellSet(this.cells.intersect(other.cells));
  }
  remove(other: CellSet): CellSet {
    return new CellSet(this.cells.subtract(other.cells));
  }
  has(pos: Pos): boolean {
    return this.cells.has(pos);
  }
  isEmpty(): boolean {
    return this.cells.isEmpty();
  }
  toArray(): Pos[] {
    return this.cells.toArray();
  }
}
