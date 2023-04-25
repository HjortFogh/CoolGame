import * as Engine from "../../engine/engine.js";

export class GameManager extends Engine.Script {
    start() {
        console.log("GameManager Script Started!");
        Engine.Events.addEventListener("WaveCleared", (waveNum) => Engine.Events.triggerEvent("SpawnWave"));
        Engine.Events.triggerEvent("SpawnWave");
    }

    update() {
        if (Engine.Input.getPressed("escape")) {
            if (this.scene.isPaused) {
                this.scene.unpause();
                Engine.Events.triggerEvent("SceneUnpaused");
            } else {
                this.scene.pause();
                Engine.Events.triggerEvent("ScenePaused");
            }
        }
        if (Engine.Input.getReleased("1")) Engine.SceneManager.changeScene("MainMenuScene");
    }
}
