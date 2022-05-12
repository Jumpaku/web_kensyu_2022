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
        let chance = new Chance(this.seed);
        return new Random(chance.integer() + chance.integer());
    }
}
