import * as Engine from "../../engine/engine.js";

export class GameManager extends Engine.Script {
    start() {
        console.log("GameManager Script Started!");
        Engine.Events.addEventListener("WaveCleared", (waveNum) => Engine.Events.triggerEvent("SpawnWave"));
        Engine.Events.triggerEvent("SpawnWave");
    }

    update() {
        let scene = this.getScene();
        if (Engine.Input.getPressed("escape")) {
            if (scene.isPaused()) {
                scene.unpause();
                Engine.Events.triggerEvent("SceneUnpaused");
            } else {
                scene.pause();
                Engine.Events.triggerEvent("ScenePaused");
            }
        }
        if (Engine.Input.getReleased("1")) Engine.SceneManager.changeScene("MainMenuScene");
    }
}
