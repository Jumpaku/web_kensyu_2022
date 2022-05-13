import { BlockBase } from "./BlockBase";
import { Move } from "../gridGeometry";
import Immutable from "../../dependencies/immutable";
export class BlockT extends BlockBase {
    static makeCells(state, base) {
        const cellExists = [
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0],
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [0, 1, 0],
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0],
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 1, 0],
            ],
        ];
        const cells = Immutable.Set().withMutations((mutable) => {
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
        super(state, base, "T", BlockT.makeCells(state, base));
    }
    with({ state, base }) {
        return new BlockT(state, base);
    }
}
