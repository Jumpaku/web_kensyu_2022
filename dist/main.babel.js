import "core-js/modules/web.dom-collections.iterator.js";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class KeyInput {
  constructor() {
    _defineProperty(this, "downCount", new Map());

    _defineProperty(this, "upCount", new Map());

    window.addEventListener("keydown", e => {
      var _this$downCount$get;

      const prevCount = (_this$downCount$get = this.downCount.get(e.code)) !== null && _this$downCount$get !== void 0 ? _this$downCount$get : 0;
      this.downCount.set(e.code, prevCount + 1);
    });
    window.addEventListener("keyup", e => {
      var _this$upCount$get;

      const prevCount = (_this$upCount$get = this.upCount.get(e.code)) !== null && _this$upCount$get !== void 0 ? _this$upCount$get : 0;
      this.upCount.set(e.code, prevCount + 1);
    });
  }

  reset() {
    this.downCount = new Map();
    this.upCount = new Map();
  }

  down(code) {
    var _this$downCount$get2;

    return (_this$downCount$get2 = this.downCount.get(code)) !== null && _this$downCount$get2 !== void 0 ? _this$downCount$get2 : 0;
  }

  up(code) {
    var _this$upCount$get2;

    return (_this$upCount$get2 = this.upCount.get(code)) !== null && _this$upCount$get2 !== void 0 ? _this$upCount$get2 : 0;
  }

}

class Game {
  constructor(initialScene) {
    _defineProperty(this, "currentScene", void 0);

    _defineProperty(this, "input", void 0);

    this.performFrame = this.performFrame.bind(this);
    this.currentScene = initialScene;
    this.input = {
      key: new KeyInput()
    };
  }

  start() {
    window.requestAnimationFrame(this.performFrame);
  }

  performFrame(timeMicroseconds) {
    const timeSeconds = timeMicroseconds / 1000.0;
    this.currentScene = this.currentScene.update(timeSeconds, this.input);
    this.currentScene.draw();
    this.input.key.reset();
    window.requestAnimationFrame(this.performFrame);
  }

}

class EmptyScene {
  constructor() {
    _defineProperty(this, "currentTime", 0);

    _defineProperty(this, "currentKey", void 0);
  }

  update(time, input) {
    this.currentTime = time;
    this.currentKey = input.key;
    return this;
  }

  draw() {
    var _this$currentKey$down, _this$currentKey, _this$currentKey$up, _this$currentKey2;

    console.log("down", (_this$currentKey$down = (_this$currentKey = this.currentKey) === null || _this$currentKey === void 0 ? void 0 : _this$currentKey.down("KeyA")) !== null && _this$currentKey$down !== void 0 ? _this$currentKey$down : 0, "up", (_this$currentKey$up = (_this$currentKey2 = this.currentKey) === null || _this$currentKey2 === void 0 ? void 0 : _this$currentKey2.up("KeyA")) !== null && _this$currentKey$up !== void 0 ? _this$currentKey$up : 0);
  }

}

const main = () => {
  new Game(new EmptyScene()).start();
};

document.querySelector("body").onload = main;
export { main };
