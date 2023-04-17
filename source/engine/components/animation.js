import { Time } from "../time.js";
import { Model, Viewer } from "./component.js";
import { Transform } from "./transform.js";

export class AnimationTree extends Model {
    start() {}
}

export class Animator extends Viewer {
    start(sprites, duration, viewLayer = 0) {
        this.setViewLayer(viewLayer);
        this.transform = this.gameObject.getComponent(Transform);

        this.sprites = sprites;
        this.frameDuration = duration / sprites.length;

        this.frameTimer = 0;
        this.currentFrame = 0;
    }

    display() {
        this.frameTimer += Time.deltaTime();
        if (this.frameTimer >= this.frameDuration) {
            this.frameTimer = 0;
            this.currentFrame = (this.currentFrame + 1) % this.sprites.length;
        }
        this.sprites[this.currentFrame].display(this.transform.position.x, this.transform.position.y, 50, 50);
    }
}
