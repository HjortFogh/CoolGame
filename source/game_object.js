// Game object

import { Component, Model, Viewer, Controller, Transform } from "./components.js";

export class GameObject {
    models;
    viewers;
    controllers;

    constructor(transform = new Transform()) {
        this.models = [];
        this.viewers = [];
        this.controllers = [];

        this.addComponent(transform);
    }

    getComponent(comp) {
        if (!comp.prototype instanceof Component) return;

        let findComponent = (list) => list.find((value) => value instanceof comp);

        if (comp.prototype instanceof Model) return findComponent(this.models);
        if (comp.prototype instanceof Viewer) return findComponent(this.viewers);
        if (comp.prototype instanceof Controller) return findComponent(this.controllers);
    }

    getComponents(comp) {}

    addComponent(comp) {
        if (!(comp instanceof Component)) throw `'${comp.constructor.name}' not of type 'Component'`;

        comp.initialize(this);
        comp.start();

        if (comp instanceof Model) this.models.push(comp);
        if (comp instanceof Viewer) this.viewers.push(comp);
        if (comp instanceof Controller) this.controllers.push(comp);
    }

    update() {
        this.controllers.forEach((comp) => comp.update());
    }
    display() {
        this.viewers.forEach((view) => view.display());
    }
}
