// Exports:
// - createArena

import { Engine } from "../../engine/engine.js";

/**
 * Displays the arena
 */
class ArenaViewer extends Engine.Viewer {
    /**
     * @type {Transform}
     */
    #transform;
    /**
     * @type {Float}
     */
    #radius;

    /**
     * Retrives the transform and the radius
     */
    start() {
        this.#transform = this.gameObject.getComponent("Transform");
        this.#radius = Engine.AssetManager.getAsset("arenaRadius");
        this.setViewLayer(0);
        this.reset();
    }

    /**
     * Sets the proper scale for the arena, such that it is displayed even when the center is off-screen
     */
    reset() {
        this.#transform.scale = Engine.createVector(this.#radius);
    }

    /**
     * Display the arena
     */
    display() {
        noStroke();
        fill(89, 72, 37);
        circle(this.#transform.position.x, this.#transform.position.x, this.#radius * 2);
        fill(129, 102, 67);
        circle(this.#transform.position.x, this.#transform.position.x, 500);
    }
}

/**
 * Creates a new arena
 * @returns {GameObject}
 */
export function createArena() {
    let viewer = new ArenaViewer();
    return Engine.createGameObject(viewer);
}
