import * as Engine from "../../engine/engine.js";
import { DeathTransition } from "../scene_transitions.js";

import { Damageable } from "./damage.js";
import { EntityStat, HealthViewer } from "./entity.js";

const PLAYER_SCALE = Engine.createVector(50, 100);

class PlayerController extends Engine.Controller {
    start() {
        this.transform = this.gameObject.getComponent("Transform");
        this.transform.scale.set(PLAYER_SCALE);

        this.stat = this.gameObject.getComponent("EntityStat");
        this.stat.addDeathListener(() => this.onDeath());

        this.bulletPrefab = Engine.AssetManager.getAsset("basicBulletPrefab");
        // this.bulletTime = 0;

        this.animationTree = this.gameObject.getComponent("AnimationTree");
    }

    update() {
        let velocity = Engine.createVector(Engine.Input.getInput("d") - Engine.Input.getInput("a"), Engine.Input.getInput("s") - Engine.Input.getInput("w"));
        this.animationTree.setProperty("direction", velocity.normalize());
        velocity.mult(this.stat.speed * Engine.Time.deltaTime());
        this.transform.position.add(velocity);

        this.transform.rotation = Math.atan2(mouseY - height / 2, mouseX - width / 2);

        // if (Engine.Input.getInput("left") && this.bulletTime <= 0) {
        //     this.bulletTime = 0.05;
        //     let bullet = this.bulletPrefab.spawn();
        //     bullet.getComponent("BasicBulletController").fire(this.transform.position, this.transform.rotation - 0.1);
        //     bullet = this.bulletPrefab.spawn();
        //     bullet.getComponent("BasicBulletController").fire(this.transform.position, this.transform.rotation);
        //     bullet = this.bulletPrefab.spawn();
        //     bullet.getComponent("BasicBulletController").fire(this.transform.position, this.transform.rotation + 0.1);
        // }
        // this.bulletTime -= Engine.Time.deltaTime();

        if (Engine.Input.getReleased("e")) {
            for (let i = 0; i < 50; i++) {
                let bullet = this.bulletPrefab.spawn();
                let rotation = Math.random() * Math.PI * 2;
                bullet.getComponent("BasicBulletController").fire(this.gameObject, this.transform.position, rotation);
            }
        }
    }

    onDeath() {
        Engine.SceneManager.activeScene.pause();
        Engine.SceneManager.transition(new DeathTransition(4, 4), "GameOverScene");
        this.animationTree.transition("death");
        Engine.Events.triggerEvent("PlayerDied");
    }
}

export function createPlayer() {
    let controller = new PlayerController();

    let stat = new EntityStat({ baseHealth: 9, baseSpeed: 400 });
    let damageable = new Damageable(2);
    let collider = new Engine.RectCollider(PLAYER_SCALE);

    let playerAtlas = Engine.AssetManager.getAsset("PlayerSpriteAtlas");
    let sprites = playerAtlas.export();
    let viewer = new Engine.AnimationTree();
    viewer.setViewLayer(10);

    viewer.onInitialize(() => {
        let moveSelector = new Engine.DirectionalAnimation();

        moveSelector.addAnimation(new Engine.Animation(sprites.down, 1.4), "moveDown", Engine.createVector(0, 1));
        moveSelector.addAnimation(new Engine.Animation(sprites.downRight, 1.4), "moveDownRight", Engine.createVector(1, 1).normalize());
        moveSelector.addAnimation(new Engine.Animation(sprites.right, 1.4), "moveRight", Engine.createVector(1, 0));
        moveSelector.addAnimation(new Engine.Animation(sprites.upRight, 1.4), "moveUpRight", Engine.createVector(1, -1).normalize());
        moveSelector.addAnimation(new Engine.Animation(sprites.up, 1.4), "moveUp", Engine.createVector(0, -1));
        moveSelector.addAnimation(new Engine.Animation(sprites.upLeft, 1.4), "moveUpLeft", Engine.createVector(-1, -1).normalize());
        moveSelector.addAnimation(new Engine.Animation(sprites.left, 1.4), "moveLeft", Engine.createVector(-1, 0));
        moveSelector.addAnimation(new Engine.Animation(sprites.downLeft, 1.4), "moveDownLeft", Engine.createVector(-1, 1).normalize());

        let deathSelector = new Engine.AnimationSelector();

        deathSelector.addAnimation(new Engine.Animation([sprites[0]], 100), "moveDown");

        viewer.addAnimationSelector(moveSelector, "move");
        viewer.addAnimationSelector(deathSelector, "dead");

        viewer.addTransition("move", "dead", "death");
    });

    return Engine.createGameObject(controller, stat, damageable, collider, viewer, new HealthViewer());
}
