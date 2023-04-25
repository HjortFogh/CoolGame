import * as Engine from "../../engine/engine.js";

import { createPlayer } from "./player.js";
import { createEnemy } from "./enemy.js";
import { createBullet } from "./bullet.js";
import { GameManager } from "./game_manager.js";
import { EnemySpawnerScript } from "./enemy_spawner.js";
import { createArena } from "./arena.js";

export class GameScene extends Engine.Scene {
    start() {
        let player = createPlayer();
        Engine.Camera.setTarget(player.getComponent("Transform"));
        Engine.AssetManager.addAsset(player, "Player");
        this.addGameObject(player);

        this.addGameObject(createArena());

        let bullet = createBullet();
        let bulletPrefab = new Engine.GamePrefab(bullet);
        this.bindGamePrefab(bulletPrefab);
        Engine.AssetManager.addAsset(bulletPrefab, "BulletPrefab");

        let enemy = createEnemy();
        let enemyPrefab = new Engine.GamePrefab(enemy);
        this.bindGamePrefab(enemyPrefab);
        Engine.AssetManager.addAsset(enemyPrefab, "EnemyPrefab");

        this.bindScript(new GameManager());
        this.bindScript(new EnemySpawnerScript());

        let surface = new Engine.UI.Surface({ fillColor: [70], borderColor: [0, 0] }, 0, 0, 300, height);
        surface.isVisible = false;
        this.addUIElement(surface);
        Engine.Events.addEventListener("ScenePaused", () => (surface.isVisible = true));
        Engine.Events.addEventListener("SceneUnpaused", () => (surface.isVisible = false));

        let coolStyle = { borderColor: [255, 255, 255, 255], fillColor: [255] };
        surface.addUIElement(new Engine.UI.Text(coolStyle, "Move with WASD", 50, 50));
        let mainMenuBtn = new Engine.UI.Button(coolStyle, 50, 100, 120, 40);
        surface.addUIElement(mainMenuBtn);
        mainMenuBtn.addEventListener("LeftMouseReleased", () => Engine.SceneManager.changeScene("MainMenuScene"));
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
