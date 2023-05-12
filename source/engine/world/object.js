// Exports:
// - GameObject
// - GamePrefab
// - createGameObject

import { Component, Controller, Viewer } from "../components/component.js";
import { Transform } from "../components/transform.js";
import { Scene } from "./scene.js";

/**
 * A GameObject represents an object in the world, with different Component(s)
 */
export class GameObject {
    /**
     * A map storing the inheritance relation between Component(s), used for querying all Component(s) of a specific type
     * @type {Map<String, Array<String>>}
     * @static
     */
    static #componentsTree = new Map();

    /**
     * @type {Boolean}
     */
    #isObjectInitialized = false;
    /**
     * @type {Boolean}
     */
    #isObjectDestroyed = false;

    /**
     * @type {Array<Function>}
     */
    #onDestroyedCallbacks = [];

    /**
     * Stores all Component(s) of a GameObject in the format: {"exampleComponent": [ExampleComponent, ExampleComponent]}
     * @type {Map<String, Array<Component>>}
     */
    #components = new Map();
    /**
     * @type {Array<Controller>}
     */
    #controllers = [];
    /**
     * @type {Array<Viewer>}
     */
    #viewers = [];
    /**
     * An array containing the all Viewer(s) sorted by their view layer every frame
     * @type {Array<Viewer>}
     */
    #layers = [];

    //#region Initialization

