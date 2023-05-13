// Exports:
// - GameManager

import { Engine } from "../../engine/engine.js";
import { DeathTransition } from "../misc.js";

/**
 * Manages the game
 */
export class GameManager extends Engine.Script {
    /**
     * @type {Array<GameObject>}
     */
    #enemies = [];
    /**
     * @type {Int}
     */
    #waveNumber = 0;

    /**
     * Add event listeners for player death and game start
     */
    start() {
        Engine.Events.addEventListener("player/died", () => this.onPlayerDeath());
        Engine.Events.addEventListener("game/started", () => this.gameStarted());
    }

    /**
     * Check if all enemies have been killed and pause/unpause
     */
    update() {
        // Pause/unpause the game
        let scene = this.getScene();
        if (Engine.Input.getPressed("escape")) {
            if (scene.isPaused()) {
                scene.unpause();
                Engine.Events.triggerEvent("gameScene/unpaused");
            } else {
                scene.pause();
                Engine.Events.triggerEvent("gameScene/paused");
            }
        }

        // Check if the wave has been cleared
        if (this.waveCleared()) {
            this.#waveNumber++;
            Engine.Events.triggerEvent("wave/cleared", this.#waveNumber);
            this.spawnWave();
        }
    }

    /**
     * Resets the enemies and unpauses the game
     */
    gameStarted() {
        let scene = this.getScene();
        scene.unpause();
        Engine.Events.triggerEvent("gameScene/unpaused");
        this.#waveNumber = 0;
        for (let enemy of this.#enemies) enemy.destroy();
        this.#enemies = [];
    }

    /**
     * Called when the player dies and transitions into the GameOverScene
     */
    onPlayerDeath() {
        let scene = this.getScene();
        scene.pause();
        Engine.SceneManager.transition(new DeathTransition(4, 4), "GameOverScene");
    }

    /**
     * Returns the amount of enemies to spawn based on the wave number
     * @returns {Int}
     */
    calculateNumberEnemies() {
        return Math.ceil(this.#waveNumber ** 0.8);
    }

    /**
     * Checks if the wave is cleared and removes the enemies from the "enemies" array
     * @returns {Boolean}
     */
    waveCleared() {
        let numEnemies = this.#enemies.length;
        for (let i = numEnemies - 1; i >= 0; i--) {
            let enemy = this.#enemies[i];
            if (enemy.isDestroyed()) {
                this.#enemies.splice(i, 1);
                Engine.Events.triggerEvent("enemy/killed", this.#enemies.length, this.calculateNumberEnemies());
            }
        }
        return this.#enemies.length == 0;
    }

    /**
     * Spawn a new wave of enemies
     */
    spawnWave() {
        let numEnemies = this.calculateNumberEnemies();
        let enemyPrefab = Engine.AssetManager.getAsset("enemyPrefab");
        let arenaRadius = Engine.AssetManager.getAsset("arenaRadius");

        for (let i = 0; i < numEnemies; i++) {
            let enemy = enemyPrefab.spawn();
            this.#enemies.push(enemy);

            let angle = Math.random() * Math.PI * 2;
            let range = 1000;
            let distance = Math.random() * range + (arenaRadius - range);

            let xPos = Math.cos(angle) * distance;
            let yPos = Math.sin(angle) * distance;

            enemy.getComponent("Transform").position.set(Engine.createVector(xPos, yPos));
        }
    }
}
