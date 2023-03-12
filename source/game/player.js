import { InputManager } from "../engine/input.js";
import { Controller, Transform, Viewer } from "../engine/object.js";
import { Time } from "../engine/time.js";

export class PlayerController extends Controller {
    start() {
        this.transform = this.gameObject.getComponent(Transform);
    }

    update() {
        let velocity = createVector(
            InputManager.getInput("d") - InputManager.getInput("a"),
            InputManager.getInput("s") - InputManager.getInput("w")
        );
        this.transform.position.add(velocity.setMag(300 * Time.deltaTime()));
        this.transform.rotation = atan2(mouseY - height / 2, mouseX - width / 2);
    }
}

export class PlayerViewer extends Viewer {
    start() {
        this.transform = this.gameObject.getComponent(Transform);
    }

    display() {
        let pos = this.transform.position;
        let rot = this.transform.rotation;

        let size = 25;

        let x1 = pos.x + cos(rot) * size * 1.5;
        let y1 = pos.y + sin(rot) * size * 1.5;
        let x2 = pos.x + cos(rot + TWO_PI / 3) * size;
        let y2 = pos.y + sin(rot + TWO_PI / 3) * size;
        let x3 = pos.x + cos(rot + (TWO_PI / 3) * 2) * size;
        let y3 = pos.y + sin(rot + (TWO_PI / 3) * 2) * size;

        fill(200, 140, 80);
        triangle(x1, y1, x2, y2, x3, y3);
    }
}
