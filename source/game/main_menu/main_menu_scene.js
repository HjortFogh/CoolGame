import * as Engine from "../../engine/engine.js";

export class MainMenuScene extends Engine.Scene {
    start() {}

    background() {
        background(100, 150, 200);
        if (Engine.Input.getReleased("1")) Engine.SceneManager.changeScene("GameScene");
    }
}
