import { SceneManager, Scene, SceneTransition, Camera, Script } from "./canvas/scene.js";
export { SceneManager, Scene, SceneTransition, Camera, Script };
import { Input } from "./input.js";
export { Input };
import { AssetManager } from "./assets/assets.js";
export { AssetManager };
import { Model, Viewer, Controller } from "./components/component.js";
export { Model, Viewer, Controller };
import { Time } from "./time.js";
export { Time };
import { Transform } from "./components/transform.js";
export { Transform };
import { GameObject, GamePrefab, createGameObject } from "./canvas/object.js";
export { GameObject, GamePrefab, createGameObject };
import { createVector, Vector } from "./vector.js";
export { createVector, Vector };
import { CircleCollider, RectCollider } from "./components/collisions.js";
export { CircleCollider, RectCollider };
import { Events } from "./events.js";
export { Events };
import { UI } from "./canvas/ui.js";
export { UI };
import { Sprite, SpriteAtlas } from "./assets/sprite.js";
export { Sprite, SpriteAtlas };
import { Animation, AnimationTree, Animator, DirectionalAnimation, AnimationSelector } from "./components/animation.js";
export { Animation, AnimationTree, Animator, DirectionalAnimation, AnimationSelector };

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
