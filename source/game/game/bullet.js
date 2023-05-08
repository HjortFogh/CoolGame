import * as Engine from "../../engine/engine.js";

class BulletViewer extends Engine.Viewer {
    start() {
        this.transform = this.gameObject.getComponent("Transform");
        this.transform.scale.set(Engine.createVector(10));
        this.setViewLayer(5);
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

class BasicBulletController extends Engine.Controller {
    transform;
    shooter;
    speed = 400;

    start() {
        this.transform = this.gameObject.getComponent("Transform");

        let collider = this.gameObject.getComponent("RectCollider");
        if (collider !== undefined) collider.addListener("onEnter", (collider) => this.onCollision(collider));

        Engine.Time.createTimer(() => this.gameObject.destroy(), 5);
    }

    update() {
        let velocity = Engine.createVector(Math.cos(this.transform.rotation), Math.sin(this.transform.rotation));
        this.transform.position.add(velocity.mult(this.speed * Engine.Time.deltaTime()));
    }

    fire(shooter, position, angle, damage = 1, speed = this.speed) {
        this.shooter = shooter;
        this.transform.position = position.copy();
        this.transform.rotation = angle;
        this.damage = damage;
        this.speed = speed;
    }

    onCollision(collider) {
        let damageable = collider.gameObject.getComponent("Damageable");
        if (damageable !== undefined && collider.gameObject !== this.shooter) {
            damageable.damage(this.damage);
            this.gameObject.destroy();
        }
    }
}

export function createBasicBullet() {
    let bulletSize = Engine.createVector(10);

    let viewer = new BulletViewer();
    let controller = new BasicBulletController();
    let collider = new Engine.RectCollider(bulletSize);

    return Engine.createGameObject(viewer, controller, collider);
}

export function createHomingBullet() {
    let bulletSize = Engine.createVector(10);

    let viewer = new BulletViewer();
    let controller = new BasicBulletController();
    let collider = new Engine.RectCollider(bulletSize);

    return Engine.createGameObject(viewer, controller, collider);
}
