// Scene

import { GameObject } from "./game_object.js";
import { Transform } from "./components.js";

// TODO: make static
export class SceneManager {
    scenes;
    activeScene;

    constructor() {
        this.scenes = {};
        this.activeScene = "";
    }

    addScene(scene) {
        if (!(scene instanceof Scene)) throw `'${scene.constructor.name}' not of type 'Scene'`;
        this.scenes[scene.identifier] = scene;
    }

    setActiveScene(id) {
        if (!this.scenes.hasOwnProperty(id)) throw `Scene identifier '${id}' does not exist`;
        this.activeScene = id;
    }

    getActiveScene() {
        if (this.activeScene == "") throw `No active scene set`;
        return this.scenes[this.activeScene];
    }
}

export class Scene {
    identifier;
    gameObjects;
    cameraFocus;

    constructor(id) {
        this.identifier = id;
        this.gameObjects = [];
        this.cameraFocus = null;
    }

    addGameObject(obj) {
        if (!(obj instanceof GameObject)) throw `'${obj.constructor.name}' not of type 'GameObject'`;
        this.gameObjects.push(obj);
    }

    setCameraFocus(obj) {
        if (!(obj instanceof GameObject) && obj != null) throw `'${obj.constructor.name}' not of type 'GameObject'`;
        this.cameraFocus = obj.getComponent(Transform);
    }

    getCameraPos() {
        if (this.cameraFocus != null)
            return createVector(-this.cameraFocus.position.x + width / 2, -this.cameraFocus.position.y + height / 2);
        return createVector(width / 2, height / 2);
    }

    isVisible(obj) {
        let objectPos = obj.getComponent(Transform).position;
        let cameraPos = this.getCameraPos();

        let xDist = width / 2 - cameraPos.x - objectPos.x;
        let yDist = height / 2 - cameraPos.y - objectPos.y;

        if (abs(xDist) >= width / 2 || abs(yDist) >= height / 2) return false;

        return true;
    }

    tick() {
        this.gameObjects.forEach((obj) => obj.update());

        push();

        let cameraPos = this.getCameraPos();
        translate(cameraPos.x, cameraPos.y);

        circle(0, 0, 10);
        // rect(0, 0, width, height);

        this.gameObjects.forEach((obj) => {
            if (this.isVisible(obj)) obj.display();
        });

        pop();
    }
}
