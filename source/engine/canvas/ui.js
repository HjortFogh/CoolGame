import { Input } from "../input.js";
// import { pointWithinRect } from "../point.js";
import { Vector, createVector } from "../vector.js";

const DEFAULT_STYLE = {
    fillColor: [0, 0, 0, 255],
    borderColor: [0, 0, 0, 255],
    visible: true,
};

class UIElement {
    args = [];

    isInitialized = false;
    shouldDisplay = true;

    style = {};
    children = [];

    offset = createVector(0);
    size = createVector(50);

    eventListeners = {};

    isMouseHovering = false;

    start() {}
    updateElement(position) {}
    displayElement(position) {}

    constructor(...args) {
        this.args = args;
    }

    initialize() {
        if (this.isInitialized) return;
        for (let uiElement of this.children) uiElement.initialize();
        this.setStyle(DEFAULT_STYLE);
        this.start(...this.args);
        this.isInitialized = true;
    }

    setStyle(style) {
        this.style = style;
        for (let key of Object.keys(DEFAULT_STYLE)) {
            if (!(key in style)) {
                this.style[key] = DEFAULT_STYLE[key];
            }
        }
    }

    enabled(mode) {
        this.shouldDisplay = mode;
    }

    isHovering(position) {
        return mouseX > position.x && mouseX < position.x + this.size.x && mouseY > position.y && mouseY < position.y + this.size.y;
    }

    handleHoverEvents(position) {
        if (this.isHovering(position)) {
            if (!this.isMouseHovering) {
                this.isMouseHovering = true;
                this.triggerEvent("HoverEnter");
            }
        } else {
            if (this.isMouseHovering) {
                this.isMouseHovering = false;
                this.triggerEvent("HoverExit");
            }
        }
    }

    update(position = createVector(0)) {
        let nextPosition = Vector.add(position, this.offset);

        this.handleHoverEvents(nextPosition);

        this.updateElement(nextPosition);
        for (let uiElement of this.children) uiElement.update(nextPosition);
    }

    display(position = createVector(0)) {
        if (!this.shouldDisplay) return;

        let nextPosition = Vector.add(position, this.offset);

        if (this.style.visible) this.displayElement(nextPosition);
        for (let uiElement of this.children) uiElement.display(nextPosition);
    }

    addElement(uiElement) {
        this.children.push(uiElement);
        if (this.isInitialized) uiElement.initialize();
    }

    addEventListener(event, callback) {
        if (this.eventListeners[event] === undefined) this.eventListeners[event] = [];
        this.eventListeners[event].push(callback);
    }

    triggerEvent(event, ...data) {
        if (this.eventListeners[event] === undefined) return;
        for (let callback of this.eventListeners[event]) callback(...data);
    }
}

class UISurface extends UIElement {
    start(offset, size) {
        this.offset = offset;
        this.size = size;
    }

    displayElement(position) {
        // stroke(this.style.borderColor);
        // fill(this.style.fillColor);
        fill(0);
        rect(position.x, position.y, this.size.x, this.size.y);
    }
}

class UIButton extends UIElement {
    start(offset, size) {
        this.offset = offset;
        this.size = size;
    }

    updateElement(position) {
        if (this.isHovering(position)) {
            if (Input.getPressed("left")) this.triggerEvent("LeftMousePressed");
            if (Input.getReleased("left")) this.triggerEvent("LeftMouseReleased");
            if (Input.getPressed("right")) this.triggerEvent("RightMousePressed");
            if (Input.getReleased("right")) this.triggerEvent("RightMouseReleased");
        }
    }

    displayElement(position) {
        // stroke(this.style.borderColor);
        // fill(this.style.fillColor);
        fill(255);
        rect(position.x, position.y, this.size.x, this.size.y);
    }
}

class UIText extends UIElement {
    // text = "";
    // xOffset = 0;
    // yOffset = 0;
    // start(text, xOffset, yOffset) {
    //     this.text = text;
    //     this.xOffset = xOffset;
    //     this.yOffset = yOffset;
    // }
    // display(x, y) {
    //     if (!this.isVisible) return;
    //     stroke(this.style.borderColor);
    //     fill(this.style.fillColor);
    //     text(this.text, x + this.xOffset, y + this.yOffset);
    // }
}

let UI = {
    Element: UIElement,
    Surface: UISurface,
    Button: UIButton,
    Text: UIText,
};
export { UI };
