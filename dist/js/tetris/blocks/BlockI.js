import { BlockBase } from "./BlockBase";
import { Move } from "../geometry";
import immutable from "immutable";
export class BlockI extends BlockBase {
    static makeCells(state, base) {
        const cellExists = [
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
            ],
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
            ],
        ];
        const cells = immutable.Set().withMutations((mutable) => {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (cellExists[state][i][j]) {
                        mutable.add(base.move(new Move(i, j)));
                    }
                }
            }
        });
        return cells;
    }
    constructor(state, base) {
        super(state, base, "I", BlockI.makeCells(state, base));
    }
    with({ state, base }) {
        return new BlockI(state, base);
    }
}
