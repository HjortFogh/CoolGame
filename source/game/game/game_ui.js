// Exports:
// - PlayerHealthbar
// - WaveInfo

import { Engine } from "../../engine/engine.js";

/**
 * Shows the player health in the top left corner
 */
export class PlayerHealthbar extends Engine.UIElement {
    /**
     * @type {EntityStat}
     */
    #playerStat;

    /**
     * Setup events, position and size
     */
    start() {
        Engine.Events.addEventListener("player/died", () => this.enabled(false));
        Engine.Events.addEventListener("game/started", () => this.enabled(true));
        this.#playerStat = Engine.AssetManager.getAsset("player").getComponent("EntityStat");
        this.setSize(Engine.createVector(300, 50));
        this.setPosition(Engine.createVector(50));
    }

    /**
     * Display the healthbar
     */
    displayElement() {
        let size = this.getSize();
        noStroke();

        fill(140);
        rect(0, 0, size.x, size.y);

        fill(229, 58, 45);
        rect(0, 0, size.x * this.#playerStat.getHealthPercentage(), size.y);

        strokeWeight(4);
        stroke(70);
        for (let i = 0; i < this.#playerStat.getStartingHealth() - 1; i++) {
            let x = (i + 1) * (size.x / this.#playerStat.getStartingHealth());
            line(x, 0, x, 10);
            line(x, size.y, x, size.y - 10);
        }
    }
}

/**
 * Shows the wave number and the amount of enemies left in the top right corner
 */
export class WaveInfo extends Engine.UIElement {
    /**
     * @type {Int}
     */
    #waveNumber = 0;
    /**
     * @type {Float}
     */
    #wavePercentRemaining = 1;

    /**
     * Adds event listeners and sets up size and position
     */
    start() {
        Engine.Events.addEventListener("player/died", () => this.enabled(false));
        Engine.Events.addEventListener("game/started", () => this.enabled(true));

        let size = Engine.createVector(125);
        this.setPosition(Engine.createVector(width - size.x - 50, 30));
        this.setSize(size);

        Engine.Events.addEventListener("wave/cleared", (waveNumber) => {
            this.#waveNumber = waveNumber;
            this.#wavePercentRemaining = 1;
        });
        Engine.Events.addEventListener("enemy/killed", (remainingEnemies, beginingEnemies) => {
            this.#wavePercentRemaining = remainingEnemies / beginingEnemies;
        });
    }

    /**
     * Display the wave information
     */
    displayElement() {
        let size = this.getSize();

        noStroke();
        fill(255);

        let startAngle = 1.5 * PI;
        let endAngle = startAngle + this.#wavePercentRemaining * TWO_PI;
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

        text(this.#waveNumber, size.x / 2, size.y / 2);
    }
}
