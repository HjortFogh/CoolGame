import { Engine } from "../../engine/engine.js";

export class EntityStat extends Engine.Model {
    startingStats = {};
    baseHealth = 3;
    currentHealth = this.baseHealth;
    baseDamage = 0.5;
    baseSpeed = 200;

    listeners = {};

    tag = "";

    set health(amount) {
        if (amount < this.currentHealth) this.triggerEvent("damage", this.currentHealth - amount);
        this.currentHealth = amount;
        if (this.currentHealth <= 0) this.triggerEvent("death");
    }
    get health() {
        return this.currentHealth;
    }

    get speed() {
        return this.baseSpeed;
    }

    start(stats = {}) {
        this.startingStats = stats;
        this.restart();
    }

    restart() {
        if ("baseHealth" in this.startingStats) this.baseHealth = this.startingStats.baseHealth;
        if ("baseHealth" in this.startingStats) this.health = this.startingStats.baseHealth;
        if ("baseDamage" in this.startingStats) this.baseDamage = this.startingStats.baseDamage;
        if ("baseSpeed" in this.startingStats) this.baseSpeed = this.startingStats.baseSpeed;
    }

    setTag(tagName) {
        this.tag = tagName;
    }

    getTag() {
        return this.tag;
    }

    addEventListener(event, callback) {
        if (this.listeners[event] === undefined) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    triggerEvent(event, ...data) {
        if (this.listeners[event] === undefined) return;
        for (let listener of this.listeners[event]) listener(...data);
    }
}
