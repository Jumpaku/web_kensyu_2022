import { BlockBase } from "./BlockBase";
import { Move } from "../geometry";
import immutable from "immutable";
export class BlockO extends BlockBase {
    static makeCells(state, base) {
        const cellExists = [
            [
                [1, 1],
                [1, 1],
            ],
            [
                [1, 1],
                [1, 1],
            ],
            [
                [1, 1],
                [1, 1],
            ],
            [
                [1, 1],
                [1, 1],
            ],
        ];
        const cells = immutable.Set().withMutations((mutable) => {
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    if (cellExists[state][i][j]) {
                        mutable.add(base.move(new Move(i, j)));
                    }
                }
            }
        });
        return cells;
    }
    constructor(state, base) {
        super(state, base, "O", BlockO.makeCells(state, base));
    }
    with({ state, base }) {
        return new BlockO(state, base);
    }
}
