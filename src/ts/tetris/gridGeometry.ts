import immutable from "immutable";

export class Move implements immutable.ValueObject {
  static down(): Move {
    return new Move(1, 0);
  }
  static right(): Move {
    return new Move(0, 1);
  }
  static left(): Move {
    return new Move(0, -1);
  }
  constructor(readonly rowDelta: number, readonly colDelta: number) {
    if (!(this instanceof Move)) return new Move(rowDelta, colDelta);
  }
  equals(other: unknown): boolean {
    return (
      other instanceof Move &&
      this.rowDelta === other.rowDelta &&
      this.colDelta === other.colDelta
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
  constructor(readonly row: number, readonly col: number) {
    if (!(this instanceof Pos)) return new Pos(row, col);
  }
  equals(other: unknown): boolean {
    return (
      other instanceof Pos && this.row === other.row && this.col === other.col
    );
  }
  hashCode(): number {
    return immutable.hash(this);
  }
  move(other: Move): Pos {
    return new Pos(this.row + other.rowDelta, this.col + other.colDelta);
  }
  diff(other: Pos): Move {
    return new Move(this.row - other.row, this.col - other.col);
  }
}
