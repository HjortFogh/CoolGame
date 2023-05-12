// Exports:
// - Time

import { SceneManager } from "./world/scene.js";

/**
 * Functionality to do with time
 */
export class Time {
    /**
     * @type {Array<Object>}
     * @static
     */
    static #timers = [];

    /**
     * Updates the active timers
     * @static
     */
    static tick() {
        for (let i = this.#timers.length - 1; i >= 0; i--) {
            if (SceneManager.getActiveScene() !== this.#timers[i].scene || this.#timers[i].scene.isPaused()) continue;
            this.#timers[i].counter += this.deltaTime();
            if (this.#timers[i].counter >= this.#timers[i].time) {
                this.#timers[i].callback();
                this.#timers.splice(i, 1);
            }
        }
    }

    /**
     * @returns {Float} Time since last frame in seconds
     * @static
     */
    static deltaTime() {
        return deltaTime * 0.001;
    }

    /**
     * @returns {Float} Time in seconds since January 1, 1970
     */
    static now() {
        return Date.now() * 0.001;
    }

    /**
     * Creates a new timer
     * @param {Function} callback Function to be called
     * @param {Float} timeInSeconds Amount of time in seconds, after which the callback is called
     */
    static createTimer(callback, timeInSeconds) {
        this.#timers.push({ callback: callback, time: timeInSeconds, counter: 0, scene: SceneManager.getActiveScene() });
    }
}
