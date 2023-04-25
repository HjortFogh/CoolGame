import { Input } from "../input.js";

const DEFAULT_STYLE = {
    fillColor: [0, 0, 0, 255],
    borderColor: [0, 0, 0, 255],
};

class UIElement {
    isVisible = true;

    style = {};
    eventListeners = {};

    args = [];

    constructor(style, ...args) {
        this.style = style;
        for (let key of Object.keys(DEFAULT_STYLE)) {
            if (!(key in style)) {
                this.style[key] = DEFAULT_STYLE[key];
            }
        }

        this.args = args;
    }

    initialize() {
        this.start(...this.args);
    }
    start() {}

    update() {}
    display(x = 0, y = 0) {}

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
    uiElements = [];
    xOffset;
    yOffset;
    width;
    height;

    start(xOffset = 0, yOffset = 0, width = 50, height = 50) {
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.width = width;
        this.height = height;

        for (let uiElement of this.uiElements) {
            uiElement.initialize();
        }
    }

    update(x = 0, y = 0) {
        for (let uiElement of this.uiElements) {
            uiElement.update(this.xOffset + x, this.yOffset + y);
        }
    }

    display(x = 0, y = 0) {
        if (!this.isVisible) return;
        stroke(this.style.borderColor);
        fill(this.style.fillColor);
        rect(this.xOffset + x, this.yOffset + y, this.width, this.height);
        for (let uiElement of this.uiElements) {
            uiElement.display(this.xOffset + x, this.yOffset + y);
        }
    }

    addUIElement(uiElement) {
        this.uiElements.push(uiElement);
    }
}

class UIButton extends UIElement {
    start(xOffset = 0, yOffset = 0, width = 50, height = 50) {
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.width = width;
        this.height = height;
    }

    update(x = 0, y = 0) {
        if (mouseX < x + this.xOffset + this.width && mouseX > x + this.xOffset && mouseY < x + this.yOffset + this.height && mouseY > y + this.yOffset) {
            if (Input.getPressed("left")) this.triggerEvent("LeftMousePressed");
            if (Input.getReleased("left")) this.triggerEvent("LeftMouseReleased");
        }
    }

    display(x = 0, y = 0) {
        if (!this.isVisible) return;
        stroke(this.style.borderColor);
        fill(this.style.fillColor);
        rect(this.xOffset + x, this.yOffset + y, this.width, this.height);
    }
}

class UIText extends UIElement {
    text = "";
    xOffset = 0;
    yOffset = 0;

    start(text, xOffset, yOffset) {
        this.text = text;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
    }

    display(x, y) {
        if (!this.isVisible) return;
        stroke(this.style.borderColor);
        fill(this.style.fillColor);
        text(this.text, x + this.xOffset, y + this.yOffset);
    }
}

let UI = {
    Surface: UISurface,
    Button: UIButton,
    Text: UIText,
};
export { UI };
