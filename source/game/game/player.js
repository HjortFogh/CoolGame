import { Engine } from "../../engine/engine.js";

import { Damageable } from "./damage.js";
import { EntityStat } from "./entity.js";

const PLAYER_SCALE = Engine.createVector(65, 130);

class PlayerController extends Engine.Controller {
    start() {
        this.transform = this.gameObject.getComponent("Transform");
        this.transform.scale.set(PLAYER_SCALE);

        this.stat = this.gameObject.getComponent("EntityStat");
        this.stat.addEventListener("death", () => this.onDeath());
        this.stat.addEventListener("damage", (damageAmount) => Engine.Events.triggerEvent("player/damage", damageAmount));

        this.bulletPrefab = Engine.AssetManager.getAsset("basicBulletPrefab");
        // this.bulletTime = 0;

        console.log("Start");

        this.animationTree = this.gameObject.getComponent("AnimationTree");
        Engine.Events.addEventListener("game/started", () => this.gameObject.restart());
    }

    restart() {
        this.transform.scale.set(PLAYER_SCALE);
        this.animationTree.setProperty("direction", Engine.createVector(0, 1));
    }

    update() {
        let velocity = Engine.createVector(Engine.Input.getInput("d") - Engine.Input.getInput("a"), Engine.Input.getInput("s") - Engine.Input.getInput("w"));
        this.animationTree.setProperty("direction", velocity.normalize());
        if (!velocity.isZero()) this.animationTree.transition("move");
        else this.animationTree.transition("idle");
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
        this.animationTree.transition("death");
        Engine.Events.triggerEvent("player/died");
    }
}

export function createPlayer() {
    let controller = new PlayerController();

    let stat = new EntityStat({ baseHealth: 2, baseSpeed: 400 });
    stat.setTag("Player");
    let damageable = new Damageable(2);
    let collider = new Engine.RectCollider(PLAYER_SCALE);

    let viewer = new Engine.AnimationTree();
    viewer.setViewLayer(10);

    viewer.onInitialize(() => {
        // Idle animation

        let idleSelector = new Engine.DirectionalAnimation();
        let playerIdleAnimation = Engine.AssetManager.getAsset("playerIdleAnimation").export();

        idleSelector.addAnimation(new Engine.Animation(playerIdleAnimation.down, 1.4), "idleDown", Engine.createVector(0, 1));
        idleSelector.addAnimation(new Engine.Animation(playerIdleAnimation.downRight, 1.4), "idleDownRight", Engine.createVector(1, 1).normalize());
        idleSelector.addAnimation(new Engine.Animation(playerIdleAnimation.right, 1.4), "idleRight", Engine.createVector(1, 0));
        idleSelector.addAnimation(new Engine.Animation(playerIdleAnimation.upRight, 1.4), "idleUpRight", Engine.createVector(1, -1).normalize());
        idleSelector.addAnimation(new Engine.Animation(playerIdleAnimation.up, 1.4), "idleUp", Engine.createVector(0, -1));
        idleSelector.addAnimation(new Engine.Animation(playerIdleAnimation.upLeft, 1.4), "idleUpLeft", Engine.createVector(-1, -1).normalize());
        idleSelector.addAnimation(new Engine.Animation(playerIdleAnimation.left, 1.4), "idleLeft", Engine.createVector(-1, 0));
        idleSelector.addAnimation(new Engine.Animation(playerIdleAnimation.downLeft, 1.4), "idleDownLeft", Engine.createVector(-1, 1).normalize());

        viewer.addAnimationSelector(idleSelector, "idle");

        // Move animation

        let moveSelector = new Engine.DirectionalAnimation();
        let playerMoveAnimation = Engine.AssetManager.getAsset("playerMoveAnimation").export();

        moveSelector.addAnimation(new Engine.Animation(playerMoveAnimation.down, 1.4), "moveDown", Engine.createVector(0, 1));
        moveSelector.addAnimation(new Engine.Animation(playerMoveAnimation.downRight, 1.4), "moveDownRight", Engine.createVector(1, 1).normalize());
        moveSelector.addAnimation(new Engine.Animation(playerMoveAnimation.right, 1.4), "moveRight", Engine.createVector(1, 0));
        moveSelector.addAnimation(new Engine.Animation(playerMoveAnimation.upRight, 1.4), "moveUpRight", Engine.createVector(1, -1).normalize());
        moveSelector.addAnimation(new Engine.Animation(playerMoveAnimation.up, 1.4), "moveUp", Engine.createVector(0, -1));
        moveSelector.addAnimation(new Engine.Animation(playerMoveAnimation.upLeft, 1.4), "moveUpLeft", Engine.createVector(-1, -1).normalize());
        moveSelector.addAnimation(new Engine.Animation(playerMoveAnimation.left, 1.4), "moveLeft", Engine.createVector(-1, 0));
        moveSelector.addAnimation(new Engine.Animation(playerMoveAnimation.downLeft, 1.4), "moveDownLeft", Engine.createVector(-1, 1).normalize());

        viewer.addAnimationSelector(moveSelector, "move");

        // Dash animation

        // let dashSelector = new Engine.DirectionalAnimation();
        // let playerDashAnimation = Engine.AssetManager.getAsset("playerDashAnimation").export();

        // dashSelector.addAnimation(new Engine.Animation(sprites.down, 1.4), "dashDown", Engine.createVector(0, 1));
        // dashSelector.addAnimation(new Engine.Animation(sprites.downRight, 1.4), "dashDownRight", Engine.createVector(1, 1).normalize());
        // dashSelector.addAnimation(new Engine.Animation(sprites.right, 1.4), "dashRight", Engine.createVector(1, 0));
        // dashSelector.addAnimation(new Engine.Animation(sprites.upRight, 1.4), "dashUpRight", Engine.createVector(1, -1).normalize());
        // dashSelector.addAnimation(new Engine.Animation(sprites.up, 1.4), "dashUp", Engine.createVector(0, -1));
        // dashSelector.addAnimation(new Engine.Animation(sprites.upLeft, 1.4), "dashUpLeft", Engine.createVector(-1, -1).normalize());
        // dashSelector.addAnimation(new Engine.Animation(sprites.left, 1.4), "dashLeft", Engine.createVector(-1, 0));
        // dashSelector.addAnimation(new Engine.Animation(sprites.downLeft, 1.4), "dashDownLeft", Engine.createVector(-1, 1).normalize());

        // viewer.addAnimationSelector(dashSelector, "dash");

        // Dead animation

        let deadSelector = new Engine.AnimationSelector();
        let playerDeathAnimation = Engine.AssetManager.getAsset("playerDeathAnimation").export();

        deadSelector.addAnimation(new Engine.Animation(playerDeathAnimation.death, 3, false), "deadDown");

        viewer.addAnimationSelector(deadSelector, "dead");

        // Transitions

        viewer.addTransition("idle", "move", "move");
        viewer.addTransition("idle", "dead", "death");

        viewer.addTransition("move", "idle", "idle");
        // viewer.addTransition("move", "dash", "dash");
        viewer.addTransition("move", "dead", "death");

        // viewer.addTransition("dash", "idle", "----");
        // viewer.addTransition("dash", "move", "----");
        // viewer.addTransition("dash", "dead", "death");
    });

    return Engine.createGameObject(controller, stat, damageable, collider, viewer);
}

