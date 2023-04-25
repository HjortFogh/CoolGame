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
