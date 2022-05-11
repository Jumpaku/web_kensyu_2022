import immutable from "immutable";
import { CellSet } from "../CellSet";
export class BlockBase {
    state;
    base;
    name;
    cells;
    constructor(state, base, name, cells) {
        this.state = state;
        this.base = base;
        this.name = name;
        this.cells = cells;
    }
    equals(other) {
        return (other instanceof BlockBase &&
            this.name === other.name &&
            this.state === other.state &&
            immutable.is(this.base, other.base) &&
            this.cells.equals(other.cells));
    }
    hashCode() {
        return immutable.hash(this);
    }
    union(other) {
        return CellSet(this.cells.union(other.cells));
    }
    intersect(other) {
        return CellSet(this.cells.intersect(other.cells));
    }
    remove(other) {
        return CellSet(this.cells.subtract(other.cells));
    }
    isEmpty() {
        return this.cells.isEmpty();
    }
    rotate(clockwise) {
        return clockwise
            ? this.with({
                state: ((this.state + 3) % 4),
                base: this.base,
            })
            : this.with({
                state: ((this.state + 1) % 4),
                base: this.base,
            });
    }
    move(delta) {
        return this.with({
            state: this.state,
            base: this.base.move(delta),
        });
    }
}
