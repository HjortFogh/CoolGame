// Exports:
// - Events

/**
 * Event system for communication between objects
 */
export class Events {
    /**
     * Contains multible (event, callbacks)-pairs
     * @type {Object}
     * @static
     */
    static #eventListeners = {};

    /**
     * Add a callback to a certain event
     * @param {String} event
     * @param {Function} callback
     * @static
     */
    static addEventListener(event, callback) {
        if (this.#eventListeners[event] === undefined) this.#eventListeners[event] = [];
        this.#eventListeners[event].push(callback);
    }

    /**
     * Triggers an event meaning all callbacks will be called \
     * The data is specific for each event
     * @param {String} event
     * @param  {...any} data
     * @static
     */
    static triggerEvent(event, ...data) {
        if (this.#eventListeners[event] === undefined) return;
        for (let callback of this.#eventListeners[event]) callback(...data);
    }
}
