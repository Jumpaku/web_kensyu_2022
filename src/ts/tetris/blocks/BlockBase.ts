import * as Collections from "typescript-collections";
import { Block, BlockName, BlockState } from "./Block";
import { Move, Pos } from "./geometry";

export abstract class BlockBase implements Block {
  constructor(
    readonly state: BlockState,
    readonly base: Pos,
    readonly name: BlockName,
    readonly cells: Collections.Set<Pos>
  ) {}

  protected abstract with(src: { state: BlockState; base: Pos }): Block;

  rotate(clockwise: boolean): Block {
    return clockwise
      ? this.with({
          state: ((this.state + 3) % 4) as BlockState,
          base: this.base,
        })
      : this.with({
          state: ((this.state + 1) % 4) as BlockState,
          base: this.base,
        });
  }

  move(delta: Move): Block {
    return this.with({
      state: this.state,
      base: this.base.move(delta),
    });
  }
}
