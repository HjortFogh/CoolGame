import { createRect, lerpPoint, pointWithinRect } from "../point.js";
import { createVector } from "../vector.js";
import { SpatialManager } from "../spatial_partitioning.js";
import { Controller } from "./component.js";

export const CollisionEvent = {
    onEnter: 0,
    onExit: 1,
};

class Collider extends Controller {
    static colliderCounter = 0;
    transform;
    listeners = [];
    verticies = [];
    currentlyColliding = new Map();
    lastColliding = new Map();
    identifier = -1;
    aabb;

    containsPoint(point) {}

    getIdentifier() {
        if (this.identifier != -1) return this.identifier;
        this.identifier = Collider.colliderCounter++;
        return this.identifier;
    }

    addListener(event, callback) {
        if (this.listeners[event] === undefined) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    triggerEvent(event, collider) {
        if (this.listeners[event] === undefined) return;
        this.listeners[event].forEach((callback) => callback(collider));
    }

    update() {
        // let aabbGlobal = this.toGlobalSpaceRect(this.aabb);
        let aabbDoubleGlobal = this.toGlobalSpaceRect(createRect(this.aabb.x * 2, this.aabb.y * 2, this.aabb.w * 2, this.aabb.h * 2));
        let gameObjects = SpatialManager.get(aabbDoubleGlobal);

        for (let gameObject of gameObjects) {
            let colliders = gameObject.getComponentsRecursive("Collider");
            for (let collider of colliders) {
                if (collider === this) continue;

                if (collider.containsPoint(this.transform.position)) {
                    this.collide(collider);
                    collider.collide(this);
                    break;
                }
                for (let vertex of this.verticies) {
                    if (collider.containsPoint(this.toGlobalSpacePoint(vertex))) {
                        this.collide(collider);
                        collider.collide(this);
                        break;
                    }
                }
            }
        }

        for (let [key, value] of this.currentlyColliding) {
            if (!this.lastColliding.has(key)) this.triggerEvent(CollisionEvent.onEnter, value);
        }

        for (let [key, value] of this.lastColliding) {
            if (!this.currentlyColliding.has(key)) this.triggerEvent(CollisionEvent.onExit, value);
        }

        this.lastColliding = this.currentlyColliding;
        this.currentlyColliding = new Map();
    }

    collide(collider) {
        let id = collider.getIdentifier();
        if (!this.currentlyColliding.has(id)) this.currentlyColliding.set(id, collider);
    }

    getBoundingBox() {
        return this.aabb;
    }

    toLocalSpacePoint(point) {
        return createVector(point.x - this.transform.position.x, point.y - this.transform.position.y);
    }

    toGlobalSpacePoint(point) {
        return createVector(this.transform.position.x + point.x, this.transform.position.y + point.y);
    }

    toGlobalSpaceRect(rect) {
        return createRect(this.transform.position.x + rect.x, this.transform.position.y + rect.y, rect.w, rect.h);
    }
}

export class RectCollider extends Collider {
    start(scale = createVector(50, 50)) {
        this.transform = this.gameObject.getComponent("Transform");
        this.aabb = createRect(-scale.x / 2, -scale.y / 2, scale.x, scale.y);

        // TODO: redo vert calculation based on scale

        let A = createVector(-scale.x / 2, -scale.y / 2), // TOPLEFT
            B = createVector(-scale.x / 2, +scale.y / 2), // BOTLEFT
            C = createVector(+scale.x / 2, +scale.y / 2), // BOTRIGHT
            D = createVector(+scale.x / 2, -scale.y / 2); // TOPRIGHT

        this.verticies = [A, B, C, D];

        let xNum = Math.floor(scale.x * 0.06);
        let yNum = Math.floor(scale.y * 0.06);

        for (let x = 0; x < xNum; x++) {
            this.verticies.push(lerpPoint(A, D, x / xNum));
            this.verticies.push(lerpPoint(B, C, x / xNum));
        }
        for (let y = 0; y < yNum; y++) {
            this.verticies.push(lerpPoint(A, B, y / yNum));
            this.verticies.push(lerpPoint(C, D, y / yNum));
        }
    }

    containsPoint(point) {
        return pointWithinRect(this.toLocalSpacePoint(point), this.aabb);
    }
}

export class CircleCollider extends Collider {
    radius;

    start(radius = 50) {
        this.transform = this.gameObject.getComponent("Transform");
        this.radius = radius;
        this.aabb = createRect(-radius, -radius, radius * 2, radius * 2);

        let numPoints = Math.floor(0.4 * this.radius);
        for (let i = 0; i < numPoints; i++) {
            let angle = (TWO_PI / numPoints) * i;
            this.verticies.push(createVector(cos(angle) * this.radius, sin(angle) * this.radius));
        }
    }

    containsPoint(point) {
        let localSpacePoint = this.toLocalSpacePoint(point);
        return localSpacePoint.x ** 2 + localSpacePoint.y ** 2 <= this.radius ** 2;
    }
}

// export class PolyCollider extends Collider {}
