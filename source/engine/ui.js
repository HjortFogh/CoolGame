// Exports:
// - UIElement

import { Input } from "./input.js";
import { Vector, createVector } from "./vector.js";

/**
 * Element which is displayed on top of everything else \
 * All UIElement(s) are displayed in screenspace as opposed to worldspace such as GameObject(s)
 */
export class UIElement {
    /**
     * @type {Boolean}
     */
    #isInitialized = false;
    /**
     * @type {Boolean}
     */
    #shouldDisplay = true;
    /**
     * @type {Boolean}
     */
    #isMouseHovering = false;

    /**
     * @type {UIElement|undefined}
     */
    #parent;
    /**
     * @type {Array<UIElement>}
     */
    #children = [];

    /**
     * @type {Vector}
     */
    #position = createVector(0);
    /**
     * @type {Vector}
     */
    #size = createVector(50);

    /**
     * Gets called once when the UIElement is initialy started
     * @virtual
     */
    start() {}
    /**
     * Gets called every frame to display the UIElement
     * @virtual
     */
    displayElement() {}
    /**
     * Gets called when the mouse starts hovering over the element
     * @virtual
     */
    onHoverEnter() {}
    /**
     * Gets called when the mouse stops hovering over the element
     * @virtual
     */
    onHoverExit() {}
    /**
     * Gets called when the user presses the left mouse button
     * @virtual
     */
    onLeftPress() {}
    /**
     * Gets called when the user releases the left mouse button
     * @virtual
     */
    onLeftRelease() {}
    /**
     * Gets called when the user presses the right mouse button
     * @virtual
     */
    onRightPress() {}
    /**
     * Gets called when the user releases the right mouse button
     * @virtual
     */
    onRightRelease() {}

    /**
     * Initialize the UIElement
     * @param {UIElement|undefined} parent Parent UIElement of which this UIElement will be displayed relative to \
     * The default value is 'undefined', which means the UIElement will be drawn with origin at the top left corner
     * @returns
     */
    initialize(parent = undefined) {
        if (this.#isInitialized) return;
        this.#isInitialized = true;

        this.#parent = parent;
        for (let uiElement of this.#children) uiElement.initialize(this);
        this.start();
    }

    /**
     * Get position of the UIElement in screenspace coordinates
     * @returns {Vector}
     */
    getScreenspacePosition() {
        if (this.#parent !== undefined) return Vector.add(this.#parent.getPosition(), this.#position);
        return this.#position;
    }

    /**
     * Set the position of the UIElement
     * @param {Vector} position
     */
    setPosition(position) {
        if (!(position instanceof Vector)) {
            console.warn(`Position not a instance of Vector`);
            return;
        }
        this.#position = position;
    }

    /**
     * Returns the relative position compared to the parent UIElement
     * @returns {Vector}
     */
    getPosition() {
        return this.#position;
    }

    /**
     * Sets the size
     * @param {Vector} size
     */
    setSize(size) {
        if (!(size instanceof Vector)) {
            console.warn(`Size not a instance of Vector`);
            return;
        }
        this.#size = size;
    }

    /**
     * Get the size
     * @return {Vector}
     */
    getSize() {
        return this.#size;
    }

    /**
     * Sets whether the UIElement should be displayed
     * @param {Boolean} mode
     */
    enabled(mode) {
        if (typeof mode != "boolean") {
            console.warn(`Mode must be a boolean`);
            return;
        }
        this.#shouldDisplay = mode;
    }

    /**
     * Returns whether the mouse is currently hovering over the UIElement
     * @returns {Boolean}
     */
    isHovering() {
        let position = this.getScreenspacePosition();
        return mouseX > position.x && mouseX < position.x + this.#size.x && mouseY > position.y && mouseY < position.y + this.#size.y;
    }

    /**
     * Call the virtual methods for pressing and hovering
     */
    update() {
        if (this.isHovering()) {
            if (!this.#isMouseHovering) this.onHoverEnter();
            this.isMouseHovering = true;
        } else {
            if (this.#isMouseHovering) this.onHoverExit();
            this.isMouseHovering = false;
        }

        if (this.isHovering()) {
            if (Input.getPressed("left")) this.onLeftPress();
            if (Input.getReleased("left")) this.onLeftRelease();
            if (Input.getPressed("right")) this.onRightPress();
            if (Input.getReleased("right")) this.onRightRelease();
        }

        for (let uiElement of this.#children) uiElement.update();
    }

    /**
     * Display the UIElement and all children UIElement(s)
     */
    display() {
        if (!this.#shouldDisplay) return;

        push();
        translate(this.#position.x, this.#position.y);
        this.displayElement();
        for (let uiElement of this.#children) uiElement.display();
        pop();
    }

    /**
     * Adds a child UIElement
     * @param {UIElement} uiElement
     */
    addElement(uiElement) {
        if (!(uiElement instanceof UIElement)) {
            console.warn(`Cannot add Object not of type UIElement`);
            return;
        }

        this.#children.push(uiElement);
        if (this.#isInitialized) uiElement.initialize(this);
    }
}
