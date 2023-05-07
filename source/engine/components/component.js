export class Component {
    gameObject;
    args = [];
    onInitCallbacks = [];

    isComponentInitialized = false;

    start() {}

    constructor(...args) {
        this.args = args;
    }

    initialize(parentGameObject) {
        if (this.isComponentInitialized) return;
        this.isComponentInitialized = true;

        this.gameObject = parentGameObject;
        this.start(...this.args);

        for (let callback of this.onInitCallbacks) callback();
    }

    isInitialized() {
        return this.isComponentInitialized;
    }

    onInitialize(callback) {
        this.onInitCallbacks.push(callback);
    }

    restart() {
        if (!this.isComponentInitialized) throw `Cannot reset Component: '${this.constructor.name}' before it is initialized`;
        this.start(...this.args);
    }

    copy() {
        return new this.constructor(...this.args);
    }
}

export class Model extends Component {}
export class Viewer extends Component {
    viewLayer = 0;

    setViewLayer(newLayer) {
        this.viewLayer = Math.min(Math.max(newLayer, 0), 50);
    }

    getViewLayer() {
        return this.viewLayer;
    }

    display() {}
}
export class Controller extends Component {
    update() {}
}
