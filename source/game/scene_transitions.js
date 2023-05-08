import * as Engine from "../engine/engine.js";

export class SliderTransition extends Engine.SceneTransition {
    start() {}

    display(p) {
        noStroke();
        if (!this.hasChanged()) {
            fill(0);
            rect(0, 0, width * p * 2, height);
        } else {
            fill(0, (2 - p * 2) * 255);
            rect(0, 0, width, height);
        }
    }
}

export class DeathTransition extends Engine.SceneTransition {
    display(p) {
        noStroke();
        fill(70, 255 * p ** 5);
        rect(0, 0, width, height);
    }
}
