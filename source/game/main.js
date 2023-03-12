import { initialize } from "../engine/engine.js";
import { SceneManager } from "../engine/scene.js";

import { GameScene } from "./game_scene.js";
import { MainMenuScene } from "./main_menu_scene.js";

function entry() {
    SceneManager.registerScene(new GameScene(), "GameScene");
    SceneManager.registerScene(new MainMenuScene(), "MainMenuScene");
    SceneManager.setActiveScene("GameScene");
}

initialize(entry);
