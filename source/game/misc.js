// Exports:
// - Button
// - DeathTransition
// - BasicSceneTransition

import { Engine } from "../engine/engine.js";

/**
 * Button which can be clicked and displays text
 */
export class Button extends Engine.UIElement {
    /**
     * @type {String}
     */
    #displayText = "";

    /**
     * Display the button and text
     */
    displayElement() {
        let size = this.getSize();
        let yOffset = this.isHovering() ? -5 : 0;

        noStroke();
        if (this.isHovering()) fill(220);
        else fill(180);

        rect(0, yOffset, size.x, size.y);

        strokeWeight(2);
        stroke(255);
        fill(255);
        textFont("monospace");
        textSize(40);
        textAlign(CENTER, CENTER);

        text(this.#displayText, size.x / 2, yOffset + size.y / 2);
    }

    /**
     * Sets the displayed text
     * @param {String} text
     */
    setText(text) {
        this.#displayText = text;
    }
}

/**
 * Transition displayed when the player dies
 */
export class DeathTransition extends Engine.SceneTransition {
    /**
     * Display the death transition
     * @param {Float} p Percent done
     */
    display(p) {
        noStroke();
        fill(70, 255 * p ** 5);
        rect(0, 0, width, height);
    }
}

/**
 * Transition when Scene(s) are swiched
 */
export class BasicSceneTransition extends Engine.SceneTransition {
    /**
     * Display the scene transition
     * @param {Float} p Percent done
     */
    display(p) {
        noStroke();
        if (!this.hasChanged()) {
            fill(0);
            rect(0, 0, width * p * 2, height);
        } else {
            fill(0, (2 - p * 2) * 255);
            rect(0, 0, width, height);
        }
    }
}
