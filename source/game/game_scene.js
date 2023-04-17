import * as Engine from "../engine/engine.js";

import { createPlayer } from "./player.js";

export class GameScene extends Engine.Scene {
    start() {
        this.addGameObject(createPlayer());
    }

    background() {
        background(200, 150, 100);
        if (Engine.Input.getReleased("1")) Engine.SceneManager.changeScene("MainMenuScene");
    }
}
