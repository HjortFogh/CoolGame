import { SceneManager } from "./engine.js";

export class Time {
    static timers = [];

    static tick() {
        for (let i = this.timers.length - 1; i >= 0; i--) {
            if (SceneManager.activeSceneName != this.timers[i].scene) continue;
            this.timers[i].counter += this.deltaTime();
            if (this.timers[i].counter >= this.timers[i].time) {
                this.timers[i].callback();
                this.timers.splice(i, 1);
            }
        }
    }

    /**
     * @returns Time since last frame in seconds
     */
    static deltaTime() {
        return deltaTime * 0.001;
    }

    static now() {
        return Date.now();
    }

    static createTimer(callback, timeInSeconds) {
        this.timers.push({ callback: callback, time: timeInSeconds, counter: 0, scene: SceneManager.activeSceneName });
    }
}
