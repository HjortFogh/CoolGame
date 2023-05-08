import * as Engine from "../engine/engine.js";

import { MainMenuScene } from "./main_menu_scene.js";
import { GameScene } from "./game_scene.js";
import { GameOverScene } from "./game_over_scene.js";

function preload() {
    Engine.AssetManager.addAsset(Engine.SpriteAtlas.load("../assets/dummyTurnaround.png", Engine.createVector(16, 32)), "PlayerSpriteAtlas");
}

function setup() {
    Engine.SceneManager.registerScene(new MainMenuScene(), "MainMenuScene");
    Engine.SceneManager.registerScene(new GameOverScene(), "GameOverScene");
    Engine.SceneManager.registerScene(new GameScene(), "GameScene");
    Engine.SceneManager.setEntryScene("MainMenuScene");
}

Engine.initialize(preload, setup);
