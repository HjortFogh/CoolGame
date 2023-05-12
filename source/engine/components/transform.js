// Exports:
// - Transform

import { createVector } from "../vector.js";
import { Model } from "./component.js";

/**
 * Represents an GameObject(s) position, scale and rotation in the Scene
 */
export class Transform extends Model {
    /**
     * @type {Vector}
     */
    position = createVector(0);
    /**
     * @type {Vector}
     */
    scale = createVector(50);
    /**
     * @type {Float}
     */
    rotation = 0;

    /**
     * Called when the Component is reset
     */
    restart() {
        this.position = createVector(0);
        this.scale = createVector(50);
        this.rotation = 0;
    }
}
