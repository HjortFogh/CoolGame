import { Time } from "../time.js";
import { createPoint } from "../point.js";
import { Transform } from "../components/transform.js";

// TODO: Type checking

export class SceneManager {
    static hasEntered = false;

    static scenes = {};
    static activeScene = null;
    static activeSceneName = "";

    static isTransitioning = false;
    static activeTransition = null;

    static tick() {
        if (!this.hasEntered) throw `No active scene set`;

        this.activeScene.tick();

        if (this.isTransitioning) {
            this.activeTransition.tick();
            if (this.activeTransition.isDone()) this.isTransitioning = false;
        }
    }

    static registerScene(newScene, sceneName) {
        if (this.hasEntered) throw `'registerScene' cannot be called after 'setEntryScene'`;
        if (sceneName in this.scenes) throw `Scene with name: '${sceneName}' already registed`;

        this.scenes[sceneName] = newScene;
    }

    static setEntryScene(sceneName) {
        if (this.hasEntered) throw `'setEntryScene' can only be called once`;

        this.activeSceneName = sceneName;
        this.activeScene = this.scenes[sceneName];
        for (let key in this.scenes) this.scenes[key].initialize();
        this.activeScene.onEnter();

        this.hasEntered = true;
    }

    static changeScene(sceneName) {
        if (!(sceneName in this.scenes)) throw `No scene with name: '${sceneName}'`;
        if (sceneName == this.activeSceneName) return;

        this.activeScene.onExit();
        this.activeSceneName = sceneName;
        this.activeScene = this.scenes[sceneName];
        this.activeScene.onEnter();
    }

    static transition(newTransition, sceneName) {
        if (!(sceneName in this.scenes)) throw `No scene with name: '${sceneName}'`;

        if (this.isTransitioning) return;
        this.isTransitioning = true;

        this.activeTransition = newTransition;
        this.activeTransition.setSceneName(sceneName);
        this.activeTransition.start();
    }
}

class Camera {
    position = createPoint(0, 0);
    target = null;

    getPosition() {
        return createPoint(0, 0);
        // if (this.target === null) return createPoint(this.position.x - width / 2, this.position.x - height / 2);
        // throw "Um hello?";
        // return createPoint(this.target.getComponent(Transform));
    }

    isVisible(transform) {
        let cameraPos = this.getPosition();

        let xDist = width / 2 - cameraPos.x - transform.position.x;
        let yDist = height / 2 - cameraPos.y - transform.position.y;

        return !(abs(xDist) > width / 2 || abs(yDist) > height / 2);
    }
}

export class Scene {
    isInitialized = false;

    camera = new Camera();

    gameObjects = [];
    gamePrefabs = [];

    start() {}
    onEnter() {}
    onExit() {}
    background() {}
    overlay() {}

    initialize() {
        this.start();
        for (let gameObject of this.gameObjects) gameObject.initialize();
        this.isInitialized = true;
    }

    tick() {
        this.updateGameObjects();

        this.background();

        // Generate R-Tree
        // Collision detection

        push();

        let cameraPos = this.camera.getPosition();
        translate(cameraPos.x, cameraPos.y);

        this.displayGameObjects();

        pop();

        this.overlay();
    }

    //#region GameObjects

    updateGameObjects() {
        for (let i = this.gameObjects.length - 1; i >= 0; i--) {
            let gameObject = this.gameObjects[i];
            gameObject.update();
            if (gameObject.isDestroyed()) this.gameObjects.splice(i, 1);
        }
    }

    displayGameObjects() {
        let visibleObjects = this.gameObjects.filter((gameObject) => this.camera.isVisible(gameObject.getComponent(Transform)));

        for (let i = 0; i < 100; i++) {
            let completed = true;
            for (let gameObject of visibleObjects) {
                let isDone = gameObject.displayLayer(i);
                if (!isDone) completed = false;
            }
            if (completed) break;
        }
    }

    addGameObject(newGameObject) {
        this.gameObjects.push(newGameObject);
        if (this.isInitialized) newGameObject.initialize();
    }

    //#endregion

    //#region GamePrefabs

    bindGamePrefab(newGamePrefab, gamePrefabName = "") {
        newGamePrefab.setScene(this);
        this.gamePrefabs.push(newGamePrefab);
        if (gamePrefabName != "") this.gamePrefabRegister.set(gamePrefabName, newGamePrefab);
    }

    //#endregion
}

export class SceneTransition {
    duration = 0;
    oldSceneDuration = 0;
    timer = 0;
    sceneName = "";

    start() {}
    display(p) {}

    constructor(duration, oldSceneDuration = duration / 2) {
        this.duration = max(duration, 0);
        this.oldSceneDuration = max(min(this.duration, oldSceneDuration), 0);
        this.timer = 0;
    }

    isDone = () => this.timer >= this.duration;
    hasChanged = () => this.timer >= this.oldSceneDuration;
    setSceneName = (sceneName) => (this.sceneName = sceneName);

    tick() {
        this.timer += Time.deltaTime();
        if (this.timer >= this.oldSceneDuration) SceneManager.changeScene(this.sceneName);
        this.display(this.timer / this.duration);
    }
}
