import * as Engine from "../../engine/engine.js";

import { Damageable } from "./damage.js";
import { EntityStat } from "./entity.js";

class PlayerController extends Engine.Controller {
    start() {
        this.transform = this.gameObject.getComponent("Transform");
        this.transform.scale.set(Engine.createVector(50, 100));
        this.bulletPrefab = Engine.AssetManager.getAsset("BulletPrefab");
        this.bulletTime = 0;
        this.animationTree = this.gameObject.getComponent("AnimationTree");
    }

    update() {
        let velocity = Engine.createVector(Engine.Input.getInput("d") - Engine.Input.getInput("a"), Engine.Input.getInput("s") - Engine.Input.getInput("w"));
        this.animationTree.setProperty("direction", velocity.normalize());
        velocity.mult(500 * Engine.Time.deltaTime());
        this.transform.position.add(velocity);

        this.transform.rotation = Math.atan2(mouseY - height / 2, mouseX - width / 2);

        if (Engine.Input.getInput("left") && this.bulletTime <= 0) {
            this.bulletTime = 0.05;
            let bullet = this.bulletPrefab.spawn();
            bullet.getComponent("BasicBulletController").fire(this.transform.position, this.transform.rotation - 0.1);
            bullet = this.bulletPrefab.spawn();
            bullet.getComponent("BasicBulletController").fire(this.transform.position, this.transform.rotation);
            bullet = this.bulletPrefab.spawn();
            bullet.getComponent("BasicBulletController").fire(this.transform.position, this.transform.rotation + 0.1);
        }
        this.bulletTime -= Engine.Time.deltaTime();

        if (Engine.Input.getReleased("e")) {
            for (let i = 0; i < 50; i++) {
                let bullet = this.bulletPrefab.spawn();
                let rotation = Math.random() * Math.PI * 2;
                bullet.getComponent("BasicBulletController").fire(this.transform.position, rotation);
            }
        }
    }
}

class PlayerViewer extends Engine.Viewer {
    start() {
        this.transform = this.gameObject.getComponent("Transform");
        this.transform.scale.set(Engine.createVector(40));
        this.setViewLayer(10);
    }

    display() {
        fill(80, 130, 230);
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

export function createPlayer() {
    let controller = new PlayerController();
    let stat = new EntityStat();
    let damageable = new Damageable();

    let playerAtlas = Engine.AssetManager.getAsset("PlayerSpriteAtlas");
    let sprites = playerAtlas.export();
    let viewer = new Engine.AnimationTree();
    viewer.setViewLayer(10);

    viewer.onInitialize(() => {
        let moveSelector = new Engine.DirectionalAnimation();

        moveSelector.addAnimation(new Engine.Animation([sprites[0]], 100), "moveDown", Engine.createVector(0, 1));
        moveSelector.addAnimation(new Engine.Animation([sprites[1]], 100), "moveDownRight", Engine.createVector(1, 1).normalize());
        moveSelector.addAnimation(new Engine.Animation([sprites[2]], 100), "moveRight", Engine.createVector(1, 0));
        moveSelector.addAnimation(new Engine.Animation([sprites[3]], 100), "moveUpRight", Engine.createVector(1, -1).normalize());
        moveSelector.addAnimation(new Engine.Animation([sprites[4]], 100), "moveUp", Engine.createVector(0, -1));
        moveSelector.addAnimation(new Engine.Animation([sprites[5]], 100), "moveUpLeft", Engine.createVector(-1, -1).normalize());
        moveSelector.addAnimation(new Engine.Animation([sprites[6]], 100), "moveLeft", Engine.createVector(-1, 0));
        moveSelector.addAnimation(new Engine.Animation([sprites[7]], 100), "moveDownLeft", Engine.createVector(-1, 1).normalize());

        viewer.addAnimationSelector(moveSelector, "move");
    });

    return Engine.createGameObject(controller, viewer, stat, damageable);
}
