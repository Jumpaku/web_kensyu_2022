import { CellSet } from "../CellSet";
import { Move } from "../gridGeometry";
import Immutable from "../../dependencies/immutable";

export type BlockName = "O" | "I" | "J" | "L" | "S" | "Z" | "T";
export type BlockState = 0 | 1 | 2 | 3;

export interface Block extends CellSet, Immutable.ValueObject {
  readonly name: BlockName;
  rotate(clockwise: boolean): Block;
  move(delta: Move): Block;
}
