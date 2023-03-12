import { SceneManager } from "../engine/scene.js";
import { InputManager } from "../engine/input.js";
import { PerformanceManager } from "../engine/performance.js";

let debugMode = true;

export function initialize(onInit) {
    window.setup = () => {
        createCanvas(windowWidth, windowHeight);
        if (debugMode) PerformanceManager.initialize();
        onInit();
    };

    window.draw = () => {
        SceneManager.tick();
        InputManager.tick();

        if (debugMode) {
            push();
            PerformanceManager.tick();
            PerformanceManager.displayFPS();
            pop();
        }
    };

    window.keyPressed = () => InputManager.keyPressed(key);
    window.keyReleased = () => InputManager.keyReleased(key);
}
