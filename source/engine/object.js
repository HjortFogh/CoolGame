// TODO: special case for transform
// TODO: z-sorting for all viewer components

import { Scene } from "./scene.js";
import { getName, isClassChildOfClass, isObjectChildOfClass, isObjectOfClass } from "./type_checker.js";

/**
 * Represents a object which can hold Component(s)
 */
export class GameObject {
    models = [];
    viewers = [];
    controllers = [];
    destroySelfCallback = null;

    /**
     * Gets called before GameObject is destroyed
     * @abstract
     */
    onDestroy() {}

    /**
     * Constructs a new GameObject
     * @param {Transform} transform The starting Transform for the object
     */
    constructor(transform = new Transform()) {
        if (!isObjectOfClass(transform, Transform)) throw `'${getName(transform)}' not of type Transform`;
        this.addComponent(transform);
    }

    /**
     * Adds a Component
     * @param {Component} comp A Component object to be added to the GameObject
     */
    addComponent(comp) {
        if (!isObjectChildOfClass(comp, Component)) throw `'${getName(comp)}' not of subtype Component`;

        if (isObjectChildOfClass(comp, Model)) this.models.push(comp);
        else if (isObjectChildOfClass(comp, Viewer)) this.viewers.push(comp);
        else if (isObjectChildOfClass(comp, Controller)) this.controllers.push(comp);

        comp.initialize(this);
    }

    /**
     * Retrives a single Component
     * @param {Class} compClass A child class of the Component to get
     * @returns {(Component|null)} A Component object
     */
    getComponent(compClass) {
        if (!isClassChildOfClass(compClass, Component)) throw `'${getName(compClass)}' not of subtype Component`;

        let findComponent = (list) => {
            let component = list.find((comp) => comp instanceof compClass);
            return component !== undefined ? component : null;
        };

        if (isClassChildOfClass(compClass, Model)) return findComponent(this.models);
        else if (isClassChildOfClass(compClass, Viewer)) return findComponent(this.viewers);
        else if (isClassChildOfClass(compClass, Controller)) return findComponent(this.controllers);
    }

    /**
     * Forwards the update call to all Controller Component(s)
     */
    update() {
        this.controllers.forEach((cont) => cont.update());
    }

    /**
     * Forwards the display call to all Viewer Component(s)
     */
    display() {
        this.viewers.forEach((view) => view.display());
    }

    /**
     * Copies a GameObject
     * @returns {GameObject}
     */
    copy() {
        let newObject = Object.create(this.constructor.prototype);

        newObject.models = this.models.map((comp) => comp.copy());
        newObject.viewers = this.viewers.map((comp) => comp.copy());
        newObject.controllers = this.controllers.map((comp) => comp.copy());

        newObject.models.forEach((comp) => comp.initialize(newObject));
        newObject.viewers.forEach((comp) => comp.initialize(newObject));
        newObject.controllers.forEach((comp) => comp.initialize(newObject));

        return newObject;
    }

    /**
     * Sets the callback function used when the GameObject should be destroyed
     * @param {Function} callback
     */
    setDestroyCallback(callback) {
        if (typeof callback !== "function") throw `'${callback}' was not a function`;
        this.destroySelfCallback = callback;
    }

    /**
     * Destroys the GameObject
     */
    destroy() {
        this.onDestroy();
        destroySelfCallback();
    }
}

export class GamePrefab {
    gameObject;
    objectPool = [];

    constructor(object, initialPoolSize = 10) {
        this.gameObject = object;
        // for (let i = 0; i < max(initialPoolSize, 0); i++) this.objectPool.push(this.gameObject.copy());
    }

    spawn() {
        // TODO: check if existing in pool
        let spawnedObject = this.gameObject.copy();
        return spawnedObject;
    }
}

/**
 * Represents a collection of related functionality
 */
export class Component {
    gameObject = null;

    /**
     * Initializes the Component
     * @param {GameObject} object The GameObject which the Component has been attached to
     */
    initialize(object) {
        this.gameObject = object;
        this.start();
    }

    /**
     * Copies a Component
     * @param {GameObject} newObject The new GameObject parent
     * @returns {Component}
     */
    copy() {
        let newComponent = Object.create(this.constructor.prototype);
        // print(newComponent.constructor.name, newComponent);
        // print("Copy of component:", this.constructor.name);
        return newComponent;
        // return new
    }

    /**
     * Gets called after Component has been initialized
     * @abstract
     */
    start() {}
}

/**
 * Model is a Component used for abstracting data
 */
export class Model extends Component {}

/**
 * Viewer is a Component used to draw graphics to the canvas
 */
export class Viewer extends Component {
    /**
     * Gets called once every frame
     * @abstract
     */
    display() {}
}

/**
 * Controller is a Component used for game logic
 */
export class Controller extends Component {
    /**
     * Gets called once every frame
     * @abstract
     */
    update() {}
}

/**
 * Represents a GameObject(s) position, rotation and scale
 */
export class Transform extends Model {
    start() {
        this.position = createVector(0, 0);
        this.rotation = 0;
        this.scale = createVector(1, 1);
    }
}
