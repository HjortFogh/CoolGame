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
        this.gameObject = parentGameObject;
        this.start(...this.args);
        this.isComponentInitialized = true;
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
        this.viewLayer = Math.max(newLayer, 0);
    }

    display() {}
}
export class Controller extends Component {
    update() {}
}
