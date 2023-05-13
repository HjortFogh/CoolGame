// Exports:
// - createPlayer

import { Engine } from "../../engine/engine.js";
import { EntityStat } from "./entity.js";

/**
 * @type {Vector}
 * @constant
 */
const PLAYER_SCALE = Engine.createVector(65, 130);

/**
 * Controlls the player movement
 */
class PlayerController extends Engine.Controller {
    /**
     * @type {Transform}
     */
    #transform;
    /**
     * @type {EntityStat}
     */
    #playerStat;
    /**
     * @type {AnimationTree}
     */
    #animationTree;

    /**
     * @type {Int}
     */
    #speed = 400;
    /**
     * @type {Float}
     */
    #shootCooldownTime = 0.05;
    /**
     * @type {Float}
     */
    #lastShot = 0;
    /**
     * @type {Float}
     */
    #dashTime = 0.5;
    /**
     * @type {Boolean}
     */
    #isDashing = false;
    /**
     * @type {Vector}
     */
    #dashingVelocity;

    /**
     * Retrives all resources used by the player
     */
    start() {
        // Transform
        this.#transform = this.gameObject.getComponent("Transform");
        this.#transform.scale.set(PLAYER_SCALE);

        // Player stat
        this.#playerStat = this.gameObject.getComponent("EntityStat");
        this.#playerStat.addEventListener("death", () => this.onDeath());
        this.#playerStat.addEventListener("damage", () => Engine.Events.triggerEvent("player/damage"));

        // Animation tree
        this.#animationTree = this.gameObject.getComponent("AnimationTree");

        // Events
        Engine.Events.addEventListener("game/started", () => {
            this.gameObject.restart();
            this.#isDashing = false;
        });
    }

    /**
     * Restarts the player when a new game is started
     */
    restart() {
        this.#transform.scale.set(PLAYER_SCALE);
        this.#animationTree.setProperty("direction", Engine.createVector(0, 1));
    }

    /**
     * Updates the players position and checks if the player is dashing or shooting
     */
    update() {
        if (Engine.Input.getPressed("r")) this.onDeath();

        // WASD direction
        let velocity = Engine.createVector(
            Engine.Input.getInput("d") - Engine.Input.getInput("a"),
            Engine.Input.getInput("s") - Engine.Input.getInput("w")
        ).normalize();

        // Normal movement when not dashing
        if (!this.#isDashing) {
            this.#animationTree.setProperty("direction", velocity);
            if (!velocity.isZero()) this.#animationTree.transition("move");
            else this.#animationTree.transition("idle");

            velocity.mult(this.#speed * Engine.Time.deltaTime());
            this.#transform.position.add(velocity);
        }
        // Movement when dashing
        else {
            this.#transform.position.add(this.#dashingVelocity);
        }

        // Force player to remain within arena
        let arenaRadius = Engine.AssetManager.getAsset("arenaRadius");
        if (this.#transform.position.magnitude() >= arenaRadius) this.#transform.position.setMagnitude(arenaRadius);

        // Shoot on left mouse with cooldown
        if (Engine.Input.getInput("left") && Engine.Time.now() - this.#lastShot >= this.#shootCooldownTime) {
            let rotation = Math.atan2(mouseY - height / 2, mouseX - width / 2);
            let fireballPrefab = Engine.AssetManager.getAsset("fireballPrefab");

            let bullet = fireballPrefab.spawn();
            bullet.getComponent("BulletController").fire(this.gameObject, rotation - 0.1);
            bullet = fireballPrefab.spawn();
            bullet.getComponent("BulletController").fire(this.gameObject, rotation);
            bullet = fireballPrefab.spawn();
            bullet.getComponent("BulletController").fire(this.gameObject, rotation + 0.1);
            this.#lastShot = Engine.Time.now();
        }

        // Dash on e
        if (Engine.Input.getReleased("e") && !this.#isDashing) {
            this.#isDashing = true;
            this.#dashingVelocity = velocity.mult(3);
            this.#animationTree.transition("dash");
            Engine.Time.createTimer(() => {
                this.#isDashing = false;
                this.#animationTree.transition("dashEnded");
            }, this.#dashTime);
        }
    }

    /**
     * When the player dies
     */
    onDeath() {
        this.#animationTree.transition("death");
        Engine.Events.triggerEvent("player/died");
    }
}

/**
 * Creates the player
 * @returns {GameObject}
 */
export function createPlayer() {
    let controller = new PlayerController();
    let collider = new Engine.RectCollider(PLAYER_SCALE);

    let playerStat = new EntityStat(9, 1);
    playerStat.setTag("Player");

    let viewer = new Engine.AnimationTree();
    viewer.setViewLayer(10);

    // Setup the player animation tree
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
        viewer.addTransition("idle", "move", "move");
        viewer.addTransition("idle", "dead", "death");

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
        viewer.addTransition("move", "idle", "idle");
        viewer.addTransition("move", "dash", "dash");
        viewer.addTransition("move", "dead", "death");

        // Dash animation

        let dashSelector = new Engine.DirectionalAnimation();
        let playerDashAnimation = Engine.AssetManager.getAsset("playerDashAnimation").export();

        dashSelector.addAnimation(new Engine.Animation(playerDashAnimation.down, 1.4), "dashDown", Engine.createVector(0, 1));
        dashSelector.addAnimation(new Engine.Animation(playerDashAnimation.downRight, 1.4), "dashDownRight", Engine.createVector(1, 1).normalize());
        dashSelector.addAnimation(new Engine.Animation(playerDashAnimation.right, 1.4), "dashRight", Engine.createVector(1, 0));
        dashSelector.addAnimation(new Engine.Animation(playerDashAnimation.upRight, 1.4), "dashUpRight", Engine.createVector(1, -1).normalize());
        dashSelector.addAnimation(new Engine.Animation(playerDashAnimation.up, 1.4), "dashUp", Engine.createVector(0, -1));
        dashSelector.addAnimation(new Engine.Animation(playerDashAnimation.upLeft, 1.4), "dashUpLeft", Engine.createVector(-1, -1).normalize());
        dashSelector.addAnimation(new Engine.Animation(playerDashAnimation.left, 1.4), "dashLeft", Engine.createVector(-1, 0));
        dashSelector.addAnimation(new Engine.Animation(playerDashAnimation.downLeft, 1.4), "dashDownLeft", Engine.createVector(-1, 1).normalize());

        viewer.addAnimationSelector(dashSelector, "dash");
        viewer.addTransition("dash", "idle", "dashEnded");
        viewer.addTransition("dash", "dead", "death");

        // Death animation

        let deadSelector = new Engine.AnimationSelector();
        let playerDeathAnimation = Engine.AssetManager.getAsset("playerDeathAnimation").export();

        deadSelector.addAnimation(new Engine.Animation(playerDeathAnimation.death, 3, false), "deadDown");

        viewer.addAnimationSelector(deadSelector, "dead");
    });

    return Engine.createGameObject(controller, collider, playerStat, viewer);
}
