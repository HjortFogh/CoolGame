// import * as PlayerModelFoo from "./source/model/player.js";

import { SceneManager, Scene } from "./source/scene.js";
import { GameObject } from "./source/game_object.js";

import { createPlayer } from "./source/player.js";
import { EnemyController, EnemyViewer } from "./source/enemy.js";

let sceneManager;

window.setup = () => {
    createCanvas(windowWidth, windowHeight);

    sceneManager = new SceneManager();

    let gameScene = new Scene("Game-Scene");
    sceneManager.addScene(gameScene);
    sceneManager.setActiveScene("Game-Scene");

    let player = createPlayer();
    gameScene.addGameObject(player); //TODO: add layer arg
    gameScene.setCameraFocus(player);

    for (let i = 0; i < 1000; i++) {
        let enemy = new GameObject();
        enemy.addComponent(new EnemyController());
        enemy.addComponent(new EnemyViewer());
        gameScene.addGameObject(enemy);
    }
};

window.draw = () => {
    background(220);

    // Deltatime in seconds
    deltaTime *= 0.001;

    if (frameCount % 100 == 0) print("Framerate:", frameRate());
    sceneManager.getActiveScene().tick();
};
