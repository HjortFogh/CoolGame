// Components

export class Component {
    gameObject;

    initialize(gameObject) {
        this.gameObject = gameObject;
    }
    start() {}
}

export class Viewer extends Component {
    display() {}
}

export class Controller extends Component {
    update() {}
}

export class Model extends Component {}

// Transform

export class Transform extends Model {
    position;
    rotation;

    constructor(pos = createVector(0, 0), rot = 0) {
        super();
        this.position = pos;
        this.rotation = rot;
    }
}
