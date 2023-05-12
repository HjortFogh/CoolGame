// Exports:
// - Engine

import * as SceneImport from "./world/scene.js";
import * as InputImport from "./input.js";
import * as AssetsImport from "./assets/assets.js";
import * as ComponentImport from "./components/component.js";
import * as TimeImport from "./time.js";
import * as TransformImport from "./components/transform.js";
import * as ObjectImport from "./world/object.js";
import * as VectorImport from "./vector.js";
import * as CollisionsImport from "./components/collisions.js";
import * as EventsImport from "./events.js";
import * as UIImport from "./ui.js";
import * as SpriteImport from "./assets/sprite.js";
import * as AnimationImport from "./components/animation.js";

/**
 * The exported Engine object, which contains all modules in the Engine
 * @type {Object}
 */
let Engine = {
    ...SceneImport,
    ...InputImport,
    ...AssetsImport,
    ...ComponentImport,
    ...TimeImport,
    ...TransformImport,
    ...ObjectImport,
    ...VectorImport,
    ...CollisionsImport,
    ...EventsImport,
    ...UIImport,
    ...SpriteImport,
    ...AnimationImport,
};

/**
 * Sets up p5.js and calls the user-provided callbacks
 * @param {Function} onPreload Called before initialize used for loading resources
 * @param {Function} onInit Called on initialize
 */
Engine.initialize = (onPreload, onInit) => {
    window.preload = () => {
        onPreload();
    };

    window.setup = () => {
        createCanvas(windowWidth, windowHeight);
        onInit();
    };

    window.draw = () => {
        TimeImport.Time.tick();
        SceneImport.SceneManager.tick();
        InputImport.Input.tick();
    };

    window.keyPressed = () => InputImport.Input.keyPressed(key);
    window.keyReleased = () => InputImport.Input.keyReleased(key);
    window.mousePressed = () => InputImport.Input.keyPressed(mouseButton);
    window.mouseReleased = () => InputImport.Input.keyReleased(mouseButton);
};

export { Engine };
