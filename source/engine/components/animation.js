import { Time } from "../time.js";
import { Controller, Viewer } from "./component.js";

export class Animation {
    constructor(sprites, duration, shouldLoop = true) {
        this.sprites = sprites;
        this.frameDuration = duration / sprites.length;
        this.frameTimer = 0;
        this.currentFrame = 0;
        this.shouldLoop = shouldLoop;
    }

    update() {
        this.frameTimer += Time.deltaTime();
        if (this.frameTimer >= this.frameDuration) {
            this.frameTimer = 0;
            if (!this.shouldLoop && this.currentFrame == this.sprites.length - 1) return;
            this.currentFrame = (this.currentFrame + 1) % this.sprites.length;
        }
    }

    display(x, y, w, h) {
        this.sprites[this.currentFrame].display(x, y, w, h);
    }
}

export class AnimationSelector {
    animations = {};
    currentAnimation = "";

    setupPropertyCallbacks(propertyHolder) {}

    addAnimation(animation, animationName) {
        this.animations[animationName] = animation;
        if (this.currentAnimation == "") this.currentAnimation = animationName;
    }

    getAnimation() {
        return this.animations[this.currentAnimation];
    }
}

export class DirectionalAnimation extends AnimationSelector {
    directions = {};

    setupPropertyCallbacks(propertyHolder) {
        propertyHolder.addPropertyListener("direction", (newDirection) => this.updateDirection(newDirection));
    }

    addAnimation(animation, animationName, direction) {
        this.animations[animationName] = animation;
        this.directions[animationName] = direction.copy();
        if (this.currentAnimation == "") this.currentAnimation = animationName;
    }

    updateDirection(newDirection) {
        if (newDirection.isZero()) return;

        let mostSimilar = -1;
        let nextAnimation = this.currentAnimation;

        for (let animationName in this.directions) {
            let direction = this.directions[animationName];
            let similarity = direction.dot(newDirection);

            if (similarity > mostSimilar) {
                mostSimilar = similarity;
                nextAnimation = animationName;
            }
        }

        this.currentAnimation = nextAnimation;
    }
}

class AnimationPacemaker extends Controller {
    animation;

    start(animation) {
        this.animation = animation;
    }

    setAnimation(animation) {
        this.animation = animation;
    }

    update() {
        if (this.animation !== undefined) this.animation.update();
    }
}

export class AnimationTree extends Viewer {
    currentAnimationSelector = "";
    animationSelectors = {};
    // {"walkRight": AnimationSelector}
    transitions = {};
    // {"walkRight": [{target: "idle", event: "Release D"}]}
    pacemaker;

    properties = {};
    // {"direction": {value: 0, listeners: []}}

    start() {
        this.pacemaker = new AnimationPacemaker();
        this.gameObject.addComponent(this.pacemaker);
        this.transform = this.gameObject.getComponent("Transform");
    }

    addAnimationSelector(animationSelector, animationSelectorName) {
        if (animationSelectorName in this.animationSelectors) return;
        if (this.currentAnimationSelector == "") this.currentAnimationSelector = animationSelectorName;
        this.animationSelectors[animationSelectorName] = animationSelector;
        this.transitions[animationSelectorName] = [];
        animationSelector.setupPropertyCallbacks(this);
    }

    addTransition(fromAnimation, toAnimation, event) {
        if (!(fromAnimation in this.transitions)) return;
        this.transitions[fromAnimation].push({ target: toAnimation, event: event });
    }

    transition(event) {
        for (let transition of this.transitions[this.currentAnimationSelector]) {
            if (transition.event == event) {
                this.pacemaker.setAnimation(this.animationSelectors[this.currentAnimationSelector].getAnimation());
                this.currentAnimationSelector = transition.target;
            }
        }
    }

    display() {
        let animation = this.animationSelectors[this.currentAnimationSelector].getAnimation();
        if (animation === undefined) return;
        animation.display(this.transform.position.x, this.transform.position.y, this.transform.scale.x, this.transform.scale.y);
    }

    setProperty(property, value) {
        if (!(property in this.properties)) this.properties[property] = { value: 0, listeners: [] };
        this.properties[property].value = value;
        for (let callback of this.properties[property].listeners) callback(value);
    }

    addPropertyListener(property, callback) {
        if (!(property in this.properties)) this.properties[property] = { value: 0, listeners: [] };
        this.properties[property].listeners.push(callback);
    }
}

export class Animator extends Viewer {
    start(animation) {
        this.transform = this.gameObject.getComponent("Transform");
        this.animation = animation;
        this.gameObject.addComponent(new AnimationPacemaker(animation));
    }

    display() {
        this.animation.display(this.transform.position.x, this.transform.position.y, this.transform.scale.x, this.transform.scale.y);
    }
}
