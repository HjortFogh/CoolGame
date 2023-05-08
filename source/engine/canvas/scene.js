import { Time } from "../time.js";
import { createPoint, createRect } from "../point.js";
import { SpatialManager } from "../spatial_partitioning.js";

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

    static setScene(sceneName) {
        if (!(sceneName in this.scenes)) throw `No scene with name: '${sceneName}'`;
        if (sceneName == this.activeSceneName) return;

        this.activeScene.onExit();
        this.activeSceneName = sceneName;
        this.activeScene = this.scenes[sceneName];
        this.activeScene.onEnter();
    }

    static changeScene(sceneName) {
        if (SceneManager.isTransitioning) return;
        this.setScene(sceneName);
    }

    static transition(newTransition, sceneName) {
        if (!(sceneName in this.scenes)) throw `No scene with name: '${sceneName}'`;
        if (sceneName == this.activeSceneName) return;

        if (this.isTransitioning) return;
        this.isTransitioning = true;

        this.activeTransition = newTransition;
        this.activeTransition.setSceneName(sceneName);
        this.activeTransition.start();
    }
}

export class Camera {
    static position = createPoint(0, 0);
    static target = null;

    static getPosition() {
        if (this.target !== null) return createPoint(-this.target.position.x, -this.target.position.y);
        return this.position;
    }

    static isVisible(transform) {
        let cameraPos = this.getPosition();

        let xDist = -cameraPos.x - transform.position.x;
        let yDist = -cameraPos.y - transform.position.y;

        return !(abs(xDist) > width / 2 + transform.scale.x || abs(yDist) > height / 2 + transform.scale.y);
    }

    static setTarget(newTarget) {
        this.target = newTarget;
    }

    static setPosition(newPos) {
        this.position = newPos;
    }
}

export class Scene {
    isInitialized = false;
    isPaused = false;

    gameObjects = [];
    gamePrefabs = [];
    scripts = [];

    uiElements = [];

    start() {}
    onEnter() {}
    onExit() {}
    background() {}
    overlay() {}

    initialize() {
        this.start();
        for (let gameObject of this.gameObjects) gameObject.initialize();
        for (let uiElement of this.uiElements) uiElement.initialize();
        this.isInitialized = true;
        for (let script of this.scripts) script.initialize();
    }

    tick() {
        SpatialManager.generate(this.gameObjects);

        for (let script of this.scripts) script.update();
        if (!this.isPaused) this.updateGameObjects();
        for (let script of this.scripts) script.lateUpdate();
        for (let uiSurface of this.uiElements) uiSurface.update();

        this.background();

        push();

        let cameraPos = Camera.getPosition();
        translate(cameraPos.x + width / 2, cameraPos.y + height / 2);

        this.displayGameObjects();

        // SpatialManager.display();

        pop();

        for (let uiSurface of this.uiElements) uiSurface.display();
        this.overlay();
    }

    //#region Pausing

    pause() {
        this.isPaused = true;
    }

    unpause() {
        this.isPaused = false;
    }

    //#endregion

    //#region GameObjects

    updateGameObjects() {
        for (let i = this.gameObjects.length - 1; i >= 0; i--) {
            let gameObject = this.gameObjects[i];
            gameObject.update();
            if (gameObject.isDestroyed()) this.gameObjects.splice(i, 1);
        }
    }

    displayGameObjects() {
        let visibleObjects = this.gameObjects.filter((gameObject) => Camera.isVisible(gameObject.getComponent("Transform")));

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

    //#region Script

    bindScript(newScript) {
        newScript.setScene(this);
        this.scripts.push(newScript);
    }

    //#endregion

    //#region UI

    addUIElement(uiElement) {
        this.uiElements.push(uiElement);
        if (this.isInitialized) uiElement.initialize();
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
        if (this.timer >= this.oldSceneDuration) SceneManager.setScene(this.sceneName);
        this.display(this.timer / this.duration);
    }
}

export class Script {
    scene;

    start() {}
    update() {}
    lateUpdate() {}

    initialize() {
        if (this.scene === undefined) throw `Change this error message to something helpful`;
        this.start();
    }

    setScene(newScene) {
        this.scene = newScene;
    }
}
