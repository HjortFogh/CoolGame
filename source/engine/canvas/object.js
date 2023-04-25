import { Transform } from "../components/transform.js";
import { Controller, Viewer } from "../engine.js";

export class GameObject {
    isObjectInitialized = false;
    isObjectDestroyed = false;

    static componentsTree = new Map();
    components = new Map();

    viewers = [];
    controllers = [];
    layers = [];

    initialize() {
        this.isObjectInitialized = true;
        for (let [, comps] of this.components) comps.forEach((comp) => comp.initialize(this));
    }

    isInitialized() {
        return this.isObjectInitialized;
    }

    update() {
        this.controllers.forEach((controller) => controller.update());
        this.layers = [];
        this.viewers.forEach((viewer) => {
            if (this.layers[viewer.viewLayer] === undefined) this.layers[viewer.viewLayer] = [];
            this.layers[viewer.viewLayer].push(viewer);
        });
    }

    displayLayer(layerNum) {
        if (layerNum >= this.layers.length) return true;
        else if (this.layers[layerNum] === undefined || this.layers[layerNum].length == 0) return false;

        for (let viewer of this.viewers) {
            if (viewer.viewLayer != layerNum) continue;
            viewer.display();
        }

        return false;
    }

    //#region Destroy

    destroy() {
        this.isObjectDestroyed = true;
    }
    isDestroyed() {
        return this.isObjectDestroyed;
    }

    //#endregion

    //#region Components

    static buildBranch(comp) {
        if (GameObject.componentsTree.has(comp.name)) return;

        GameObject.componentsTree.set(comp.name, []);
        let parent = Object.getPrototypeOf(comp);

        if (parent.prototype instanceof Object) {
            GameObject.buildBranch(parent);
            GameObject.componentsTree.get(parent.name).push(comp.name);
        }
    }

    static getBranch(compName) {
        if (!GameObject.componentsTree.has(compName)) throw `'${compName}' not a registered Component`;

        let myKeys = GameObject.componentsTree.get(compName);
        let keys = myKeys.slice();

        for (let key of myKeys) keys = keys.concat(GameObject.getBranch(key));
        // for (let key of myKeys) Array.prototype.push.apply(keys, GameObject.getBranch(key));

        return keys;
    }

    addComponent(component) {
        if (!this.components.has(component.constructor.name)) {
            GameObject.buildBranch(component.constructor);
            this.components.set(component.constructor.name, []);
        }
        this.components.get(component.constructor.name).push(component);

        if (component instanceof Viewer) this.viewers.push(component);
        else if (component instanceof Controller) this.controllers.push(component);

        if (this.isObjectInitialized) component.initialize(this);
    }

    getComponents(componentConstructorName) {
        if (!this.components.has(componentConstructorName)) return undefined;
        return this.components.get(componentConstructorName);
    }

    getComponent(componentConstructorName, index = 0) {
        let components = this.getComponents(componentConstructorName);
        if (components === undefined) return undefined;
        return components[index];
    }

    getComponentsRecursive(componentConstructorName) {
        let keys = [componentConstructorName].concat(GameObject.getBranch(componentConstructorName));
        let components = [];
        for (let key of keys) {
            let comps = this.components.get(key);
            if (comps !== undefined) components = components.concat(comps);
        }
        return components;
    }

    //#endregion

    copy() {
        let newGameObject = new GameObject();

        for (let [, comps] of this.components)
            comps.forEach((comp) => {
                newGameObject.addComponent(comp.copy());
            });

        return newGameObject;
    }

    restart() {
        if (!this.isObjectInitialized) throw `Cannot reset GameObject before initialization`;
        this.isDestroyed = false;
        for (let [, comps] of this.components) comps.forEach((comp) => comp.restart());
    }
}

export function createGameObject(...comps) {
    let newObject = new GameObject();
    newObject.addComponent(new Transform());
    for (let comp of comps) newObject.addComponent(comp);
    return newObject;
}

export class GamePrefab {
    prefabGameObject;
    // gameObjectPool = [];
    scene;

    constructor(prefabGameObject) {
        if (prefabGameObject.isInitialized()) throw `GamePrefab must be provided with an uninstantiated GameObject`;
        this.prefabGameObject = prefabGameObject;
    }

    setScene(newScene) {
        this.scene = newScene;
    }

    spawn() {
        if (this.scene === undefined) throw `GamePrefab is not bound to a Scene`;

        let newObject = this.prefabGameObject.copy();
        this.scene.addGameObject(newObject);
        // this.gameObjectPool.push(newObject);

        return newObject;
    }
}
