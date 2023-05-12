// Exports:
// - Component
// - Model
// - Viewer
// - Controller

/**
 * The base class of which all Component(s) inherit from
 */
export class Component {
    /**
     * @type {GameObject}
     */
    #parentGameObject;
    /**
     * @type {Array<*>}
     */
    #args = [];
    /**
     * @type {Array<Function>}
     */
    #onInitCallbacks = [];
    /**
     * @type {Boolean}
     */
    #isComponentInitialized = false;

    /**
     * Get a reference to the parent GameObject
     * @returns {GameObject}
     */
    get gameObject() {
        return this.#parentGameObject;
    }

    /**
     * Gets called after the Component has been initialized
     * @virtual
     */
    start() {}
    /**
     * Gets called every time the Component should be reset
     * @virtual
     */
    restart() {}

    /**
     * Creates a new Component and stores the arguments for use in the start and reset methods
     * @param  {...any} args
     */
    constructor(...args) {
        this.#args = args;
    }

    /**
     * Initializes the Component
     * @param {GameObject} parentGameObject GameObject of which the Component is attached
     */
    initialize(parentGameObject) {
        if (this.#isComponentInitialized) return;
        this.#isComponentInitialized = true;

        this.#parentGameObject = parentGameObject;
        this.start(...this.#args);

        for (let callback of this.#onInitCallbacks) callback();
    }

    /**
     * Returns whether the Component has been initialized
     * @returns {Boolean}
     */
    isInitialized() {
        return this.#isComponentInitialized;
    }

    /**
     * Adds a listener for when the Component is initialized
     * @param {Function} callback
     */
    onInitialize(callback) {
        this.#onInitCallbacks.push(callback);
    }

    /**
     * Returns a uninitialized copy of this Component
     * @returns {Component}
     */
    copy() {
        return new this.constructor(...this.#args);
    }
}

/**
 * Holds data used by other Component(s), Script(s), etc. \
 * Example: A player's inventory
 */
export class Model extends Component {}

/**
 * Used to display a GameObject
 * Example: A player sprite
 */
export class Viewer extends Component {
    /**
     * Layer at which the Viewer is displayed \
     * Larger viewLayer's mean the Viewer will be displayed ontop of Viewer's with a lower viewLayer
     * @type {Int}
     */
    #viewLayer = 0;

    /**
     * Called every frame used to display to the canvas
     * @virtual
     */
    display() {}

    /**
     * Sets the viewLayer
     * @param {Int} newLayer
     */
    setViewLayer(newLayer) {
        if (typeof newLayer != "number") {
            console.warn(`ViewLayer must be a number`);
            return;
        }
        this.#viewLayer = Math.min(Math.max(newLayer, 0), 50);
    }

    /**
     * Returns the viewLayer
     * @returns {Int}
     */
    getViewLayer() {
        return this.#viewLayer;
    }
}

/**
 * Used to update a GameObject
 * Example: A player movement controller
 */
export class Controller extends Component {
    /**
     * Called every frame to update a GameObject
     * @virtual
     */
    update() {}
}
