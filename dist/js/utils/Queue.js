import immutable from "immutable";
export class Deque {
    front;
    back;
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
        return this.front.isEmpty() ? this.back.peek() : this.front.peek();
    }
    peekBack() {
        return this.back.isEmpty() ? this.front.peek() : this.back.peek();
    }
    pushFront(value) {
        return new Deque(this.front.push(value), this.back);
    }
    pushBack(value) {
        return new Deque(this.front, this.back.push(value));
    }
    popFront() {
        if (this.size <= 1)
            return new Deque();
        let f = this.front.pop();
        let b = this.back;
        if (f.isEmpty()) {
            while (b.size * 2 < this.size) {
                f.push(b.peek());
                b = b.pop();
            }
        }
        return new Deque(b.reverse(), f.reverse());
    }
    popBack() {
        if (this.size <= 1)
            return new Deque();
        let f = this.front;
        let b = this.back.pop();
        if (b.isEmpty()) {
            while (f.size * 2 < this.size) {
                b.push(f.peek());
                f = f.pop();
            }
        }
        return new Deque(b.reverse(), f.reverse());
    }
}
