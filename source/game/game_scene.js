// Exports:
// - GameScene

import { Engine } from "../engine/engine.js";
import { PlayerStatusViewer, createPlayer } from "./game/player.js";
import { createEnemy } from "./game/enemy.js";
import { createBasicBullet } from "./game/bullet.js";
import { GameManager } from "./game/game_manager.js";
import { EnemySpawnerScript, WaveInfo } from "./game/wave_manager.js";
import { createArena } from "./game/arena.js";

class PauseMenu extends Engine.UIElement {
    start() {
        Engine.Events.addEventListener("gameScene/paused", () => this.enabled(true));
        Engine.Events.addEventListener("gameScene/unpaused", () => this.enabled(false));
        this.enabled(false);

        this.setSize(Engine.createVector(width, height));
        this.addElement(new PauseModal());
    }

    displayElement() {
        let size = this.getSize();
        noStroke();
        fill(255, 120);
        rect(0, 0, size.x, size.y);
    }
}

class PauseModal extends Engine.UIElement {
    start() {
        this.setPosition(Engine.createVector(200, 50));
        this.setSize(Engine.createVector(width - 400, height - 100));
    }

    updateElement() {}

    displayElement() {
        let size = this.getSize();
        noStroke();
        fill(70);
        rect(0, 0, size.x, size.y);
    }
}

export class GameScene extends Engine.Scene {
    start() {
        this.player = createPlayer();
        Engine.Camera.setTarget(this.player.getComponent("Transform"));
        Engine.AssetManager.addAsset(this.player, "Player");
        this.addGameObject(this.player);

        this.addGameObject(createArena());

        let basicBullet = createBasicBullet();
        let basicBulletPrefab = new Engine.GamePrefab(basicBullet);
        this.bindGamePrefab(basicBulletPrefab);
        Engine.AssetManager.addAsset(basicBulletPrefab, "basicBulletPrefab");

        let enemy = createEnemy();
        let enemyPrefab = new Engine.GamePrefab(enemy);
        this.bindGamePrefab(enemyPrefab);
        Engine.AssetManager.addAsset(enemyPrefab, "EnemyPrefab");

        this.addScript(new EnemySpawnerScript());
        this.addScript(new GameManager());

        this.addUIElement(new PlayerStatusViewer());
        this.addUIElement(new WaveInfo());
        this.addUIElement(new PauseMenu());
    }

    onEnter() {
        noCursor();
        Engine.Events.triggerEvent("game/started");
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
