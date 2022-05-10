export class EmptyScene {
    currentTime = 0;
    currentKey;
    update(time, input) {
        this.currentTime = time;
        this.currentKey = input.key;
        return this;
    }
    draw() {
        console.log("down", this.currentKey?.getDownCount("KeyA") ?? 0, "up", this.currentKey?.getUpCount("KeyA") ?? 0);
    }
}
