const FRAMERATE_READINGS = 100;

export class PerformanceManager {
    static framerates = [];
    static maxFramerate = 60;
    static minFramerate = 0;

    static initialize() {
        for (let i = 0; i < FRAMERATE_READINGS; i++) this.framerates.push(0);
    }

    static tick() {
        let newFramerate = frameRate();

        this.framerates.shift();
        this.framerates.push(newFramerate);

        if (newFramerate > this.maxFramerate) this.maxFramerate = newFramerate;
        else if (newFramerate < this.minFramerate) this.minFramerate = newFramerate;
    }

    static displayFPS() {
        let graphSize = createVector(500, 250);
        let graphPos = createVector(width - graphSize.x - 50, height - graphSize.y - 50);

        noStroke();
        fill(255);
        rect(graphPos.x, graphPos.y, graphSize.x, graphSize.y);

        for (let i = 0; i < FRAMERATE_READINGS; i++) {
            let w = graphSize.x / FRAMERATE_READINGS;
            let x = w * i;

            let p = (this.framerates[i] - this.minFramerate) / (this.maxFramerate - this.minFramerate);

            fill(255 * (1 - p), 255 * p, 0);
            rect(graphPos.x + x, graphPos.y + graphSize.y, w, -p * graphSize.y);
        }
    }
}
