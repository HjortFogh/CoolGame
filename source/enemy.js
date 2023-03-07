// Enemy components

import { Component, Model, Viewer, Controller, Transform } from "./components.js";

export class EnemyController extends Controller {
    start() {
        let distance = random(1000, 2000);
        let angle = random(TWO_PI);

        this.transform = this.gameObject.getComponent(Transform);
        this.transform.position = createVector(cos(angle) * distance, sin(angle) * distance);
    }

    update() {
        this.transform.position.add(createVector(random(-3, 3), random(-3, 3)));

        // let target = player.getComponent(Transform).position.copy();
        // target.sub(this.transform.position);
        // target.setMag(100 * dt);
        // this.transform.position.add(target);
    }
}

export class EnemyViewer extends Viewer {
    start() {
        this.transform = this.gameObject.getComponent(Transform);
    }

    display() {
        let pos = this.transform.position;
        fill(200, 50, 50);
        circle(pos.x, pos.y, 30);
    }
}
