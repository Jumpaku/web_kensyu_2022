import immutable from "immutable";

export class Deque<T extends immutable.ValueObject> {
  private static balance<T extends immutable.ValueObject>(
    short: immutable.Stack<T>,
    long: immutable.Stack<T>
  ): [immutable.Stack<T>, immutable.Stack<T>] {
    let s = short;
    let l = long;
    const size = short.size + long.size;
    while (s.size * 2 < size - 1) {
      s.push(l.peek()!);
      l = l.pop();
    }
    return [s.reverse(), l.reverse()];
  }
  constructor(
    readonly front: immutable.Stack<T> = immutable.Stack<T>(),
    readonly back: immutable.Stack<T> = immutable.Stack<T>()
  ) {
    this.size = front.size + back.size;
  }
  readonly size: number;
  isEmpty(): boolean {
    return this.size === 0;
  }

  peekFront(): T | undefined {
    if (this.isEmpty()) return undefined;
    if (this.size === 1 && this.front.isEmpty()) return this.back.peek();
    return this.front.peek();
  }
  peekBack(): T | undefined {
    if (this.isEmpty()) return undefined;
    if (this.size === 1 && this.back.isEmpty()) return this.front.peek();
    return this.back.peek();
  }
  pushFront(value: T): Deque<T> {
    if (this.isEmpty()) return new Deque(this.front.push(value), this.back);
    if (!this.back.isEmpty())
      return new Deque(this.front.push(value), this.back);
    const [b, f] = Deque.balance(this.back, this.front.push(value));
    return new Deque(f, b);
  }
  pushBack(value: T): Deque<T> {
    if (this.isEmpty()) return new Deque(this.front, this.back.push(value));
    if (!this.front.isEmpty())
      return new Deque(this.front, this.back.push(value));
    const [f, b] = Deque.balance(this.front, this.back.push(value));
    return new Deque(f, b);
  }
  popFront(): Deque<T> | undefined {
    if (this.isEmpty()) return undefined;
    if (this.size === 1) return new Deque<T>();
    if (this.front.size > 1) return new Deque<T>(this.front.pop(), this.back);
    const [f, b] = Deque.balance(this.front.pop(), this.back);
    return new Deque(f, b);
  }
  popBack(): Deque<T> | undefined {
    if (this.isEmpty()) return undefined;
    if (this.size === 1) return new Deque<T>();
    if (this.back.size > 1) return new Deque<T>(this.front, this.back.pop());
    const [b, f] = Deque.balance(this.back.pop(), this.front);
    return new Deque(f, b);
  }
}
