import { Engine } from "../../engine/engine.js";

export class EnemySpawnerScript extends Engine.Script {
    enemies = [];
    waveNumber = 0;

    start() {
        this.enemyPrefab = Engine.AssetManager.getAsset("EnemyPrefab");
        Engine.Events.addEventListener("wave/spawn", () => this.spawnWave());
        Engine.Events.addEventListener("game/started", () => this.gameStarted());
    }

    update() {
        if (this.waveCleared()) {
            this.waveNumber++;
            Engine.Events.triggerEvent("wave/cleared", this.waveNumber);
        }
    }

    calculateNumberEnemies() {
        return this.waveNumber;
    }

    waveCleared() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            let enemy = this.enemies[i];
            if (enemy.isDestroyed()) {
                this.enemies.splice(i);
                Engine.Events.triggerEvent("enemy/killed", this.enemies.length, this.calculateNumberEnemies());
            } else return false;
        }
        return true;
    }

    spawnWave() {
        let numEnemies = this.calculateNumberEnemies();
        for (let i = 0; i < numEnemies; i++) {
            let enemy = this.enemyPrefab.spawn();
            this.enemies.push(enemy);

            let angle = Math.random() * Math.PI * 2;
            let distance = Math.random() * 250 + 1250;

            let xPos = Math.cos(angle) * distance;
            let yPos = Math.sin(angle) * distance;

            enemy.getComponent("Transform").position.set(Engine.createVector(xPos, yPos));
        }
    }

    gameStarted() {
        this.waveNumber = 0;
        for (let enemy of this.enemies) enemy.destroy();
        this.enemies = [];
    }
}

export class WaveInfo extends Engine.UIElement {
    waveNumber = 0;
    wavePercentRemaining = 0.7;

    start() {
        Engine.Events.addEventListener("player/died", () => this.enabled(false));
        Engine.Events.addEventListener("game/started", () => this.enabled(true));

        let size = Engine.createVector(125);
        this.setPosition(Engine.createVector(width - size.x - 50, 30));
        this.setSize(size);

        Engine.Events.addEventListener("wave/cleared", (waveNumber) => {
            this.waveNumber = waveNumber;
            this.wavePercentRemaining = 1;
        });
        // Engine.Events.addEventListener("enemy/killed", (remainingEnemies, beginingEnemies) => {
        //     // console.log("Killed enemy #", remainingEnemies, "/", beginingEnemies, "::", remainingEnemies / beginingEnemies, "%");
        //     this.wavePercentRemaining = remainingEnemies / beginingEnemies;
        // });
    }

    displayElement() {
        let size = this.getSize();

        noStroke();
        fill(255);

        let startAngle = 1.5 * PI;
        let endAngle = startAngle + this.wavePercentRemaining * TWO_PI;
        arc(size.x / 2, size.y / 2, size.x, size.y, startAngle, endAngle, PIE);

        fill(70);

        beginShape();
        for (let i = 0; i < 8; i++) {
            let angle = ((Math.PI * 2) / 8) * i;
            let pos = Engine.createVector(Math.cos(angle), Math.sin(angle)).mult(size.x * 0.45);
            vertex(size.x / 2 + pos.x, size.y / 2 + pos.y);
        }
        endShape(CLOSE);

        strokeWeight(2);
        stroke(255);
        fill(255);

        textFont("monospace");
        textSize(40);
        textAlign(CENTER, CENTER);

        text(this.waveNumber, size.x / 2, size.y / 2);
    }
}
