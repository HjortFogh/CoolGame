import { Model } from "./component.js";

export const CollisionEvent = {
    onEnter: 0,
    onExit: 1,
};

class Collider extends Model {
    static colliderCounter = 0;
    identifier = 0;

    listeners = [];

    getBoundingBox() {}

    getIdentifier() {
        if (this.identifier === undefined) this.identifier = Collider.colliderCounter++;
        return this.identifier;
    }

    addListener(event, callback) {
        if (this.listeners[event] === undefined) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }
    triggerEvent(event) {
        this.listeners[event].forEach((callback) => callback());
    }

    setOverlappingColliders() {}
    // onCollisionEnter(gameObject) {}
    // onCollisionExit(gameObject) {}

    // isOverlapping (boundingBox)
}

export class BoxCollider extends Collider {}
export class CircleCollider extends Collider {}
// export class PolyCollider extends Collider {}

// Rect -> Rect - box check
// Circle -> Circle - box check, distance check via radii
// Rect -> Circle - box check, rect checks circles points
// Circle -> Rect - box check, circle checks rects points
