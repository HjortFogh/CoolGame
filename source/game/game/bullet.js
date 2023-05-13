// Exports:
// - createFireball
// - createWaterball

import { Engine } from "../../engine/engine.js";

/**
 * @type {Int}
 * @constant
 */
const BULLET_RADIUS = 20;

/**
 * Controlls the movement of a bullet
 */
class BulletController extends Engine.Controller {
    /**
     * @type {Transform}
     */
    #transform;
    /**
     * @type {Boolean}
     */
    #isFired = false;
    /**
     * @type {Int}
     */
    #speed = 350;
    /**
     * Range 0 to pi*2
     * @type {Float}
     */
    #direction = 0;
    /**
     * @type {GameObject}
     */
    #shooter;

    /**
     * Retrives the Transform of the bullet and sets up kill timer after 5 seconds and collision events
     */
    start() {
        this.#transform = this.gameObject.getComponent("Transform");
        this.gameObject.getComponent("CircleCollider").addListener("onEnter", (collider) => this.onTargetHit(collider));
        Engine.Time.createTimer(() => this.gameObject.destroy(), 5);
        Engine.Events.addEventListener("game/started", () => this.gameObject.destroy());
    }

    /**
     * Fires the bullet in a direction
     * @param {GameObject} shooter GameObject of the shooter
     * @param {Float} direction Angle in range 0 to pi*2
     */
    fire(shooter, direction) {
        this.#isFired = true;
        this.#transform.position.set(shooter.getComponent("Transform").position);
        this.#shooter = shooter;
        this.#direction = direction;
    }

    /**
     * Updates the position of the bullet
     */
    update() {
        if (!this.#isFired) return;
        let velocity = Engine.createVector(Math.cos(this.#direction), Math.sin(this.#direction)).mult(this.#speed * Engine.Time.deltaTime());
        this.#transform.position.add(velocity);
    }

    /**
     * Called when the bullet hits a target
     * @param {Collider} collider Collider of target
     */
    onTargetHit(collider) {
        let entityStat = collider.gameObject.getComponent("EntityStat");
        let shooterStat = this.#shooter.getComponent("EntityStat");

        if (entityStat === undefined || shooterStat === undefined) return;

        if (shooterStat.getTag() != entityStat.getTag()) {
            entityStat.damage(shooterStat.getDamage());
            this.gameObject.destroy();
        }
    }
}

/**
 * Displays a fireball which is fired by the player
 */
class FireballViewer extends Engine.Viewer {
    /**
     * @type {Transform}
     */
    transform;
    /**
     * @type {Sprite}
     */
    fireballSprite;

    /**
     * Get the transform and sprite
     */
    start() {
        this.transform = this.gameObject.getComponent("Transform");
        this.fireballSprite = Engine.AssetManager.getAsset("fireball");
        this.transform.scale = Engine.createVector(BULLET_RADIUS * 2);
    }

    /**
     * Display the fireball
     */
    display() {
        this.fireballSprite.display(this.transform.position, this.transform.scale);
    }
}

/**
 * Displays a fireball which is fired by the enemy
 */
class WaterballViewer extends Engine.Viewer {
    /**
     * @type {Transform}
     */
    transform;
    /**
     * @type {Sprite}
     */
    waterballSprite;

    /**
     * Get the transform and sprite
     */
    start() {
        this.transform = this.gameObject.getComponent("Transform");
        this.waterballSprite = Engine.AssetManager.getAsset("waterball");
        this.transform.scale = Engine.createVector(BULLET_RADIUS * 2);
    }

    /**
     * Display the waterball
     */
    display() {
        this.waterballSprite.display(this.transform.position, this.transform.scale);
    }
}

/**
 * Creates a new fireball
 * @returns {GameObject}
 */
export function createFireball() {
    let controller = new BulletController();
    let viewer = new FireballViewer();
    let collider = new Engine.CircleCollider(BULLET_RADIUS);
    return Engine.createGameObject(controller, viewer, collider);
}

/**
 * Creates a new wateball
 * @returns {GameObject}
 */
export function createWaterball() {
    let controller = new BulletController();
    let viewer = new WaterballViewer();
    let collider = new Engine.CircleCollider(BULLET_RADIUS);
    return Engine.createGameObject(controller, viewer, collider);
}
