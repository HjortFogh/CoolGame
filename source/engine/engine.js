import { SceneManager, Scene, SceneTransition } from "./canvas/scene.js";
import { Input } from "./input.js";
import { AssetManager } from "./assets/assets.js";
import { Model, Viewer, Controller } from "./components/component.js";
import { Time } from "./time.js";

export function initialize(onPreload, onInit) {
    window.preload = () => {
        onPreload();
    };

    window.setup = () => {
        createCanvas(windowWidth, windowHeight);
        onInit();
    };

    window.draw = () => {
        Time.tick();
        SceneManager.tick();
        Input.tick();
    };

    window.keyPressed = () => Input.keyPressed(key);
    window.keyReleased = () => Input.keyReleased(key);
    window.mousePressed = () => Input.keyPressed(mouseButton);
    window.mouseReleased = () => Input.keyReleased(mouseButton);
}

export { SceneManager, Scene, SceneTransition, Input, Model, Viewer, Controller, Time, AssetManager };
