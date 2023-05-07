// Exports:
// - SceneManager
// - Camera
// - Scene
// - SceneTransition
// - Script

import { Time } from "../time.js";
import { SpatialManager } from "../spatial_partitioning.js";
import { Vector, createVector } from "../vector.js";
import { GameObject, GamePrefab } from "./object.js";
import { Transform } from "../engine.js";

/**
 * Manages Scene(s) and SceneTransition(s)
 */
export class SceneManager {
    /**
     * @type {Object}
     * @static
     */
    static #scenes = {};
    /**
     * @type {Object}
     * @static
     */
    static #activeScene = null;
    /**
     * @type {String}
     * @static
     */
    static #activeSceneName = "";
    /**
     * @type {Object}
     * @static
     */
    static #activeTransition = null;

    /**
     * @type {Boolean}
     * @static
     */
    static #hasEntered = false;
    /**
     * @type {Boolean}
     * @static
     */
    static #isTransitioning = false;
    /**
     * @type {Boolean}
     * @static
     */
    static #hasWarnedNoEntry = false;

    /**
     * Ticks the active Scene and SceneTransition
     * @static
     */
    static tick() {
        if (!SceneManager.#hasEntered) {
            if (SceneManager.#hasWarnedNoEntry) {
                console.warn(`Entry Scene was not set`);
                SceneManager.#hasWarnedNoEntry = true;
            }
            return;
        }

        SceneManager.#activeScene.tick();

        if (SceneManager.#isTransitioning) {
            SceneManager.#activeTransition.tick();
            if (SceneManager.#activeTransition.isDone()) this.#isTransitioning = false;
        }
    }

    /**
     * @param {Scene} newScene Scene to register
     * @param {String} sceneName Name of Scene for later handling
     * @static
     */
    static registerScene(newScene, sceneName) {
        if (SceneManager.#hasEntered) {
            console.warn(`Cannot register Scene after entry`);
            return;
        }
        if (typeof sceneName != "string") {
            console.warn(`Scene name must be a string`);
            return;
        }
        if (!(newScene instanceof Scene)) {
            console.warn(`Registered scene must be an instance of Scene`);
            return;
        }

        if (sceneName in SceneManager.#scenes) {
            console.warn(`Scene with name: '${sceneName}' already registed`);
            return;
        }

        SceneManager.#scenes[sceneName] = newScene;
    }

    /**
     * Sets the entry Scene \
     * It is no longer possible to add new Scene(s) after entry
     * @param {String} sceneName Name of which Scene was registered
     * @static
     */
    static setEntryScene(sceneName) {
        if (SceneManager.#hasEntered) {
            console.warn(`Cannot set entry Scene multiple times`);
            return;
        }
        if (typeof sceneName != "string") {
            console.warn(`Scene name must be a string`);
            return;
        }

        SceneManager.#activeSceneName = sceneName;
        SceneManager.#activeScene = SceneManager.#scenes[sceneName];
        for (let key in SceneManager.#scenes) SceneManager.#scenes[key].initialize();
        SceneManager.#activeScene.onEnter();

        SceneManager.#hasEntered = true;
    }

    /**
     * Sets the active Scene
     * @param {String} sceneName Name of Scene set
     * @static
     */
    static setScene(sceneName) {
        if (typeof sceneName != "string") {
            console.warn(`Scene name must be a string`);
            return;
        }
        if (!(sceneName in SceneManager.#scenes)) {
            console.warn(`No scene with name: '${sceneName}'`);
            return;
        }
        if (sceneName == SceneManager.#activeSceneName) return;

        SceneManager.#activeScene.onExit();
        SceneManager.#activeSceneName = sceneName;
        SceneManager.#activeScene = SceneManager.#scenes[sceneName];
        SceneManager.#activeScene.onEnter();
    }

    /**
     * Changes the active Scene \
     * Scene does not change if a SceneTransition is in progress
     * @param {String} sceneName Name of Scene to change to
     * @static
     */
    static changeScene(sceneName) {
        if (SceneManager.#isTransitioning) return;
        SceneManager.setScene(sceneName);
    }

    /**
     * @returns {Scene}
     * @static
     */
    static getActiveScene() {
        return SceneManager.#activeScene;
    }

    /**
     * Transitions from the active Scene to a new Scene
     * @param {SceneTransition} newTransition SceneTransition instance to display
     * @param {String} sceneName Name of Scene to transition to
     */
    static transition(newTransition, sceneName) {
        if (typeof sceneName != "string") {
            console.warn(`Scene name must be a string`);
            return;
        }
        if (!(newTransition instanceof SceneTransition)) {
            console.warn(`Transition not an instance of SceneTransition`);
            return;
        }
        if (!(sceneName in SceneManager.#scenes)) {
            console.warn(`No scene with name: '${sceneName}'`);
            return;
        }
        if (SceneManager.#isTransitioning) return;
        if (sceneName == SceneManager.#activeSceneName) return;

        SceneManager.#isTransitioning = true;

        SceneManager.#activeTransition = newTransition;
        SceneManager.#activeTransition.setSceneName(sceneName);
        SceneManager.#activeTransition.start();
    }
}

/**
 * The Camera controls which area of the canvas will be displayed
 */
export class Camera {
    /**
     * @type {Vector}
     * @static
     */
    static #position = createVector(0, 0);
    /**
     * @type {Transform}
     * @static
     */
    static #target = null;

    /**
     * Returns the Camera's position
     * @returns {Vector}
     * @static
     */
    static getPosition() {
        if (Camera.#target !== null) return Vector.mult(Camera.#target.position, -1);
        return Camera.#position;
    }

    /**
     * Checks whether a Transform is visible on the canvas
     * @param {Transform} transform Transform of GameObject to check
     * @returns {Boolean}
     * @static
     */
    static isVisible(transform) {
        let cameraPos = Camera.getPosition();

        let xDist = -cameraPos.x - transform.position.x;
        let yDist = -cameraPos.y - transform.position.y;

        return !(abs(xDist) > width / 2 + transform.scale.x || abs(yDist) > height / 2 + transform.scale.y);
    }

    /**
     * Sets the target for the Camera \
     * The Camera's position will be equal to the target's
     * @param {Transform} newTarget
     */
    static setTarget(newTarget) {
        if (!(newTarget instanceof Transform)) {
            console.warn(`Cannot set Camera target to Object not instance of Transform`);
            return;
        }
        Camera.#target = newTarget;
    }

    /**
     * Sets the position of the Camera
     * @param {Vector} newPos Position
     */
    static setPosition(newPos) {
        Camera.#position = newPos;
    }
}

/**
 * A Scene contains multible GameObject(s), GamePrefab(s) and Script(s)
 */
export class Scene {
    /**
     * @type {Boolean}
     */
    #isInitialized = false;
    /**
     * @type {Boolean}
     */
    #isPaused = false;

    /**
     * @type {Array<GameObject>}
     */
    #gameObjects = [];
    /**
     * @type {Array<GamePrefab>}
     */
    #gamePrefabs = [];
    /**
     * @type {Array<Script>}
     */
    #scripts = [];
    /**
     * @type {Array<UIElement>}
     */
    #uiElements = [];

    //#region Virtual methods

    /**
     * Starts the child Scene
     * @virtual
     */
    start() {}
    /**
     * Gets called every time the Scene is set as active
     * @virtual
     */
    onEnter() {}
    /**
     * Gets called every time the Scene is set as dormant
     * @virtual
     */
    onExit() {}
    /**
     * Gets called every frame used to draw the background \
     * No transformations are set
     * @virtual
     */
    background() {}

    //#endregion

    //#region Initialize

    /**
     * Initialized the Scene which initializes all GameObject(s), Script(s), UIElement(s)
     */
    initialize() {
        if (this.#isInitialized) return;
        this.start();
        for (let script of this.#scripts) script.initialize(this);
        for (let gameObject of this.#gameObjects) gameObject.initialize();
        for (let uiElement of this.#uiElements) uiElement.initialize();
        this.#isInitialized = true;
    }

    //#endregion

    //#region Tick

    /**
     * Updates and displays all GameObject(s), Script(s), UIElement(s)
     */
    tick() {
        SpatialManager.generate(this.#gameObjects);

        for (let script of this.#scripts) script.update();
        if (!this.#isPaused) this.updateGameObjects();
        for (let script of this.#scripts) script.lateUpdate();
        for (let uiElement of this.#uiElements) uiElement.update();

        this.background();

        push();

        let cameraPos = Camera.getPosition();
        translate(cameraPos.x + width / 2, cameraPos.y + height / 2);

        this.displayGameObjects();

        pop();

        for (let uiElement of this.#uiElements) uiElement.display();
        this.overlay();
    }

    //#endregion

    //#region Pausing

    /**
     * Pauses the Scene meaning no GameObject(s) will be updated, but they will still be displayed
     */
    pause() {
        this.#isPaused = true;
    }

    /**
     * Unpauses the Scene
     */
    unpause() {
        this.#isPaused = false;
    }

    //#endregion

    //#region GameObjects

    /**
     * Updates all GameObject(s)
     */
    updateGameObjects() {
        for (let i = this.#gameObjects.length - 1; i >= 0; i--) {
            let gameObject = this.#gameObjects[i];
            gameObject.update();
            if (gameObject.isDestroyed()) this.#gameObjects.splice(i, 1);
        }
    }

    /**
     * Displays all GameObject(s)
     */
    displayGameObjects() {
        let visibleObjects = this.#gameObjects.filter((gameObject) => Camera.isVisible(gameObject.getComponent("Transform")));

        for (let i = 0; i < 50; i++) {
            let isDone = true;
            for (let gameObject of visibleObjects) {
                let isGameObjectDone = gameObject.displayLayer(i);
                if (!isGameObjectDone) isDone = false;
            }
            if (isDone) break;
        }
    }

    /**
     * Adds a new GameObject to the Scene
     * @param {GameObject} newGameObject
     */
    addGameObject(newGameObject) {
        if (!(newGameObject instanceof GameObject)) {
            console.warn("Cannot add Object not of type GameObject to Scene");
            return;
        }
        this.#gameObjects.push(newGameObject);
        if (this.#isInitialized) newGameObject.initialize();
    }

    //#endregion

    //#region GamePrefabs

    /**
     * Binds the GamePrefab to this Scene, meaning that the GamePrefab will spawn new GameObject(s) in this Scene
     * @param {GamePrefab} newGamePrefab
     */
    bindGamePrefab(newGamePrefab) {
        if (!(newGamePrefab instanceof GamePrefab)) {
            console.warn("Cannot add Object not of type GamePrefab to Scene");
            return;
        }
        newGamePrefab.setScene(this);
        this.#gamePrefabs.push(newGamePrefab);
    }

    //#endregion

    //#region Script

    /**
     * Adds a Script to this Scene
     * @param {Script} newScript
     */
    addScript(newScript) {
        if (!(newScript instanceof Script)) {
            console.warn("Cannot add Object not of type Script to Scene");
            return;
        }
        this.#scripts.push(newScript);
        if (this.#isInitialized) newScript.initialize(this);
    }

    //#endregion

    //#region UI

    /**
     * Adds a UIElement to the Scene
     * @param {UIElement} uiElement
     */
    addUIElement(uiElement) {
        this.#uiElements.push(uiElement);
        if (this.#isInitialized) uiElement.initialize();
    }

    //#endregion
}

/**
 * A SceneTransition is a animated transition between two Scene(s)
 */
export class SceneTransition {
    /**
     * @type {Float}
     */
    #duration = 0;
    /**
     * @type {Float}
     */
    #oldSceneDuration = 0;
    /**
     * @type {Float}
     */
    #timer = 0;
    /**
     * @type {String}
     */
    #sceneName = "";

    /**
     * Called when the SceneTransition is started
     * @virtual
     */
    start() {}
    /**
     * Called when the SceneTransition should be displayed
     * @param {Float} p Percentage done in the range 0..1
     * @virtual
     */
    display(p) {}

    /**
     * Creates a new SceneTransition
     * @param {Float} duration Total duration of the SceneTransition
     * @param {Float} oldSceneDuration Duration before the Scene is changed \
     * The default is half of the duration
     */
    constructor(duration, oldSceneDuration = duration / 2) {
        this.#duration = Math.max(duration, 0);
        this.#oldSceneDuration = Math.max(Math.min(this.#duration, oldSceneDuration), 0);
        this.#timer = 0;
    }

    /**
     * Checks if the SceneTransition is done
     * @returns {Boolean}
     */
    isDone() {
        return this.#timer >= this.#duration;
    }
    /**
     * Checks if the SceneTransition has changed the active Scene
     * @returns {Boolean}
     */
    hasChanged() {
        return this.#timer >= this.#oldSceneDuration;
    }
    /**
     * Checks if the SceneTransition is done
     * @returns {Boolean}
     */
    setSceneName(sceneName) {
        this.#sceneName = sceneName;
    }

    /**
     * Updates and displays the SceneTransition
     */
    tick() {
        this.#timer += Time.deltaTime();
        if (this.#timer >= this.#oldSceneDuration) SceneManager.setScene(this.#sceneName);
        this.display(this.#timer / this.#duration);
    }
}

/**
 * A Script can execute code without being bound by a GameObject
 */
export class Script {
    /**
     * @type {Scene}
     */
    #scene;

    /**
     * Gets called once when the Script is started
     * @virtual
     */
    start() {}
    /**
     * Gets called every frame before all GameObject(s) are updated \
     * The Script is still updated even though the Scene is paused
     * @virtual
     */
    update() {}
    /**
     * Gets called every frame after all GameObject(s) are updated \
     * The Script is still updated even though the Scene is paused
     * @virtual
     */
    lateUpdate() {}

    /**
     * Initializes the Script
     * @param {Scene} scene Scene of which the Script will be attached
     */
    initialize(scene) {
        if (!(scene instanceof Scene)) {
            console.warn(`Cannot initialize Script with Object not instance of Scene`);
            return;
        }
        this.#scene = scene;
        this.start();
    }
}
