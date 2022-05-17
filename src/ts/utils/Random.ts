import Chance from "../dependencies/chance";

export class Random {
  constructor(readonly seed: number) {}
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    return new Chance(this.seed).shuffle(result);
  }
  next(): Random {
    const c = new Chance(this.seed);
    return new Random(c.integer() - c.integer());
  }
}
