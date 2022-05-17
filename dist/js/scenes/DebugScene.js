import { PlayScene } from "./PlayScene";
export class DebugScene extends PlayScene {
    constructor(config) {
        super({ ...config, waitDownTimeSpan: NaN });
    }
    shouldUpdate(time, input) {
        return input.key.down("Space") > 0;
    }
}
