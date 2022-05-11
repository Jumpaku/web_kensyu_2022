import { Chance } from "chance";
export class Random {
    seed;
    constructor(seed) {
        this.seed = seed;
    }
    shuffle(array) {
        const result = [...array];
        return new Chance(this.seed).shuffle(result);
    }
    next() {
        return new Random(new Chance(this.seed).integer());
    }
}
