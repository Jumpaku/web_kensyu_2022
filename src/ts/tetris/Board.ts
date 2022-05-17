import Immutable from "../dependencies/immutable";
import { CellSet } from "./CellSet";
import { Pos } from "./gridGeometry";

export class Board extends CellSet {
  constructor(readonly rows: number, readonly columns: number) {
    super(
      Immutable.Set<Pos>().withMutations((mutable) => {
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            mutable.add(new Pos(i, j));
          }
        }
      })
    );
  }
}
