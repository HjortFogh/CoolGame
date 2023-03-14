import { GameObject, GamePrefab, Transform } from "./object.js";
import { Time } from "./time.js";
import { getName, isObjectChildOfClass, isObjectOfClass } from "./type_checker.js";

/**
 * Manages everything related to Scene(s) and SceneTransition(s)
 */
export class SceneManager {
    static scenes = {};
    static activeScene = null;
    static activeSceneName = "";
    static currentTransition = null;

    /**
     * Register a Scene
     * @param {Scene} scene The Scene to be registered
     * @param {String} sceneName The associated name
     */
    static registerScene(scene, sceneName) {
        if (!isObjectChildOfClass(scene, Scene)) throw `'${getName(scene)}' not of type Scene`;
        if (sceneName in this.scenes) throw `'${sceneName}' is already a registed Scene`;
        this.scenes[sceneName] = scene;
    }

    /**
     * Sets the entry Scene
     * @param {String} sceneName The name of the Scene
     */
    static setEntryScene(sceneName) {
        this.setActiveScene(sceneName);
        for (let key in this.scenes) {
            this.scenes[key].start();
        }
    }

    /**
     * Sets the active Scene
     * @param {String} sceneName The name provided when the Scene was registered
     */
    static setActiveScene(sceneName) {
        if (!(sceneName in this.scenes)) throw `'${sceneName}' not a registered Scene`;
        this.activeScene = this.scenes[sceneName];
        this.activeSceneName = sceneName;
        this.activeScene.onEnter();
    }

    /**
     * Ticks the active Scene and SceneTransition
     */
    static tick() {
        if (this.activeScene == null) throw `No active Scene set`;
        this.activeScene.tick();
        if (this.currentTransition != null) this.currentTransition.tick();
    }

    /**
     * Transitions a Scene into another Scene
     * @param {SceneTransition} sceneTransition SceneTransition object
     * @param {String} sceneName The name of the Scene which is being transitioned into
     */
    static transition(sceneTransition, sceneName) {
        if (!isObjectChildOfClass(sceneTransition, SceneTransition)) throw `'${getName(sceneTransition)}' not a subtype of SceneTransition`;
        if (sceneName == this.activeSceneName) return;
        if (this.currentTransition != null) return;

        this.currentTransition = sceneTransition;
        setTimeout(() => this.setActiveScene(sceneName), this.currentTransition.transitionTime * 1000);
        setTimeout(() => (this.currentTransition = null), this.currentTransition.duration * 1000);
    }
}

/**
 * Represents a camera which the world is seen through
 */
class Camera {
    position = null;
    currentFocus = null;

    constructor() {
        this.position = createVector(0, 0);
    }

    /**
     * Sets the Camera position
     * @param {p5.Vector} pos
     */
    setPosition(pos) {
        if (!isObjectOfClass(pos, p5.Vector)) throw `'${getName(pos)}' not of type p5.Vector`;
        this.position = pos;
    }

    // TODO: figure out screen/world/camera space
    /**
     * Retrives the Camera position in ____ space
     * @returns {p5.Vector}
     */
    getPosition() {
        if (this.currentFocus != null) return this.worldToCameraSpace(this.currentFocus.position);
        return createVector(width / 2, height / 2);
    }

    /**
     * Sets the Camera focus
     * @param {Transform} transform The target transform
     */
    setFocus(transform) {
        if (!isObjectOfClass(transform, Transform)) throw `'${getName(transform)}' not of type Transform`;
        this.currentFocus = transform;
    }

    // TODO: Make dependent on size
    /**
     * Checks if a Transform is visible on the canvas
     * @param {Transform} transform
     * @returns
     */
    isVisible(transform) {
        if (!isObjectOfClass(transform, Transform)) throw `'${getName(transform)}' not of type Transform`;

        let cameraPos = this.getPosition();

        let xDist = width / 2 - cameraPos.x - transform.position.x;
        let yDist = height / 2 - cameraPos.y - transform.position.y;

        return !(abs(xDist) > width / 2 || abs(yDist) > height / 2);
    }

