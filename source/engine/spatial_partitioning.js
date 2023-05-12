// Exports:
// - SpatialManager

import { createRect, pointWithinRect, rectOverlap } from "./vector.js";

/**
 * Number of points per tree, before it is further sub-divided
 * @type {Int}
 */
const TREE_CAPACITY = 8;

/**
 * A recursive tree structure, which is used to quickly find all points within an area
 */
class RTree {
    /**
     * @type {Object} Rectangle with x, y, w, h
     */
    #area;
    /**
     * @type {Array<RTree>}
     */
    #subTrees = [];
    /**
     * @type {Array<Vector>}
     */
    #points = [];
    /**
     * Number of divisions on each axis
     * @type {Int}
     */
    #divisions;
    /**
     * @type {Boolean}
     */
    #isDivided = false;

    /**
     * Creates a new RTree
     * @param {Int} divisions Number of sub-divisions
     * @param {Object} area Rectangle which the RTree should cover
     */
    constructor(divisions, area) {
        this.#area = area;
        this.#divisions = divisions;
    }

    /**
     * Splits the current RTree into multiple sub-RTree(s)
     */
    generateSubTrees() {
        this.#isDivided = true;

        let treeWidth = this.#area.w / this.#divisions;
        let treeHeight = this.#area.h / this.#divisions;

        for (let x = 0; x < this.#divisions; x++) {
            for (let y = 0; y < this.#divisions; y++) {
                let area = new createRect(this.#area.x + x * treeWidth, this.#area.y + y * treeHeight, treeWidth, treeHeight);
                this.#subTrees.push(new RTree(this.#divisions, area));
            }
        }
    }

    /**
     * Adds a point to the RTree \
     * If a RTree is at its max capacity (TREE_CAPACITY), the RTree will sub-divide
     * @param {Vector} pos
     * @param {*} userdata Information tied to every point
     */
    addPoint(pos, userdata) {
        if (!pointWithinRect(pos, this.#area)) return;

        if (this.#points.length < TREE_CAPACITY) {
            this.#points.push({ position: pos, userdata: userdata });
        } else {
            if (!this.#isDivided) this.generateSubTrees();
            for (let tree of this.#subTrees) tree.addPoint(pos, userdata);
        }
    }

    /**
     * Resets the RTree
     */
    reset() {
        this.#points = [];
        this.#isDivided = false;
        this.#subTrees = [];
    }

    /**
     * Get all points within an area
     * @param {Object} area Rectangle area with x, y, w, h
     * @param {Array<*>} buffer The array the points will be pushed to
     */
    get(area, buffer) {
        if (!rectOverlap(area, this.#area)) return;

        let pointsWithinArea = [];
        for (let point of this.#points) {
            if (pointWithinRect(point.position, area)) pointsWithinArea.push(point.userdata);
        }

        Array.prototype.push.apply(buffer, pointsWithinArea);
        if (this.#isDivided) {
            for (let tree of this.#subTrees) tree.get(area, buffer);
        }
    }
}

/**
 * Manages a RTree which covers the game world
 */
export class SpatialManager {
    /**
     * @type {RTree}
     * @static
     */
    static rTree = new RTree(4, createRect(-5000, -5000, 10000, 10000));

    /**
     * Gets called every frame to generate a new RTree
     * @param {Array<GameObject>} gameObjects
     * @static
     */
    static generate(gameObjects) {
        this.rTree.reset();
        for (let gameObject of gameObjects) {
            let transform = gameObject.getComponent("Transform");
            this.rTree.addPoint(transform.position, gameObject);
        }
    }

    /**
     * Retrive all GameObject(s) within an area
     * @param {Object} area Rectangle area with x, y, w, h
     * @returns {Array<GameObject>}
     */
    static get(area) {
        let objects = [];
        this.rTree.get(area, objects);
        return objects;
    }
}
