import * as Collections from "typescript-collections";

export class Move {
  constructor(readonly deltaX: number, readonly deltaY: number) {}
  move(other: Pos): Pos {
    return other.move(this);
  }
  toString() {
    return Collections.util.makeString(this);
  }
}
export class Pos {
  constructor(readonly x: number, readonly y: number) {}
  move(other: Move): Pos {
    return new Pos(this.x + other.deltaX, this.y + other.deltaY);
  }
  diff(other: Pos): Move {
    return new Move(this.x - other.x, this.y - other.y);
  }
  toString() {
    return Collections.util.makeString(this);
  }
}
