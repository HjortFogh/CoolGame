import { InputManager } from "../engine/input.js";
import { Controller, Transform, Viewer } from "../engine/object.js";
import { SceneManager } from "../engine/scene.js";
import { Time } from "../engine/time.js";

export class BulletController extends Controller {
    start() {
        this.transform = this.gameObject.getComponent(Transform);
        // print("Bullet:", this.transform);
        this.velocity = createVector(0, 0);
        setTimeout(this.gameObject.destroy, 10000);
    }

    fire(dir) {
        // this.velocity.x = cos(dir) * 500;
        // this.velocity.y = sin(dir) * 500;
        this.velocity.x = cos(dir) * 50;
        this.velocity.y = sin(dir) * 50;
    }

    update() {
        this.transform.position.x += this.velocity.x * Time.deltaTime();
        this.transform.position.y += this.velocity.y * Time.deltaTime();
    }
}

export class BulletViewer extends Viewer {
    start() {
        this.transform = this.gameObject.getComponent(Transform);
    }

    display() {
        fill(0);
        circle(this.transform.position.x, this.transform.position.y, 10);
    }
}

export class PlayerController extends Controller {
    start() {
        this.transform = this.gameObject.getComponent(Transform);
        this.bulletPrefab = SceneManager.activeScene.getGamePrefab("BulletPrefab");
    }

    shoot() {
        let bulletInstance = this.bulletPrefab.spawn();
        let transform = bulletInstance.getComponent(Transform);
        transform.position = this.transform.position.copy();
        let bullet = bulletInstance.getComponent(BulletController);
        bullet.fire(this.transform.rotation);
    }

    update() {
        let velocity = createVector(
            InputManager.getInput("d") - InputManager.getInput("a"),
            InputManager.getInput("s") - InputManager.getInput("w")
        );
        this.transform.position.add(velocity.setMag(300 * Time.deltaTime()));
        this.transform.rotation = atan2(mouseY - height / 2, mouseX - width / 2);

        if (InputManager.getInput("e")) this.shoot();
    }
}

export class PlayerViewer extends Viewer {
    start() {
        this.transform = this.gameObject.getComponent(Transform);
    }

    display() {
        let pos = this.transform.position;
        let rot = this.transform.rotation;

        let size = 25;

        let x1 = pos.x + cos(rot) * size * 1.5;
        let y1 = pos.y + sin(rot) * size * 1.5;
        let x2 = pos.x + cos(rot + TWO_PI / 3) * size;
        let y2 = pos.y + sin(rot + TWO_PI / 3) * size;
        let x3 = pos.x + cos(rot + (TWO_PI / 3) * 2) * size;
        let y3 = pos.y + sin(rot + (TWO_PI / 3) * 2) * size;

        fill(200, 140, 80);
        triangle(x1, y1, x2, y2, x3, y3);
    }
}
