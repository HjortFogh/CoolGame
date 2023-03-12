import { InputManager } from "../engine/input.js";
import { GameObject, Transform } from "../engine/object.js";
import { Scene, SceneManager } from "../engine/scene.js";
import { EnemyController, EnemyViewer } from "./enemy.js";
import { PlayerController, PlayerViewer } from "./player.js";
import { CoolTransiton } from "./transitions.js";

export class GameScene extends Scene {
    start() {
        let player = new GameObject();
        player.addComponent(new PlayerController());
        player.addComponent(new PlayerViewer());
        this.addGameObject(player);
        this.camera.setFocus(player.getComponent(Transform));

        for (let i = 0; i < 200; i++) {
            let enemy = new GameObject();
            enemy.addComponent(new EnemyController());
            enemy.addComponent(new EnemyViewer());
            this.addGameObject(enemy);
        }
    }

    onEnter() {
        // print("Entered game scene!");
    }

    display() {
        background(0, 0, 85);
        fill(120);
        circle(0, 0, 5000);
        fill(200);
        circle(0, 0, 1000);

        if (InputManager.getReleased("c")) SceneManager.transition(new CoolTransiton(2, 1), "MainMenuScene");
    }
}
