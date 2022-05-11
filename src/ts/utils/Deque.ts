import immutable from "immutable";

export class Deque<T extends immutable.ValueObject> {
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
    return this.front.isEmpty() ? this.back.peek() : this.front.peek();
  }
  peekBack(): T | undefined {
    return this.back.isEmpty() ? this.front.peek() : this.back.peek();
  }
  pushFront(value: T): Deque<T> {
    return new Deque(this.front.push(value), this.back);
  }
  pushBack(value: T): Deque<T> {
    return new Deque(this.front, this.back.push(value));
  }
  popFront(): Deque<T> {
    if (this.size <= 1) return new Deque<T>();
    let f = this.front.pop();
    let b = this.back;
    if (f.isEmpty()) {
      while (b.size * 2 < this.size) {
        f.push(b.peek()!);
        b = b.pop();
      }
    }
    return new Deque<T>(b.reverse(), f.reverse());
  }
  popBack(): Deque<T> {
    if (this.size <= 1) return new Deque<T>();
    let f = this.front;
    let b = this.back.pop();
    if (b.isEmpty()) {
      while (f.size * 2 < this.size) {
        b.push(f.peek()!);
        f = f.pop();
      }
    }
    return new Deque<T>(b.reverse(), f.reverse());
  }
}
