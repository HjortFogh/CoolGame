// Player components

import { Controller, Viewer, Transform } from "./components.js";
import { GameObject } from "./game_object.js";
import { getInput } from "./input.js";

export function createPlayer() {
    let player = new GameObject();
    player.addComponent(new PlayerController());
    player.addComponent(new PlayerViewer());
    return player;
}

class PlayerController extends Controller {
    start() {
        this.transform = this.gameObject.getComponent(Transform);
    }

    update() {
        let velocity = createVector(getInput("d") - getInput("a"), getInput("s") - getInput("w"));
        this.transform.position.add(velocity.setMag(300 * deltaTime));
        this.transform.rotation = atan2(mouseY - height / 2, mouseX - width / 2);

        // gameScene.setCameraPosition(createVector(-this.transform.position.x, -this.transform.position.y));
    }
}

class PlayerViewer extends Viewer {
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

        fill(80, 140, 200);
        triangle(x1, y1, x2, y2, x3, y3);
    }
}
