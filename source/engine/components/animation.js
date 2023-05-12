// Exports:
// - Animation
// - AnimationSelector
// - DirectionalAnimation
// - AnimationTree
// - Animator

import { Time } from "../time.js";
import { createVector } from "../vector.js";
import { Viewer } from "./component.js";

/**
 * An Animation displays different Sprite(s) with a predefined interval
 */
export class Animation {
    /**
     * @type {Array<Sprite>}
     */
    #sprites = [];
    /**
     * @type {Float}
     */
    #frameDuration = 0;
    /**
     * @type {Float}
     */
    #frameTimer = 0;
    /**
     * @type {Int}
     */
    #currentFrame = 0;
    /**
     * @type {Boolean}
     */
    #shouldLoop = true;

    /**
     * Creates a new Animation
     * @param {Array<Sprite>} sprites
     * @param {Float} duration Total duration of animation
     * @param {Boolean} shouldLoop Default is true
     */
    constructor(sprites, duration, shouldLoop = true) {
        this.#sprites = sprites;
        this.#frameDuration = duration / sprites.length;
        this.#frameTimer = 0;
        this.#currentFrame = 0;
        this.#shouldLoop = shouldLoop;
    }

    /**
     * Updates the current Sprite displayed
     */
    update() {
        this.#frameTimer += Time.deltaTime();
        if (this.#frameTimer >= this.#frameDuration) {
            this.#frameTimer = 0;
            if (!this.#shouldLoop && this.#currentFrame == this.#sprites.length - 1) return;
            this.#currentFrame = (this.#currentFrame + 1) % this.#sprites.length;
        }
    }

    /**
     * Displays the Animation
     * @param {Vector} position
     * @param {Vector} size
     */
    display(position = createVector(0, 0), size = undefined) {
        this.#sprites[this.#currentFrame].display(position, size);
    }

    /**
     * Restarts the Animation
     */
    restart() {
        this.#currentFrame = 0;
        this.#frameTimer = 0;
    }
}

/**
 * Selects between multible Animation(s)
 */
export class AnimationSelector {
    /**
     * @type {Object}
     */
    #animations = {};
    /**
     * @type {String}
     */
    #currentAnimation = "";

    /**
     * Setup all property callbacks for the AnimationSelector
     * @virtual
     */
    setupPropertyCallbacks(propertyHolder) {}

