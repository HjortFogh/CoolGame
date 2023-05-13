// Exports:
// - EntityStat

import { Engine } from "../../engine/engine.js";

/**
 * The stats of either the player or an enemy
 */
export class EntityStat extends Engine.Model {
    /**
     * @type {Int}
     */
    #startingHealth;
    /**
     * @type {Int}
     */
    #health;
    /**
     * @type {Int}
     */
    #damage;
    /**
     * @type {Object}
     */
    #listeners = {};
    /**
     * @type {Array<Function>}
     */
    #tag = "";

    /**
     * Starts the EntityStat Component
     * @param {Int} health Amount of starting health
     * @param {Int} damage The damage amount of the entity
     */
    start(health = 5, damage = 1) {
        this.#startingHealth = this.#health = health;
        this.#damage = damage;
    }

    /**
     * Reset the entity when the game is reset
     */
    restart() {
        this.#health = this.#startingHealth;
    }

    /**
     * Damage the entity
     * @param {Int} amount
     */
    damage(amount) {
        this.#health -= amount;
        this.triggerEvent("damage");
        if (this.#health <= 0) this.triggerEvent("death");
    }

    /**
     * Returns the damage
     * @returns {Int}
     */
    getDamage() {
        return this.#damage;
    }

    /**
     * @returns {Float} The percent of health left from 0 to 1
     */
    getHealthPercentage() {
        return this.#health / this.#startingHealth;
    }

    /**
     * @returns {Int} The starting health
     */
    getStartingHealth() {
        return this.#startingHealth;
    }

    /**
     * Adds a callback to a event ("death", "damage")
     * @param {String} event
     * @param {Function} callback
     */
    addEventListener(event, callback) {
        if (this.#listeners[event] === undefined) this.#listeners[event] = [];
        this.#listeners[event].push(callback);
    }

    /**
     * Trigger an event
     * @param {String} event
     */
    triggerEvent(event) {
        if (this.#listeners[event] === undefined) return;
        for (let listener of this.#listeners[event]) listener();
    }

    /**
     * Sets the tag
     * @param {String} tag
     */
    setTag(tag) {
        this.#tag = tag;
    }

    /**
     * Returns the tag of the entity
     * @returns {String}
     */
    getTag() {
        return this.#tag;
    }
}
