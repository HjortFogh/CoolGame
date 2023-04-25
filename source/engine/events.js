export class Events {
    static eventListeners = {};

    static addEventListener(event, callback) {
        if (this.eventListeners[event] === undefined) this.eventListeners[event] = [];
        this.eventListeners[event].push(callback);
    }

    static triggerEvent(event, ...data) {
        if (this.eventListeners[event] === undefined) return;
        for (let callback of this.eventListeners[event]) callback(...data);
    }
}
