export class Component {
    gameObject;
    args = [];

    isInitialized = false;

    start() {}

    constructor(...args) {
        this.args = args;
    }

    initialize(parentGameObject) {
        if (this.isInitialized) throw `Component: '${this.constructor.name}' already initialized`;
        this.gameObject = parentGameObject;
        this.start(...this.args);
        this.isInitialized = true;
    }

    restart() {
        if (!this.isInitialized) throw `Cannot reset Component: '${this.constructor.name}' before it is initialized`;
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
