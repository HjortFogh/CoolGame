// Exports:
// - Sprite
// - SpriteAtlas

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
     * @param {Float} x X-coordinate
     * @param {Float} y Y-coordinate
     * @param {Float} w Width
     * @param {Float} h Height
     */
    display(x = 0, y = 0, w = undefined, h = undefined) {
        if (this.#image === undefined) return;

        imageMode(CENTER);
        noSmooth();

        if (w === undefined || h === undefined) image(this.#image, x, y);
        else image(this.#image, x, y, w, h);
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
        for (let i = 0; i < spriteNames.length; i++) {
            let x = (i * spriteScale.x) % atlas.width;
            let y = (Math.floor((i * spriteScale.x) / atlas.width) * spriteScale.y) % atlas.height;

            let image = createImage(spriteScale.x, spriteScale.y);
            image.copy(atlas, x, y, spriteScale.x, spriteScale.y, 0, 0, spriteScale.x, spriteScale.y);

            let sprite = new Sprite(image);

            let spriteKey = spriteNames[i];

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
