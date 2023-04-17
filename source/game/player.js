import * as Engine from "../engine/engine.js";
import { createPoint } from "../engine/point";

class PlayerController extends Engine.Controller {
    start() {
        this.transform = this.gameObject.getComponent(Engine.Transform);
    }

    update() {
        let velocity = createPoint(Engine.Input.getInput("d") - Engine.Input.getInput("a"), Engine.Input.getInput("w") - Engine.Input.getInput("s"));
        this.transform.position.x += velocity.x;
        this.transform.position.y += velocity.y;
    }
}

class PlayerViewer extends Engine.Viewer {
    start() {
        this.transform = this.gameObject.getComponent(Engine.Transform);
    }

    display() {
        circle(this.transform.position.x, this.transform.position.y, 50);
    }
}

export function createPlayer() {
    return Engine.createGameObject(new PlayerController(), new PlayerViewer());
}
