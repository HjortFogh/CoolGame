import { Engine } from "../engine/engine.js";
import { MainMenuScene } from "./main_menu_scene.js";
import { GameScene } from "./game_scene.js";
import { GameOverScene } from "./game_over_scene.js";

/**
 * Loads the player animations
 */
function preload() {
    let spriteNames = ["down", "downRight", "right", "upRight", "up", "upLeft", "left", "downLeft"];
    Engine.AssetManager.addAsset(Engine.SpriteAtlas.load("../assets/idleAnimation.png", Engine.createVector(16, 32), spriteNames), "playerIdleAnimation");
    Engine.AssetManager.addAsset(Engine.SpriteAtlas.load("../assets/moveAnimation.png", Engine.createVector(16, 32), spriteNames), "playerMoveAnimation");
    Engine.AssetManager.addAsset(Engine.SpriteAtlas.load("../assets/dashAnimation.png", Engine.createVector(16, 16), spriteNames), "playerDashAnimation");
    Engine.AssetManager.addAsset(Engine.SpriteAtlas.load("../assets/deathAnimation.png", Engine.createVector(16, 32), ["death"]), "playerDeathAnimation");
}

/**
 * Creates all of the Scene(s) and sets the entry Scene
 */
function setup() {
    Engine.SceneManager.registerScene(new MainMenuScene(), "MainMenuScene");
    Engine.SceneManager.registerScene(new GameOverScene(), "GameOverScene");
    Engine.SceneManager.registerScene(new GameScene(), "GameScene");
    // Engine.SceneManager.setEntryScene("MainMenuScene");
    Engine.SceneManager.setEntryScene("GameOverScene");
}

Engine.initialize(preload, setup);
