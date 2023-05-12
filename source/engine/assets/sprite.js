// Exports:
// - Sprite
// - SpriteAtlas

import { createVector } from "../vector.js";

/**
 * A Sprite which can be drawn to the canvas
 */
export class Sprite {
    /**
     * @type {p5.Image}
     */
    #image;

    /**
     * @type {Int}
     */
    get width() {
        if (this.#image === undefined) return 0;
        return this.#image.width;
    }

    /**
     * @type {Int}
     */
    get height() {
        if (this.#image === undefined) return 0;
        return this.#image.height;
    }

    /**
     * Creates a Sprite
     * @param {p5.Image} image Image from which the sprite is created
     */
    constructor(image) {
        this.#image = image;
    }

    /**
     * Loads a Sprite
     * @param {String} imagePath Path of image to load
     * @returns Sprite object
     * @static
     */
    static load(imagePath) {
        return new Sprite(loadImage(imagePath));
    }

    /**
     * Displays the Sprite
     * @param {Vector} position Position the Sprite should be drawn at \
     * Default is at (0, 0)
     * @param {Vector} size Size of Sprite \
     * Default is the size of the loaded image
     */
    display(position = createVector(0), size = undefined) {
        if (this.#image === undefined) return;

        imageMode(CENTER);
        noSmooth();

        if (size === undefined) image(this.#image, position.x, position.y);
        else image(this.#image, position.x, position.y, size.x, size.y);
    }
}

/**
 * A SpriteAtlas contains multible Sprite(s)
 */
export class SpriteAtlas {
    /**
     * @type {Object}
     */
    #sprites = {};

    /**
     * Loads a SpriteAtlas and subdivides the atlas into Sprites
     * @param {String} imagePath Path of image to load
     * @param {Vector} spriteScale The scale of each sub-Sprite
     * @param {Array<String>} spriteNames The names of each Sprite, for later export \
     * If duplicates are provided they are instead exported as an array
     * @example
     * let atlas = SpriteAtlas.load("./path/to/atlas.png", createVector(16, 32), ["up", "down", "up"]);
     * atlas.export(); // {"up": [Sprite, Sprite], "down": Sprite}
     * @returns {SpriteAtlas}
     * @static
     */
    static load(imagePath, spriteScale, spriteNames) {
        let spriteAtlas = new SpriteAtlas();
        loadImage(imagePath, (atlas) => spriteAtlas.split(atlas, spriteScale, spriteNames));
        return spriteAtlas;
    }

    /**
     * Divides an atlas into multible Sprite(s)
     * @param {p5.Image} atlas Atlas to subdivide
     * @param {Vector} spriteScale The scale of each sub-Sprite
     * @param {Array<String>} spriteNames The names of each Sprite, for later export
     */
    split(atlas, spriteScale, spriteNames) {
        let numSprites = Math.ceil(atlas.width / spriteScale.x) * Math.ceil(atlas.height / spriteScale.y);
        for (let i = 0; i < numSprites; i++) {
            let x = (i * spriteScale.x) % atlas.width;
            let y = (Math.floor((i * spriteScale.x) / atlas.width) * spriteScale.y) % atlas.height;

            let image = createImage(spriteScale.x, spriteScale.y);
            image.copy(atlas, x, y, spriteScale.x, spriteScale.y, 0, 0, spriteScale.x, spriteScale.y);

            let sprite = new Sprite(image);

            let spriteKey = spriteNames[i % spriteNames.length];

            if (this.#sprites[spriteKey] !== undefined) {
                if (Array.isArray(this.#sprites[spriteKey])) {
                    this.#sprites[spriteKey].push(sprite);
                } else {
                    let oldSprite = this.#sprites[spriteKey];
                    this.#sprites[spriteKey] = [oldSprite, sprite];
                }
            } else {
                this.#sprites[spriteKey] = sprite;
            }
        }
    }

    /**
     * Exports all Sprite(s) in the format: {"sprite1Name": Sprite, "sprite2Name": [Sprite, Sprite]}
     * @returns {Object}
     */
    export() {
        return this.#sprites;
    }
}
