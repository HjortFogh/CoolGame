import { SceneTransition } from "../engine/scene.js";

export class CoolTransiton extends SceneTransition {
    start() {
        print("Start");
    }

    displayEntry(p) {
        fill(0);
        rect(0, 0, width * p, height);
    }

    displayClose(p) {
        fill(0);
        rect(0, 0, width * (1 - p), height);
    }
}
