import { Block, BlockName, BlockState } from "./Block";
import { Move, Pos } from "../geometry";
import immutable, { hash } from "immutable";
import { CellSet } from "../CellSet";

export abstract class BlockBase implements Block, immutable.ValueObject {
  constructor(
    readonly state: BlockState,
    readonly base: Pos,
    readonly name: BlockName,
    readonly cells: immutable.Set<Pos>
  ) {}
  equals(other: unknown): boolean {
    return (
      other instanceof BlockBase &&
      this.name === other.name &&
      this.state === other.state &&
      immutable.is(this.base, other.base) &&
      this.cells.equals(other.cells)
    );
  }
  hashCode(): number {
    return immutable.hash(this);
  }

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
