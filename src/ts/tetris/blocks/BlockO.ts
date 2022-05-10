import * as Collections from "typescript-collections";
import { Block, BlockState } from "./Block";
import { BlockBase } from "./BlockBase";
import { Move, Pos } from "./geometry";

export class BlockO extends BlockBase {
  private static makeCells(state: BlockState, base: Pos) {
    const cellExists = [
      [
        [1, 1],
        [1, 1],
      ],
      [
        [1, 1],
        [1, 1],
      ],
      [
        [1, 1],
        [1, 1],
      ],
      [
        [1, 1],
        [1, 1],
      ],
    ];
    const cells = new Collections.Set<Pos>();
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        if (cellExists[state]![i]![j]) {
          cells.add(base.move(new Move(i, j)));
        }
      }
    }
    return cells;
  }

  constructor(state: BlockState, base: Pos) {
    super(state, base, "O", BlockO.makeCells(state, base));
  }
  protected with({ state, base }: { state: BlockState; base: Pos }): Block {
    return new BlockO(state, base);
  }
}
