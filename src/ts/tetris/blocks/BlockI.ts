import { Block, BlockState } from "./Block";
import { BlockBase } from "./BlockBase";
import { Move, Pos } from "../geometry";
import immutable from "immutable";

export class BlockI extends BlockBase {
  private static makeCells(state: BlockState, base: Pos) {
    const cellExists = [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ],
    ]!;
    const cells = immutable.Set<Pos>().withMutations((mutable) => {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (cellExists[state]![i]![j]) {
            mutable.add(base.move(new Move(i, j)));
          }
        }
      }
    });
    return cells;
  }

  constructor(state: BlockState, base: Pos) {
    super(state, base, "I", BlockI.makeCells(state, base));
  }
  protected with({ state, base }: { state: BlockState; base: Pos }): Block {
    return new BlockI(state, base);
  }
}
