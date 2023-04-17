export class Sprite {
    constructor(image) {
        this.image = image;
    }

    static load(imagePath) {
        return new Sprite(loadImage(imagePath));
    }

    display(x, y, w, h) {
        if (this.image === undefined) return;
        image(this.image, x, y, w, h);
    }

    // resize() {}
}

export class SpriteAtlas {
    constructor(imagePath, spriteScale) {
        this.sprites = [];
        loadImage(imagePath, (atlas) => this.split(atlas, spriteScale));
        // ...
    }

    split(atlas, spriteScale) {
        for (let x = 0; x < atlas.width; x += spriteScale.x) {
            for (let y = 0; y < atlas.height; y += spriteScale.y) {
                let sprite = createImage(spriteScale.x, spriteScale.y);
                sprite.copy(atlas, x, y, spriteScale.x, spriteScale.y, 0, 0, spriteScale.x, spriteScale.y);
                this.sprites.push(new Sprite(sprite));
            }
        }
    }

    export() {
        return this.sprites.slice();
    }
}
