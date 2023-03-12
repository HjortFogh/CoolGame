import { InputManager } from "../engine/input.js";
import { Scene, SceneManager } from "../engine/scene.js";
import { CoolTransiton } from "./transitions.js";

export class MainMenuScene extends Scene {
    start() {}

    onEnter() {}

    display() {
        background(85, 0, 0);
        if (InputManager.getReleased("c")) SceneManager.transition(new CoolTransiton(2, 1), "GameScene");
    }
}
