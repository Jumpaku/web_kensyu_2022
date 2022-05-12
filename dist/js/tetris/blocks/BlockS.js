import { BlockBase } from "./BlockBase";
import { Move } from "../gridGeometry";
import immutable from "immutable";
export class BlockS extends BlockBase {
    static makeCells(state, base) {
        const cellExists = [
            [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0],
            ],
            [
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 0],
            ],
            [
                [0, 0, 0],
                [0, 1, 1],
                [1, 1, 0],
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 0, 1],
            ],
        ];
        const cells = immutable.Set().withMutations((mutable) => {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (cellExists[state][i][j]) {
                        mutable.add(base.move(new Move(i, j)));
                    }
                }
            }
        });
        return cells;
    }
    constructor(state, base) {
        super(state, base, "S", BlockS.makeCells(state, base));
    }
    with({ state, base }) {
        return new BlockS(state, base);
    }
}
