import immutable from "immutable";
export class Deque {
    front;
    back;
    static balance(short, long) {
        let s = short;
        let l = long;
        const size = short.size + long.size;
        while (s.size * 2 < size - 1) {
            s.push(l.peek());
            l = l.pop();
        }
        return [s.reverse(), l.reverse()];
    }
    constructor(front = immutable.Stack(), back = immutable.Stack()) {
        this.front = front;
        this.back = back;
        this.size = front.size + back.size;
    }
    size;
    isEmpty() {
        return this.size === 0;
    }
    peekFront() {
        if (this.isEmpty())
            return undefined;
        if (this.size === 1 && this.front.isEmpty())
            return this.back.peek();
        return this.front.peek();
    }
    peekBack() {
        if (this.isEmpty())
            return undefined;
        if (this.size === 1 && this.back.isEmpty())
            return this.front.peek();
        return this.back.peek();
    }
    pushFront(value) {
        if (this.isEmpty())
            return new Deque(this.front.push(value), this.back);
        if (!this.back.isEmpty())
            return new Deque(this.front.push(value), this.back);
        const [b, f] = Deque.balance(this.back, this.front.push(value));
        return new Deque(f, b);
    }
    pushBack(value) {
        if (this.isEmpty())
            return new Deque(this.front, this.back.push(value));
        if (!this.front.isEmpty())
            return new Deque(this.front, this.back.push(value));
        const [f, b] = Deque.balance(this.front, this.back.push(value));
        return new Deque(f, b);
    }
    popFront() {
        if (this.isEmpty())
            return undefined;
        if (this.size === 1)
            return new Deque();
        if (this.front.size > 1)
            return new Deque(this.front.pop(), this.back);
        const [f, b] = Deque.balance(this.front.pop(), this.back);
        return new Deque(f, b);
    }
    popBack() {
        if (this.isEmpty())
            return undefined;
        if (this.size === 1)
            return new Deque();
        if (this.back.size > 1)
            return new Deque(this.front, this.back.pop());
        const [b, f] = Deque.balance(this.back.pop(), this.front);
        return new Deque(f, b);
    }
}
