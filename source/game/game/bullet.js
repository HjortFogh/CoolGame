import * as Engine from "../../engine/engine.js";

class BulletViewer extends Engine.Viewer {
    start() {
        this.transform = this.gameObject.getComponent("Transform");
        this.transform.scale.set(Engine.createVector(10));
    }

    display() {
        noStroke();
        fill(0);
        let x = this.transform.position.x;
        let y = this.transform.position.y;
        let a = this.transform.rotation;
        let s = this.transform.scale.x;

        let x1 = x + Math.cos(a) * s;
        let y1 = y + Math.sin(a) * s;
        let x2 = x + Math.cos(a + (Math.PI * 2) / 3) * s * 0.7;
        let y2 = y + Math.sin(a + (Math.PI * 2) / 3) * s * 0.7;
        let x3 = x + Math.cos(a + (Math.PI * 4) / 3) * s * 0.7;
        let y3 = y + Math.sin(a + (Math.PI * 4) / 3) * s * 0.7;
        triangle(x1, y1, x2, y2, x3, y3);
    }
}

export class BasicBulletController extends Engine.Controller {
    start(speed = 200) {
        this.transform = this.gameObject.getComponent("Transform");
        this.speed = speed;
        this.velocity = Engine.createVector(0, 0);
        Engine.Time.createTimer(() => this.gameObject.destroy(), 5);
        let collider = this.gameObject.getComponent("RectCollider");
        if (collider !== undefined) collider.addListener(Engine.CollisionEvent.onEnter, (collider) => this.onCollision(collider));
    }

    update() {
        this.transform.position.x += this.velocity.x * Engine.Time.deltaTime();
        this.transform.position.y += this.velocity.y * Engine.Time.deltaTime();
    }

    fire(position, angle) {
        this.transform.position = position.copy();
        this.velocity = Engine.createVector(cos(angle) * this.speed, sin(angle) * this.speed);
        this.transform.rotation = angle;
    }

    onCollision(collider) {
        let damageable = collider.gameObject.getComponent("Damageable");
        if (damageable !== undefined) {
            damageable.damage(1);
            this.gameObject.destroy();
        }
    }
}

export function createBullet() {
    let collider = new Engine.RectCollider(Engine.createVector(10));
    return Engine.createGameObject(new BulletViewer(), new BasicBulletController(), collider);
}
