import { CellSet } from "../CellSet";
export class BlockBase extends CellSet {
    state;
    base;
    name;
    constructor(state, base, name, cells) {
        super(cells);
        this.state = state;
        this.base = base;
        this.name = name;
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