    /**
     * Adds an Animation
     * @param {Animation} animation Animation to add
     * @param {String} animationName Name of Animation for later handeling
     */
    addAnimation(animation, animationName) {
        if (animationName in this.#animations) return;
        this.setAnimation(animation, animationName);
        if (this.#currentAnimation == "") this.#currentAnimation = animationName;
    }

    /**
     * Sets the value of an existing Animation
     * @param {Animation} animation Animation to set
     * @param {String} animationName Name of Animation
     */
    setAnimation(animation, animationName) {
        this.#animations[animationName] = animation;
    }

    /**
     * Gets the active Animation
     * @returns {Animation}
     */
    getAnimation() {
        return this.#animations[this.#currentAnimation];
    }

    /**
     * Sets the current Animation
     * @param {String} animationName
     */
    setCurrentAnimation(animationName) {
        this.#currentAnimation = animationName;
    }

    /**
     * Gets the current Animation
     * @return {String}
     */
    getCurrentAnimation() {
        return this.#currentAnimation;
    }

    /**
     * Restarts all the Animation(s) of the AnimationSelector
     */
    restart() {
        for (let key in this.#animations) this.#animations[key].restart();
    }
}

/**
 * AnimationSelector which picks Animation based on direction
 */
export class DirectionalAnimation extends AnimationSelector {
    /**
     * An object which maps the name of the Animation to the direction
     * @type {Object}
     */
    #directions = {};

    /**
     * Listens to the 'direction' property event
     * @param {Object} propertyHolder
     */
    setupPropertyCallbacks(propertyHolder) {
        propertyHolder.addPropertyListener("direction", (newDirection) => this.updateDirection(newDirection));
    }

    /**
     * Add a directional Animation
     * @param {Animation} animation
     * @param {String} animationName
     * @param {Vector} direction
     */
    addAnimation(animation, animationName, direction) {
        this.setAnimation(animation, animationName);
        this.#directions[animationName] = direction.copy();
        if (this.getCurrentAnimation() == "") this.setCurrentAnimation(animationName);
    }

    /**
     * Gets called when the direction is changed
     * @param {Vector} newDirection
     */
    updateDirection(newDirection) {
        if (newDirection.isZero()) return;

        let mostSimilar = -1;
        let nextAnimation = this.getCurrentAnimation();

        for (let animationName in this.#directions) {
            let direction = this.#directions[animationName];
            let similarity = direction.dot(newDirection);

            if (similarity > mostSimilar) {
                mostSimilar = similarity;
                nextAnimation = animationName;
            }
        }

        this.setCurrentAnimation(nextAnimation);
    }
}

/**
 * A tree of AnimationSelector(s) \
 * The AnimationTree can transition between different AnimationSelector(s) using events
 */
export class AnimationTree extends Viewer {
    /**
     * @type {String}
     */
    #currentAnimationSelector = "";
    /**
     * @type {String}
     */
    #startingAnimation = "";

    /**
     * @type {Object}
     */
    #animationSelectors = {};
    /**
     * @type {Object}
     */
    #transitions = {};
    /**
     * @type {Object}
     */
    #properties = {};

    /**
     * Gets called when the Component is started
     */
    start() {
        this.transform = this.gameObject.getComponent("Transform");
    }

    /**
     * Restarts the AnimationTree
     */
    restart() {
        this.#currentAnimationSelector = this.#startingAnimation;
        for (let key in this.#animationSelectors) this.#animationSelectors[key].restart();
    }

    /**
     * Adds a AnimationSelector to the AnimationTree
     * @param {AnimationSelector} animationSelector
     * @param {String} animationSelectorName Name of AnimationSelector used for transitioning
     */
    addAnimationSelector(animationSelector, animationSelectorName) {
        if (animationSelectorName in this.#animationSelectors) return;
        if (this.#startingAnimation == "") {
            this.#currentAnimationSelector = animationSelectorName;
            this.#startingAnimation = animationSelectorName;
        }
        this.#animationSelectors[animationSelectorName] = animationSelector;
        this.#transitions[animationSelectorName] = [];
        animationSelector.setupPropertyCallbacks(this);
    }

    /**
     * Adds a transition between two AnimationSelector(s)
     * @param {String} fromAnimation Name of first AnimationSelector
     * @param {String} toAnimation Name of target AnimationSelector
     * @param {String} event Event to trigger the transition
     */
    addTransition(fromAnimation, toAnimation, event) {
        if (!(fromAnimation in this.#transitions)) return;
        this.#transitions[fromAnimation].push({ target: toAnimation, event: event });
    }

    /**
     * Transitions the active AnimationSelector if a matching event is found
     * @param {*} event
     */
    transition(event) {
        for (let transition of this.#transitions[this.#currentAnimationSelector]) {
            if (transition.event == event) {
                this.#currentAnimationSelector = transition.target;
                return;
            }
        }
    }

    /**
     * Displays the active AnimationSelector
     */
    display() {
        let animation = this.#animationSelectors[this.#currentAnimationSelector].getAnimation();
        if (animation === undefined) return;
        animation.update();
        animation.display(this.transform.position, this.transform.scale);
    }

    /**
     * Sets a property
     * @param {String} property
     * @param {*} value
     */
    setProperty(property, value) {
        if (!(property in this.#properties)) this.#properties[property] = { value: 0, listeners: [] };
        this.#properties[property].value = value;
        for (let callback of this.#properties[property].listeners) callback(value);
    }

    /**
     * Adds a callback for when a property is changed through 'setProperty'
     * @param {String} property
     * @param {Function} callback
     */
    addPropertyListener(property, callback) {
        if (!(property in this.#properties)) this.#properties[property] = { value: 0, listeners: [] };
        this.#properties[property].listeners.push(callback);
    }
}

/**
 * The Animator displays a Animation onto the canvas
 */
export class Animator extends Viewer {
    /**
     * @type {Transform}
     */
    transform;
    /**
     * @type {Animation}
     */
    animation;

    /**
     * Called when the Animator is started
     * @param {Animation} animation
     */
    start(animation) {
        this.transform = this.gameObject.getComponent("Transform");
        this.animation = animation;
    }

    /**
     * Restarts the Animator
     */
    restart() {
        this.animation.restart();
    }

    /**
     * Display the Animation
     */
    display() {
        this.animation.update();
        this.animation.display(this.transform.position, this.transform.scale);
    }
}
