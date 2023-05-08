import * as Engine from "../engine/engine.js";

import { createPlayer } from "./game/player.js";
import { createEnemy } from "./game/enemy.js";
import { createBasicBullet, createHomingBullet } from "./game/bullet.js";
import { GameManager } from "./game/game_manager.js";
import { EnemySpawnerScript } from "./game/enemy_spawner.js";
import { createArena } from "./game/arena.js";

export class GameScene extends Engine.Scene {
    start() {
        let player = createPlayer();
        Engine.Camera.setTarget(player.getComponent("Transform"));
        Engine.AssetManager.addAsset(player, "Player");
        this.addGameObject(player);

        this.addGameObject(createArena());

        let basicBullet = createBasicBullet();
        let basicBulletPrefab = new Engine.GamePrefab(basicBullet);
        this.bindGamePrefab(basicBulletPrefab);
        Engine.AssetManager.addAsset(basicBulletPrefab, "basicBulletPrefab");

        // let homingBullet = createHomingBullet();
        // let homingBulletPrefab = new Engine.GamePrefab(homingBullet);
        // this.bindGamePrefab(homingBulletPrefab);
        // Engine.AssetManager.addAsset(homingBulletPrefab, "homingBulletPrefab");

        let enemy = createEnemy();
        let enemyPrefab = new Engine.GamePrefab(enemy);
        this.bindGamePrefab(enemyPrefab);
        Engine.AssetManager.addAsset(enemyPrefab, "EnemyPrefab");

        this.addScript(new GameManager());
        this.addScript(new EnemySpawnerScript());

        // let surface = new Engine.UI.Surface({ fillColor: [70], borderColor: [0, 0] }, 0, 0, 300, height);
        // surface.isVisible = false;
        // this.addUIElement(surface);
        // Engine.Events.addEventListener("ScenePaused", () => (surface.isVisible = true));
        // Engine.Events.addEventListener("SceneUnpaused", () => (surface.isVisible = false));

        // let coolStyle = { borderColor: [255, 255, 255, 255], fillColor: [255] };
        // surface.addUIElement(new Engine.UI.Text(coolStyle, "Move with WASD", 50, 50));
        // let mainMenuBtn = new Engine.UI.Button(coolStyle, 50, 100, 120, 40);
        // surface.addUIElement(mainMenuBtn);
        // mainMenuBtn.addEventListener("LeftMouseReleased", () => Engine.SceneManager.changeScene("MainMenuScene"));
    }

    onEnter() {
        noCursor();
    }

    onExit() {
        cursor();
    }

    background() {
        background(80);
    }

    overlay() {
        strokeWeight(2);
        stroke(255);
        fill(0, 0);
        // fill(55, 105, 155);
        circle(mouseX, mouseY, 20);
        line(mouseX, mouseY - 20, mouseX, mouseY + 20);
        line(mouseX - 20, mouseY, mouseX + 20, mouseY);
    }
}
