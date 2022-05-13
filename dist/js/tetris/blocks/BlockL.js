import { BlockBase } from "./BlockBase";
import { Move } from "../gridGeometry";
import Immutable from "../../dependencies/immutable";
export class BlockL extends BlockBase {
    static makeCells(state, base) {
        const cellExists = [
            [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0],
            ],
            [
                [1, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [1, 0, 0],
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1],
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
        super(state, base, "L", BlockL.makeCells(state, base));
    }
    with({ state, base }) {
        return new BlockL(state, base);
    }
}
