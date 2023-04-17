import * as Engine from "../engine/engine.js";

import { MainMenuScene } from "./main_menu_scene.js";
import { GameScene } from "./game_scene.js";

function preload() {}

function setup() {
    Engine.SceneManager.registerScene(new MainMenuScene(), "MainMenuScene");
    Engine.SceneManager.registerScene(new GameScene(), "GameScene");
    Engine.SceneManager.setEntryScene("MainMenuScene");
}

Engine.initialize(preload, setup);
