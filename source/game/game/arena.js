import * as Engine from "../../engine/engine.js";

class ArenaViewer extends Engine.Viewer {
    start() {
        this.transform = this.gameObject.getComponent("Transform");
        this.transform.scale.set(Engine.createVector(3000));
        this.setViewLayer(0);
    }

    display() {
        noStroke();
        fill(200, 150, 100);
        circle(this.transform.position.x, this.transform.position.y, this.transform.scale.x);
        fill(150, 108, 75);
        circle(this.transform.position.x, this.transform.position.y, 150);
    }
}

export function createArena() {
    let viewer = new ArenaViewer();
    return Engine.createGameObject(viewer);
}