class PlayerHealthbar extends Engine.UIElement {
    start() {
        this.playerStat = Engine.AssetManager.getAsset("Player").getComponent("EntityStat");
        this.setSize(Engine.createVector(300, 50));
    }

    displayElement() {
        let size = this.getSize();
        noStroke();

        fill(140);
        rect(0, 0, size.x, size.y);

        let percentHealth = this.playerStat.health / this.playerStat.baseHealth;
        fill(229, 58, 45);
        rect(0, 0, size.x * percentHealth, size.y);

        strokeWeight(4);
        stroke(70);
        for (let i = 0; i < this.playerStat.baseHealth - 1; i++) {
            let x = (i + 1) * (size.x / this.playerStat.baseHealth);
            line(x, 0, x, 10);
            line(x, size.y, x, size.y - 10);
        }
    }
}

class PlayerImmunitybar extends Engine.UIElement {
    timer = 0;
    playerTookDamage = false;
    isScenePaused = false;

    start() {
        this.playerDamageable = Engine.AssetManager.getAsset("Player").getComponent("Damageable");
        Engine.Events.addEventListener("game/started", () => (this.playerTookDamage = false));
        Engine.Events.addEventListener("player/damage", () => this.startTimer());
        this.setSize(Engine.createVector(300, 8));
        Engine.Events.addEventListener("gameScene/paused", () => (this.isScenePaused = true));
        Engine.Events.addEventListener("gameScene/unpaused", () => (this.isScenePaused = false));
    }

    startTimer() {
        this.playerTookDamage = true;
        this.timer = 0;
    }

    displayElement() {
        if (!this.playerTookDamage) return;

        if (!this.isScenePaused) this.timer += Engine.Time.deltaTime();

        let dist = this.timer / this.playerDamageable.immunityTime;
        if (dist >= 1.0) this.playerTookDamage = false;

        noStroke();
        fill(255);

        let size = this.getSize();
        rect(0, 0, size.x * (1 - dist), size.y);
    }
}

export class PlayerStatusViewer extends Engine.UIElement {
    start() {
        Engine.Events.addEventListener("player/died", () => this.enabled(false));
        Engine.Events.addEventListener("game/started", () => this.enabled(true));

        this.setPosition(Engine.createVector(50, 30));

        let healthbar = new PlayerHealthbar();
        healthbar.setPosition(Engine.createVector(0));
        this.addElement(healthbar);

        let immunitybar = new PlayerImmunitybar();
        immunitybar.setPosition(Engine.createVector(0, healthbar.getSize().y));
        this.addElement(immunitybar);
    }
}
