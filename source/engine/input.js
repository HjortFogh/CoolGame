//TODO: Make work with mouse pressing

/**
 * Handles keyboard and mouse input
 */
export class InputManager {
    static previousUserInput = {};
    static userInput = {};

    /**
     * Stores the previous user input
     */
    static tick() {
        this.previousUserInput = structuredClone(this.userInput);
    }

    /**
     * Sets the key as pressed
     * @param {String} key Key which has been pressed
     */
    static keyPressed(key) {
        this.userInput[key] = true;
    }

    /**
     * Sets the key as released
     * @param {String} key Key which has been released
     */
    static keyReleased(key) {
        this.userInput[key] = false;
    }

    /**
     * Returns whether key is currently pressed
     * @param {String} key Key to check
     * @returns {Boolean}
     */
    static getInput(key) {
        return this.userInput[key] !== undefined ? this.userInput[key] : false;
    }

    /**
     * Returns whether key was pressed last frame
     * @param {String} key Key to check
     * @returns {Boolean}
     */
    static getPreviousInput(key) {
        return this.previousUserInput[key] !== undefined ? this.previousUserInput[key] : false;
    }

    /**
     * Checks if key has been pressed this frame. This is only true for one frame
     * @param {String} key Key to check
     * @returns {Boolean}
     */
    static getPressed(key) {
        return this.getInput(key) && !this.getPreviousInput(key);
    }

    /**
     * Checks if key has been released this frame. This is only true for one frame
     * @param {String} key Key to check
     * @returns {Boolean}
     */
    static getReleased(key) {
        return !this.getInput(key) && this.getPreviousInput(key);
    }
}
