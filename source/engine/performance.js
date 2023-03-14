const FRAMERATE_READINGS = 120;

export class PerformanceManager {
    static framerates = [];
    static maxFramerate = 80;

    static initialize() {
        for (let i = 0; i < FRAMERATE_READINGS; i++) this.framerates.push(0);
    }

    static tick() {
        let newFramerate = frameRate();

        this.framerates.shift();
        this.framerates.push(newFramerate);

        if (newFramerate > this.maxFramerate) this.maxFramerate = newFramerate;
    }

    static displayFPS(size = createVector(500, 250), pos = createVector(width - size.x - 50, height - size.y - 50)) {
        noStroke();
        fill(255);
        rect(pos.x, pos.y, size.x, size.y);

        stroke(0);
        strokeWeight(2);
        let ly = 1 - 60 / this.maxFramerate;
        line(pos.x, pos.y + ly * size.y, pos.x + size.x, pos.y + ly * size.y);

        noStroke();
        for (let i = 0; i < FRAMERATE_READINGS; i++) {
            let w = size.x / FRAMERATE_READINGS;
            let x = w * i;

            let p = this.framerates[i] / this.maxFramerate;

            fill(255 * (1 - p), 255 * p, 0);
            rect(pos.x + x, pos.y + size.y, w, -p * size.y);
        }
    }

    // static display
}
