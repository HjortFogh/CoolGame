import { Engine } from "../../engine/engine.js";
import { DeathTransition } from "../misc.js";

export class GameManager extends Engine.Script {
    start() {
        console.log("GameManager Script Started!");
        Engine.Events.addEventListener("wave/cleared", () => Engine.Events.triggerEvent("wave/spawn"));
        Engine.Events.addEventListener("player/died", () => this.onPlayerDeath());
        Engine.Events.addEventListener("game/started", () => this.gameStarted());
    }

    update() {
        let scene = this.getScene();
        if (Engine.Input.getPressed("escape")) {
            if (scene.isPaused()) {
                scene.unpause();
                Engine.Events.triggerEvent("gameScene/unpaused");
            } else {
                scene.pause();
                Engine.Events.triggerEvent("gameScene/paused");
            }
        }
        if (Engine.Input.getReleased("1")) Engine.SceneManager.changeScene("MainMenuScene");
    }

    onPlayerDeath() {
        let scene = this.getScene();
        scene.pause();
        Engine.SceneManager.transition(new DeathTransition(4, 4), "GameOverScene");
        Engine.Events.triggerEvent("game/ended");
    }

    gameStarted() {
        let scene = this.getScene();
        scene.unpause();
    }
}
