// Exports:
// - createEnemy

import { Engine } from "../../engine/engine.js";
import { EntityStat } from "./entity.js";

/**
 * @type {Vector}
 * @constant
 */
const ENEMY_SCALE = Engine.createVector(100);

/**
 * Display the enemy
 */
class EnemyViewer extends Engine.Viewer {
    /**
     * @type {Transform}
     */
    #transform;
    /**
     * @type {Sprite}
     */
    #enemySprite;

    /**
     * Retrive Transform and enemy Sprite
     */
    start() {
        this.#transform = this.gameObject.getComponent("Transform");
        this.#enemySprite = Engine.AssetManager.getAsset("enemy");
        this.setViewLayer(5);
    }

    /**
     * Display the enemy Sprite
     */
    display() {
        this.#enemySprite.display(this.#transform.position, this.#transform.scale);
    }
}

/**
 * Controlls the enemy movement and shooting
 */
class EnemyController extends Engine.Controller {
    /**
     * @type {Transform}
     */
    #transform;
    /**
     * @type {Transform}
     */
    #playerTransform;
    /**
     * @type {EntityStat}
     */
    #enemyStat;
    /**
     * @type {Int}
     */
    #speed = 250;

    /**
     * Setup events when the enemy dies and get enemy and player Transform
     */
    start() {
        this.#transform = this.gameObject.getComponent("Transform");
        this.#transform.scale.set(ENEMY_SCALE);
        this.#playerTransform = Engine.AssetManager.getAsset("player").getComponent("Transform");

        this.#enemyStat = this.gameObject.getComponent("EntityStat");

        this.#enemyStat.addEventListener("death", () => this.onDeath());
        Engine.Time.createTimer(() => this.shoot(), 1);
    }

    /**
     * Update the position of the enemy
     */
    update() {
        let move = Engine.Vector.sub(this.#playerTransform.position, this.#transform.position);
        move.setMagnitude(this.#speed * Engine.Time.deltaTime());
        this.#transform.position.add(move);
    }

    /**
     * Shoot a waterball towards the player
     */
    shoot() {
        if (this.gameObject.isDestroyed()) return;
        Engine.Time.createTimer(() => this.shoot(), 1);
        let waterballPrefab = Engine.AssetManager.getAsset("waterballPrefab");
        let bullet = waterballPrefab.spawn();

        let rotation = Math.atan2(this.#playerTransform.position.y - this.#transform.position.y, this.#playerTransform.position.x - this.#transform.position.x);
        bullet.getComponent("BulletController").fire(this.gameObject, rotation);
    }

    /**
     * Called when the enemy dies
     */
    onDeath() {
        if (this.gameObject.isDestroyed()) return;
        this.gameObject.destroy();
    }
}

/**
 * Displays the health of the enemy
 */
class EnemyHealthViewer extends Engine.Viewer {
    /**
     * @type {Transform}
     */
    transform;
    /**
     * @type {EntityStat}
     */
    enemyStat;

    /**
     * Get Transform and EntityStat and set viewlayer
     */
    start() {
        this.transform = this.gameObject.getComponent("Transform");
        this.enemyStat = this.gameObject.getComponent("EntityStat");
        this.setViewLayer(8);
    }

    /**
     * Display the healthbar underneath the enemy
     */
    display() {
        let pos = this.transform.position;
        let w = 60;
        let h = 20;

        noStroke();
        fill(0);
        rect(pos.x - w / 2, pos.y + 60, w, h);
        fill(220, 50, 20);
        rect(pos.x - w / 2, pos.y + 60, w * this.enemyStat.getHealthPercentage(), h);
    }
}

/**
 * Create a new enemy
 * @returns {GameObject}
 */
export function createEnemy() {
    let controller = new EnemyController();
    let viewer = new EnemyViewer();
    let healthViewer = new EnemyHealthViewer();
    let collider = new Engine.RectCollider(ENEMY_SCALE);

    let enemyStat = new EntityStat(20, 1);
    enemyStat.setTag("Enemy");

    return Engine.createGameObject(controller, viewer, collider, enemyStat, healthViewer);
}
