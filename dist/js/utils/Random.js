import Chance from "../dependencies/chance";
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
        const c = new Chance(this.seed);
        return new Random(c.integer() - c.integer());
    }
}