    /**
     * Initializes the GameObject, which in turn initialize all Component(s)
     */
    initialize() {
        if (this.#isObjectInitialized) return;
        this.#isObjectInitialized = true;
        for (let [, comps] of this.#components) comps.forEach((comp) => comp.initialize(this));
    }

    /**
     * Checks whether the GameObject has been initialized
     * @returns {Boolean}
     */
    isInitialized() {
        return this.#isObjectInitialized;
    }

    //#endregion

    //#region Update and Display

    /**
     * Updates all Component(s) of the GameObject
     */
    update() {
        this.#controllers.forEach((controller) => controller.update());
        // Build 'layers' array
        this.#layers = [];
        this.#viewers.forEach((viewer) => {
            let viewLayer = viewer.getViewLayer();
            if (this.#layers[viewLayer] === undefined) this.#layers[viewLayer] = [];
            this.#layers[viewLayer].push(viewer);
        });
    }

    /**
     * Displays all Viewer(s) on a certain layer
     * @param {Int} layerNum Index of layer to display
     * @returns {Boolean} Whether all layers have been displayed this frame
     */
    displayLayer(layerNum) {
        if (layerNum >= this.#layers.length) return true;
        else if (this.#layers[layerNum] === undefined) return false;

        for (let viewer of this.#viewers) {
            if (viewer.getViewLayer() != layerNum) continue;
            viewer.display();
        }

        return false;
    }

    //#endregion

    //#region Destroy

    /**
     * Destroyes the GameObject meaning it will no longer be updated and displayed
     */
    destroy() {
        this.#isObjectDestroyed = true;
        for (let callback of this.#onDestroyedCallbacks) callback();
    }

    /**
     * Checks whether the GameObject is destroyed
     * @returns {Boolean}
     */
    isDestroyed() {
        return this.#isObjectDestroyed;
    }

    /**
     * Adds a callback function, which is then called when the GameObject is destroyed
     * @param {Function} callback
     */
    onDestroy(callback) {
        if (typeof callback != "function") {
            console.warn("Callback not a function");
            return;
        }
        this.#onDestroyedCallbacks.push(callback);
    }

    //#endregion

    //#region Components

    /**
     * Builds a branch of the 'componentsTree'
     * @param {Class} componentClass Class of Component to build
     * @static
     */
    static buildBranch(componentClass) {
        if (GameObject.#componentsTree.has(componentClass.name)) return;

        GameObject.#componentsTree.set(componentClass.name, []);
        let parent = Object.getPrototypeOf(componentClass);

        if (parent.prototype instanceof Object) {
            GameObject.buildBranch(parent);
            GameObject.#componentsTree.get(parent.name).push(componentClass.name);
        }
    }

    /**
     * Retrives the names of all sub-Component(s) given a Component class.
     * @param {String} componentClassName Name of Component
     * @returns {List<String>}
     * @static
     */
    static getBranch(componentClassName) {
        if (!GameObject.#componentsTree.has(componentClassName)) throw `'${componentClassName}' not a registered Component`;

        let myKeys = GameObject.#componentsTree.get(componentClassName);
        let keys = myKeys.slice();

        for (let key of myKeys) keys = keys.concat(GameObject.getBranch(key));

        return keys;
    }

    /**
     * Adds a Component to the GameObject
     * @param {Component} component
     */
    addComponent(component) {
        if (!(component instanceof Component)) {
            console.warn(`Object: ${component} not a Component`);
            return;
        }

        if (!this.#components.has(component.constructor.name)) {
            this.#components.set(component.constructor.name, []);
            GameObject.buildBranch(component.constructor);
        }

        this.#components.get(component.constructor.name).push(component);
        if (component instanceof Viewer) this.#viewers.push(component);
        else if (component instanceof Controller) this.#controllers.push(component);

        if (this.#isObjectInitialized) component.initialize(this);
    }

    /**
     * Retrives all Component(s) with a maching name
     * @param {String} componentClassName Name of Component
     * @returns {Array<Component>|undefined}
     */
    getComponents(componentClassName) {
        if (typeof componentClassName != "string") {
            console.warn(`Component name must be string`);
            return [];
        }
        if (!this.#components.has(componentClassName)) return [];
        return this.#components.get(componentClassName);
    }

    /**
     * Retrives one Component \
     * Retrives by default the first Component
     * @param {String} componentClassName Name of Component
     * @param {Int} index Index of Component to retrive
     * @returns {Component|undefined}
     */
    getComponent(componentClassName, index = 0) {
        let components = this.getComponents(componentClassName);
        if (components.length == 0) return undefined;
        if (index < components.length) return components[index];
        else {
            console.warn(`Index out of range when retriving Component: '${componentClassName}'`);
            return undefined;
        }
    }

    /**
     * Retrives all Component(s) with a given name recursivly
     * @param {String} componentClassName Name of Component
     * @returns {Array<Component>}
     */
    getComponentsRecursive(componentClassName) {
        let keys = [componentClassName].concat(GameObject.getBranch(componentClassName));
        let components = [];
        for (let key of keys) {
            let comps = this.#components.get(key);
            if (comps !== undefined) components = components.concat(comps);
        }
        return components;
    }

    //#endregion

    //#region Copy

    /**
     * Returns a uninitialized copy of the GameObject with the same Component(s)
     * @returns {GameObject}
     */
    copy() {
        let newGameObject = new GameObject();

        for (let [, comps] of this.#components)
            comps.forEach((comp) => {
                newGameObject.addComponent(comp.copy());
            });

        return newGameObject;
    }

    /**
     * Restarts a GameObject
     */
    restart() {
        if (!this.#isObjectInitialized) {
            console.warn(`Cannot reset GameObject before initialization`);
            return;
        }
        this.#isObjectDestroyed = false;
        for (let [, comps] of this.#components) comps.forEach((comp) => comp.restart());
    }

    //#endregion
}

/**
 * Can fabricate GameObject(s) based on a orginial GameObject
 */
export class GamePrefab {
    /**
     * @type {GameObject}
     */
    #prefabGameObject;
    /**
     * @type {Scene}
     */
    #boundScene;

    /**
     * @type {Boolean}
     */
    #isInitialized = false;
    /**
     * @type {Boolean}
     */
    #hasAlertedNoScene = false;

    /**
     * Creates a new GamePrefab based on a original GameObject
     * @param {GameObject} prefabGameObject Uninitialized GameObject to copy
     */
    constructor(prefabGameObject) {
        if (prefabGameObject === undefined) {
            console.warn(`GamePrefab was provided with an undefined GameObject`);
            return;
        }
        if (prefabGameObject.isInitialized()) {
            console.warn(`GamePrefab must be provided with an uninitialized GameObject`);
            return;
        }

        this.#isInitialized = true;
        this.#prefabGameObject = prefabGameObject;
    }

    /**
     * Sets the Scene in which the new GameObject will be spawned within
     * @param {Scene} newScene
     */
    setScene(newScene) {
        if (!(newScene instanceof Scene)) {
            console.warn(`GamePrefab was not provided with Scene`);
            return;
        }
        this.#boundScene = newScene;
    }

    /**
     * Spawn a new GameObject based on the provided original GameObject
     * @returns {GameObject|undefined} The newly spawned GameObject
     */
    spawn() {
        if (!this.#isInitialized) return undefined;
        if (this.#boundScene === undefined) {
            if (!this.#hasAlertedNoScene) {
                console.warn(`GamePrefab is not bound to a Scene`);
                this.#hasAlertedNoScene = true;
            }
            return undefined;
        }

        let newObject = this.#prefabGameObject.copy();
        this.#boundScene.addGameObject(newObject);
        return newObject;
    }
}

/**
 * Creates a GameObject with provided Component(s) \
 * The GameObject has a Transform by default
 * @param  {...Component} components Component(s) to add
 * @returns {GameObject}
 */
export function createGameObject(...components) {
    let newObject = new GameObject();
    newObject.addComponent(new Transform());
    for (let comp of components) newObject.addComponent(comp);
    return newObject;
}
