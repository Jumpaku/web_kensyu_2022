import immutable from "immutable";

export class Move implements immutable.ValueObject {
  constructor(readonly deltaX: number, readonly deltaY: number) {
    if (!(this instanceof Move)) return new Move(deltaX, deltaY);
  }
  equals(other: unknown): boolean {
    return (
      other instanceof Move &&
      this.deltaX === other.deltaX &&
      this.deltaY === other.deltaY
    );
  }
  hashCode(): number {
    return immutable.hash(this);
  }
  move(other: Pos): Pos {
    return other.move(this);
  }
}
export class Pos implements immutable.ValueObject {
  constructor(readonly x: number, readonly y: number) {
    if (!(this instanceof Pos)) return new Pos(x, y);
  }
  equals(other: unknown): boolean {
    return other instanceof Pos && this.x === other.x && this.y === other.y;
  }
  hashCode(): number {
    return immutable.hash(this);
  }
  move(other: Move): Pos {
    return new Pos(this.x + other.deltaX, this.y + other.deltaY);
  }
  diff(other: Pos): Move {
    return new Move(this.x - other.x, this.y - other.y);
  }
}
