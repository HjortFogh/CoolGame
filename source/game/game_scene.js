// Exports:
// - GameScene

import { Engine } from "../engine/engine.js";
import { createPlayer } from "./game/player.js";
import { createEnemy } from "./game/enemy.js";
import { GameManager } from "./game/game_manager.js";
import { createArena } from "./game/arena.js";
import { BasicSceneTransition, Button } from "./misc.js";
import { createFireball, createWaterball } from "./game/bullet.js";
import { PlayerHealthbar, WaveInfo } from "./game/game_ui.js";

/**
 * Menu which is displayed when the game is paused
 */
class PauseMenu extends Engine.UIElement {
    /**
     * Add event listeners and create a PauseModal
     */
    start() {
        Engine.Events.addEventListener("gameScene/paused", () => this.enabled(true));
        Engine.Events.addEventListener("gameScene/unpaused", () => this.enabled(false));
        this.enabled(false);

        this.setSize(Engine.createVector(width, height));
        this.addElement(new PauseModal());
    }

    /**
     * Display transparent white background when paused
     */
    displayElement() {
        let size = this.getSize();
        noStroke();
        fill(255, 120);
        rect(0, 0, size.x, size.y);
    }
}

/**
 * The main part of the pause menu
 */
class PauseModal extends Engine.UIElement {
    /**
     * Create button which will take the player to the main menu
     */
    start() {
        this.setPosition(Engine.createVector(400, 50));
        this.setSize(Engine.createVector(width - 800, height - 100));
        let mainMenuBtn = new Button();
        mainMenuBtn.setText("Quit game");
        mainMenuBtn.setSize(Engine.createVector(200, 120));
        mainMenuBtn.setPosition(Engine.createVector((width - 800 - 200) / 2, 100));
        mainMenuBtn.onLeftPress = () => Engine.SceneManager.transition(new BasicSceneTransition(2), "MainMenuScene");
        this.addElement(mainMenuBtn);
    }

    /**
     * Display the modal popup
     */
    displayElement() {
        let size = this.getSize();
        noStroke();
        fill(70);
        rect(0, 0, size.x, size.y);
    }
}

/**
 * Scene which contains the game
 */
export class GameScene extends Engine.Scene {
    /**
     * Setup player, enemy, bullets and pause menu
     */
    start() {
        // Setup arena
        Engine.AssetManager.addAsset(2500, "arenaRadius");
        this.addGameObject(createArena());

        // Setup fire- and waterball
        let fireballPrefab = new Engine.GamePrefab(createFireball());
        this.bindGamePrefab(fireballPrefab);
        Engine.AssetManager.addAsset(fireballPrefab, "fireballPrefab");
        let waterballPrefab = new Engine.GamePrefab(createWaterball());
        this.bindGamePrefab(waterballPrefab);
        Engine.AssetManager.addAsset(waterballPrefab, "waterballPrefab");

        // Setup player
        let player = createPlayer();
        Engine.Camera.setTarget(player.getComponent("Transform"));
        Engine.AssetManager.addAsset(player, "player");
        this.addGameObject(player);

        let enemyPrefab = new Engine.GamePrefab(createEnemy());
        this.bindGamePrefab(enemyPrefab);
        Engine.AssetManager.addAsset(enemyPrefab, "enemyPrefab");

        // Game manager
        this.addScript(new GameManager());

        // Pause menu, player health and wave info
        this.addUIElement(new PauseMenu());
        this.addUIElement(new PlayerHealthbar());
        this.addUIElement(new WaveInfo());
    }

    /**
     * Start game when GameScene is set active
     */
    onEnter() {
        Engine.Events.triggerEvent("game/started");
    }

    /**
     * Stop the game when GameScene is set deactive
     */
    onExit() {
        Engine.Events.triggerEvent("game/ended");
    }

    /**
     * Fill a gray background
     */
    background() {
        background(80);
    }
}
