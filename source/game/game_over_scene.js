import * as Engine from "../engine/engine.js";

export class GameOverScene extends Engine.Scene {
    start() {}

    background() {
        background(70);
        if (Engine.Input.getReleased("r")) Engine.SceneManager.changeScene("MainMenuScene");
    }
}
