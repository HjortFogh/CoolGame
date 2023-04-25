import * as Engine from "../../engine/engine.js";

export class EnemySpawnerScript extends Engine.Script {
    enemies = [];
    waveNumber = 10;

    start() {
        this.enemyPrefab = Engine.AssetManager.getAsset("EnemyPrefab");
        Engine.Events.addEventListener("SpawnWave", () => this.spawnWave());
    }

    update() {
        if (this.waveCleared()) Engine.Events.triggerEvent("WaveCleared", this.waveNumber);
    }

    waveCleared() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            let enemy = this.enemies[i];
            if (enemy.isDestroyed()) this.enemies.splice(i);
            else return false;
        }
        return true;
    }

    spawnWave() {
        let numEnemies = this.waveNumber;
        for (let i = 0; i < numEnemies; i++) {
            let enemy = this.enemyPrefab.spawn();
            this.enemies.push(enemy);

            let angle = Math.random() * Math.PI * 2;
            let distance = Math.random() * 250 + 1250;

            let xPos = Math.cos(angle) * distance;
            let yPos = Math.sin(angle) * distance;

            enemy.getComponent("Transform").position.set(Engine.createVector(xPos, yPos));
        }
        this.waveNumber++;
    }
}
