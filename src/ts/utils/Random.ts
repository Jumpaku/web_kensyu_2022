import { Chance } from "chance";

export class Random {
  constructor(readonly seed: number) {}
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    return new Chance(this.seed).shuffle(result);
  }
  next(): Random {
    return new Random(new Chance(this.seed).integer());
  }
}
