import { Transform } from "./components/transform.js";
import { createRect, pointWithinRect, rectOverlap } from "./point.js";

const TREE_CAPACITY = 8;

class RTree {
    constructor(divisions, area) {
        this.area = area;
        this.points = [];

        this.divisions = divisions;
        this.isDivided = false;
        this.subTrees = [];
    }

    generateSubTrees() {
        this.isDivided = true;

        let treeWidth = this.area.w / this.divisions;
        let treeHeight = this.area.h / this.divisions;

        for (let x = 0; x < this.divisions; x++) {
            for (let y = 0; y < this.divisions; y++) {
                let area = new createRect(this.area.x + x * treeWidth, this.area.y + y * treeHeight, treeWidth, treeHeight);
                this.subTrees.push(new RTree(this.divisions, area));
            }
        }
    }

    addPoint(pos, userdata) {
        if (!pointWithinRect(pos, this.area)) return;

        if (this.points.length < TREE_CAPACITY) {
            this.points.push({ position: pos, userdata: userdata });
        } else {
            if (!this.isDivided) this.generateSubTrees();
            for (let tree of this.subTrees) tree.addPoint(pos, userdata);
        }
    }

    reset() {
        this.points = [];
        this.isDivided = false;
        this.subTrees = [];
    }

    get(area, buffer) {
        if (!rectOverlap(area, this.area)) return;
        let pointsWithinArea = [];
        for (let point of this.points) {
            if (pointWithinRect(point.position, area)) pointsWithinArea.push(point.userdata);
        }
        Array.prototype.push.apply(buffer, pointsWithinArea);
        if (this.isDivided) {
            for (let tree of this.subTrees) tree.get(area, buffer);
        }
    }

    display() {
        strokeWeight(2);
        fill(0, 0);
        stroke(255, 0, 0);
        rect(this.area.x, this.area.y, this.area.w, this.area.h);
        if (this.isDivided) {
            for (let tree of this.subTrees) tree.display();
        }
    }
}

export class SpatialManager {
    static rTree = new RTree(4, createRect(-5000, -5000, 10000, 10000));

    static generate(gameObjects) {
        this.rTree.reset();
        for (let gameObject of gameObjects) {
            let transform = gameObject.getComponent(Transform);
            this.rTree.addPoint(transform.position, gameObject);
        }
    }

    static get(area) {
        let objects = [];
        this.rTree.get(area, objects);
        return objects;
    }

    static display() {
        this.rTree.display();
    }
}
