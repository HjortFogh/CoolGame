// Exports:
// - RectCollider
// - CircleCollider

import { createRect, lerpPoint, pointWithinRect, createVector } from "../vector.js";
import { SpatialManager } from "../spatial_partitioning.js";
import { Controller } from "./component.js";

/**
 * A Collider component which can detect collisions with other Collider(s)
 */
class Collider extends Controller {
    /**
     * Counts the current number of Collider(s) created
     * @type {Int}
     * @static
     */
    static #colliderCounter = 0;
    /**
     * The ID of a Collider is equal to 'colliderCounter' when created
     * @type {Int}
     */
    #identifier = -1;

    /**
     * @type {Transform}
     */
    #transform;

    /**
     * Axis Aligned Bounding Box
     * @type {Object}
     */
    #aabb;
    /**
     * @type {Array<Vector>}
     */
    #verticies = [];
    /**
     * @type {Map<Int, Collider>}
     */
    #currentlyColliding = new Map();
    /**
     * @type {Map<Int, Collider>}
     */
    #lastColliding = new Map();

    /**
     * @type {Array<Function>}
     */
    #listeners = {};

    /**
     * Checks if the Collider contains a point
     * @param {Vector} point
     * @returns {Boolean}
     * @virtual
     */
    containsPoint(point) {
        return false;
    }

