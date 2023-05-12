/**
 * Handles keyboard and mouse input
 */
export class Input {
    static userInput = {};
    static userInputPressed = {};
    static userInputReleased = {};

    /**
     * Stores the previous user input
     */
    static tick() {
        this.userInputPressed = {};
        this.userInputReleased = {};
    }

    /**
     * Sets the key as pressed
     * @param {String} key Key which has been pressed
     */
    static keyPressed(key) {
        this.userInputPressed[key.toLowerCase()] = true;
        this.userInput[key.toLowerCase()] = true;
    }

    /**
     * Sets the key as released
     * @param {String} key Key which has been released
     */
    static keyReleased(key) {
        try {
            this.userInputReleased[key.toLowerCase()] = true;
            this.userInput[key.toLowerCase()] = false;
        } catch {
            console.log(key);
        }
    }

    /**
     * Returns whether key is currently pressed
     * @param {String} key Key to check
     * @returns {Boolean}
     */
    static getInput(key) {
        key = key.toLowerCase();
        return this.userInput[key] !== undefined ? this.userInput[key] : false;
    }

    /**
     * Checks if key has been pressed this frame. This is only true for one frame
     * @param {String} key Key to check
     * @returns {Boolean}
     */
    static getPressed(key) {
        return this.userInputPressed[key] !== undefined ? this.userInputPressed[key] : false;
    }

    /**
     * Checks if key has been released this frame. This is only true for one frame
     * @param {String} key Key to check
     * @returns {Boolean}
     */
    static getReleased(key) {
        return this.userInputReleased[key] !== undefined ? this.userInputReleased[key] : false;
    }
}
