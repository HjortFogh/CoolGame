import { Controller, Transform, Viewer } from "../engine/object.js";

export class EnemyViewer extends Viewer {
    start() {
        this.transform = this.gameObject.getComponent(Transform);
    }

    display() {
        fill(160, 80, 40);
        circle(this.transform.position.x, this.transform.position.y, 50);
    }
}

export class EnemyController extends Controller {
    start() {
        this.transform = this.gameObject.getComponent(Transform);
        let direction = random(TWO_PI);
        let distance = random(1000, 2500);
        this.transform.position.set(createVector(cos(direction) * distance, sin(direction) * distance));
    }

    update() {
        this.transform.position.add(createVector(random(-2, 2), random(-2, 2)));
    }
}
