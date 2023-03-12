// TODO: special case for transform
// TODO: z-sorting for all viewer components

import { getName, isClassChildOfClass, isObjectChildOfClass, isObjectOfClass } from "./type_checker.js";

/**
 * Represents a object which can hold Component(s)
 */
export class GameObject {
    models = [];
    viewers = [];
    controllers = [];

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
}

/**
 * Represents a collection of related functionality
 */
export class Component {
    gameObject = null;

    /**
     * Initializes a Component
     * @param {GameObject} object The GameObject which the Component has been attached to
     */
    initialize(object) {
        this.gameObject = object;
        this.start();
    }

    /**
     * Gets called after Component has been initialized
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
     */
    display() {}
}

/**
 * Controller is a Component used for game logic
 */
export class Controller extends Component {
    /**
     * Gets called once every frame
     */
    update() {}
}

/**
 * Represents an objects position, rotation and scale
 */
export class Transform extends Model {
    constructor(pos = createVector(0, 0), rot = 0, scale = createVector(1, 1)) {
        super();
        this.position = pos;
        this.rotation = rot;
        this.scale = scale;
    }
}
