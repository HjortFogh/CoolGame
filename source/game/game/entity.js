import * as Engine from "../../engine/engine.js";

export class EntityStat extends Engine.Model {
    baseHealth = 3;
    currentHealth = this.baseHealth;
    baseDamage = 0.5;
    baseSpeed = 200;

    onDeathListeners = [];

    set health(amount) {
        this.currentHealth = amount;
        if (this.currentHealth <= 0) this.triggerDeathListener();
    }
    get health() {
        return this.currentHealth;
    }

    get speed() {
        return this.baseSpeed;
    }

    start(stats = {}) {
        if ("baseHealth" in stats) this.baseHealth = stats.baseHealth;
        if ("baseHealth" in stats) this.health = stats.baseHealth;
        if ("baseDamage" in stats) this.baseDamage = stats.baseDamage;
        if ("baseSpeed" in stats) this.baseSpeed = stats.baseSpeed;
    }

    addDeathListener(callback) {
        this.onDeathListeners.push(callback);
    }

    triggerDeathListener() {
        for (let listener of this.onDeathListeners) listener();
    }
}

export class HealthViewer extends Engine.Viewer {
    start() {
        this.stat = this.gameObject.getComponent("EntityStat");
        this.transform = this.gameObject.getComponent("Transform");
        this.setViewLayer(20);
    }

    display() {
        let pos = this.transform.position;
        let w = 60;
        let h = 20;

        noStroke();
        fill(0);
        rect(pos.x - w / 2, pos.y + 60, w, h);
        fill(220, 50, 20);
        rect(pos.x - w / 2, pos.y + 60, w * (this.stat.health / this.stat.baseHealth), h);
    }
}
