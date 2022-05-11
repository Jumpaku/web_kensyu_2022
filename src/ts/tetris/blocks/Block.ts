import { CellSet } from "../CellSet";
import { Move } from "../geometry";

export type BlockName = "O" | "I" | "J" | "L" | "S" | "Z" | "T";
export type BlockState = 0 | 1 | 2 | 3;
import immutable from "immutable";

export interface Block extends CellSet, immutable.ValueObject {
  readonly name: BlockName;
  rotate(clockwise: boolean): Block;
  move(delta: Move): Block;
}