    //TODO: change name (maybe)
    worldToCameraSpace(worldPos) {
        return createVector(-worldPos.x + width / 2, -worldPos.y + height / 2);
    }
}

//TODO: fix text \/ \/ \/
/**
 * Represents a world which holds objects
 */
export class Scene {
    gameObjects = [];
    gamePrefabs = [];
    taggedGameObjects = {};
    taggedGamePrefabs = {};
    camera = null;

    constructor() {
        this.camera = new Camera();
    }

    /**
     * Gets called once when the Scene is registered
     * @abstract
     */
    start() {}

    /**
     * Gets called every time the Scene becomes active
     * @abstract
     */
    onEnter() {}

    /**
     * Gets called every frame to display the Scene
     * @abstract
     */
    display() {}

    /**
     * Gets called every frame, while the Scene is active
     */
    tick() {
        // TODO: Stop updating objects further than __distance__
        this.gameObjects.forEach((obj) => obj.update());

        push();

        let cameraPos = this.camera.getPosition();
        translate(cameraPos.x, cameraPos.y);

        this.display();
        this.gameObjects.forEach((obj) => {
            let transform = obj.getComponent(Transform);
            if (this.camera.isVisible(transform)) obj.display();
        });

        pop();
    }

    /**
     * Adds a GameObject to the scene
     * @param {GameObject} object GameObject to add
     * @param {String} objectTag Optional tag/name to search find the GameObject later
     */
    addGameObject(object, objectTag = "") {
        if (!isObjectOfClass(object, GameObject)) throw `'${getName(object)}' not of type GameObject`;
        if (objectTag == "") this.gameObjects.push(object);
        else this.taggedGameObjects[objectTag] = object;
    }

    /**
     * Removes a GameObject from the Scene
     * @param {GameObject} gameObject GameObject to remove
     */
    removeGameObject(gameObject) {
        if (!isObjectOfClass(gameObject, GameObject)) throw `'${getName(gameObject)}' not of type GameObject`;
        let index = this.gameObjects.findIndex((obj) => obj === gameObject);
        if (index > -1) this.gameObjects.splice(index, 1);
    }

    /**
     * TODO:
     */
    getGameObject(tag) {}

    /**
     * Adds a GamePrefab to the Scene
     * @param {GamePrefab} prefab GamePrefab to add
     * @param {String} prefabTag Optional tag/name to search find the GamePrefab later
     */
    addGamePrefab(prefab, prefabTag = "") {
        if (!isObjectOfClass(prefab, GamePrefab)) throw `'${getName(prefab)}' not of type GamePrefab`;
        if (prefabTag == "") this.gamePrefabs.push(prefab);
        else this.taggedGamePrefabs[prefabTag] = prefab;
    }

    /**
     * TODO:
     */
    getGamePrefab(prefabTag) {
        return this.taggedGamePrefabs[prefabTag];
    }
}

/**
 * Represents a transition animation between two Scene(s)
 */
export class SceneTransition {
    duration = 0;
    transitionTime = 0;
    timer = 0;

    /**
     * @param {Float} duration Total transition time in seconds
     * @param {Float} transitionTime Time to pass in seconds, before scene gets changed
     */
    constructor(duration, transitionTime = duration / 2) {
        this.duration = max(duration, 0);
        this.transitionTime = min(max(transitionTime, 0), this.duration);
    }

    /**
     * Gets called when transition is initialized
     * @abstract
     */
    start() {}

    /**
     * Gets called every frame while orginal scene is active
     * @param {Float} p Percentage done
     * @abstract
     */
    displayEntry(p) {}

    /**
     * Gets called every frame while new scene is active
     * @param {Float} p Percentage done
     * @abstract
     */
    displayClose(p) {}

    /**
     * Updates internal timer and calls display functions
     */
    tick() {
        this.timer += Time.deltaTime();
        if (this.timer < this.transitionTime) this.displayEntry(this.timer / this.transitionTime);
        else this.displayClose((this.timer - this.transitionTime) / (this.duration - this.transitionTime));
    }
}