    /**
     * Returns the ID of this Collider
     * @returns {Int}
     */
    getIdentifier() {
        if (this.#identifier != -1) return this.#identifier;
        this.#identifier = Collider.#colliderCounter++;
        return this.#identifier;
    }

    /**
     * Add a listener to a certain event \
     * Events: "onEnter", "onExit"
     * @param {String} event
     * @param {Function} callback
     */
    addListener(event, callback) {
        if (typeof event != "string") {
            console.warn(`Event must be of type 'String'`);
            return;
        }
        if (typeof callback != "function") {
            console.warn(`Callback must be of type 'Function'`);
            return;
        }

        if (this.#listeners[event] === undefined) this.#listeners[event] = [];
        this.#listeners[event].push(callback);
    }

    /**
     * Trigger an event
     * @param {String} event
     * @param {Collider} collider
     */
    triggerEvent(event, collider) {
        if (this.#listeners[event] === undefined) return;
        for (let callback of this.#listeners[event]) callback(collider);
    }

    /**
     * Calculates all collisions within bounding box
     */
    update() {
        // Get all GameObject(s) within a certain area of the current collider
        let collisionArea = this.toGlobalSpaceRect(createRect(this.#aabb.x * 2, this.#aabb.y * 2, this.#aabb.w * 2, this.#aabb.h * 2));
        let gameObjects = SpatialManager.get(collisionArea);

        // Iterate over all GameObject(s)
        for (let gameObject of gameObjects) {
            let colliders = gameObject.getComponentsRecursive("Collider");
            // Iterate over all Collider(s) attached to the GameObject
            for (let collider of colliders) {
                if (collider === this) continue;

                // If any points within this Collider is contained within the other Collider, the 'collide' methods are called
                for (let vertex of [this.#transform.position, ...this.#verticies]) {
                    if (collider.containsPoint(this.toGlobalSpacePoint(vertex))) {
                        this.collide(collider);
                        collider.collide(this);
                        break;
                    }
                }
            }
        }

        // Check for differences and call the "onEnter" event
        for (let [key, value] of this.#currentlyColliding) {
            if (!this.#lastColliding.has(key)) this.triggerEvent("onEnter", value);
        }

        // Check for differences and call the "onExit" event
        for (let [key, value] of this.#lastColliding) {
            if (!this.#currentlyColliding.has(key)) this.triggerEvent("onExit", value);
        }

        // Update the maps of other Colliders
        this.#lastColliding = this.#currentlyColliding;
        this.#currentlyColliding = new Map();
    }

    /**
     * Called when two Collider(s) collide
     * @param {Collider} collider
     */
    collide(collider) {
        let id = collider.getIdentifier();
        if (!this.#currentlyColliding.has(id)) this.#currentlyColliding.set(id, collider);
    }

    /**
     * Takes a point in global space and transforms it into local space
     * @param {Vector} point
     * @returns {Vector}
     */
    toLocalSpacePoint(point) {
        return createVector(point.x - this.#transform.position.x, point.y - this.#transform.position.y);
    }

    /**
     * Takes a point in local space and transforms it into global space
     * @param {Vector} point
     * @returns {Vector}
     */
    toGlobalSpacePoint(point) {
        return createVector(this.#transform.position.x + point.x, this.#transform.position.y + point.y);
    }

    /**
     * Takes a rectangle object and transforms it into global space
     * @param {Object} rect Object with properties x, y, w, h
     * @returns {Object}
     */
    toGlobalSpaceRect(rect) {
        return createRect(this.#transform.position.x + rect.x, this.#transform.position.y + rect.y, rect.w, rect.h);
    }

    /**
     * Sets the Transform
     * @param {Transform} transform
     */
    setTransform(transform) {
        this.#transform = transform;
    }

    /**
     * Sets the AABB (Axis Aligned Bounding Box)
     * @param {Object} aabb
     */
    setAABB(aabb) {
        this.#aabb = aabb;
    }

    /**
     * Gets the AABB (Axis Aligned Bounding Box)
     * @return {Object}
     */
    getAABB() {
        return this.#aabb;
    }

    /**
     * Sets the verticies
     * @param {Array<Vertex>} verticies
     */
    setVerticies(verticies) {
        this.#verticies = verticies;
    }
}

/**
 * A Collider which has the shape of a rectangle
 */
export class RectCollider extends Collider {
    /**
     * Starts the RectCollider
     * @param {Vector} scale Default value is <50, 50>
     */
    start(scale = createVector(50)) {
        this.setTransform(this.gameObject.getComponent("Transform"));
        this.setAABB(createRect(-scale.x / 2, -scale.y / 2, scale.x, scale.y));

        let A = createVector(-scale.x / 2, -scale.y / 2), // Top Left
            B = createVector(-scale.x / 2, +scale.y / 2), // Bottom Left
            C = createVector(+scale.x / 2, +scale.y / 2), // Bottom Right
            D = createVector(+scale.x / 2, -scale.y / 2); // Top Right

        let verticies = [A, B, C, D];

        // Number of points along the x and y axis
        let xNum = Math.floor(scale.x * 0.06);
        let yNum = Math.floor(scale.y * 0.06);

        for (let x = 0; x < xNum; x++) {
            verticies.push(lerpPoint(A, D, x / xNum));
            verticies.push(lerpPoint(B, C, x / xNum));
        }

        for (let y = 0; y < yNum; y++) {
            verticies.push(lerpPoint(A, B, y / yNum));
            verticies.push(lerpPoint(C, D, y / yNum));
        }

        this.setVerticies(verticies);
    }

    /**
     * Checks if a point is contained within the RectCollider
     * @param {Vector} point
     * @returns {Boolean}
     */
    containsPoint(point) {
        return pointWithinRect(this.toLocalSpacePoint(point), this.getAABB());
    }
}

/**
 * A Collider which has the shape of a circle
 */
export class CircleCollider extends Collider {
    /**
     * @type {Float}
     */
    #radius;

    /**
     * Starts the CircleCollider
     * @param {Float} radius Radius of CircleCollider
     */
    start(radius = 50) {
        this.setTransform(this.gameObject.getComponent("Transform"));
        this.setAABB(createRect(-radius, -radius, radius * 2, radius * 2));
        this.#radius = radius;

        let verticies = [];

        let numPoints = Math.floor(0.4 * this.#radius);
        for (let i = 0; i < numPoints; i++) {
            let angle = (TWO_PI / numPoints) * i;
            verticies.push(createVector(cos(angle) * this.#radius, sin(angle) * this.#radius));
        }

        this.setVerticies(verticies);
    }

    /**
     * Checks if a point is within the CircleCollider
     * @param {Vector} point
     * @returns {Boolean}
     */
    containsPoint(point) {
        let localSpacePoint = this.toLocalSpacePoint(point);
        return localSpacePoint.x ** 2 + localSpacePoint.y ** 2 <= this.#radius ** 2;
    }
}
