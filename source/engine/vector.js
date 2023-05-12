export class Vector {
    x;
    y;

    constructor(x = 0, y = x) {
        this.x = x;
        this.y = y;
    }

    static add(vec1, vec2) {
        return new Vector(vec1.x + vec2.x, vec1.y + vec2.y);
    }

    static sub(vec1, vec2) {
        return new Vector(vec1.x - vec2.x, vec1.y - vec2.y);
    }

    static mult(vec, scalar) {
        return new Vector(vec.x * scalar, vec.y * scalar);
    }

    isZero() {
        return this.x == 0 && this.y == 0;
    }

    set(vec) {
        this.x = vec.x;
        this.y = vec.y;
        return this;
    }

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    sub(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }

    dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }

    mult(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    normalize() {
        let mag = this.magnitude();
        if (mag == 0) return this;
        this.x /= mag;
        this.y /= mag;
        return this;
    }

    setMagnitude(mag) {
        this.normalize();
        this.x *= mag;
        this.y *= mag;
        return this;
    }

    copy() {
        return new Vector(this.x, this.y);
    }
}

export function createVector(x, y) {
    return new Vector(x, y);
}

export function createRect(x, y, w, h) {
    return { x: x, y: y, w: w, h: h };
}

export function lerpPoint(P1, P2, amt) {
    return createVector((P1.x - P2.x) * amt + P2.x, (P1.y - P2.y) * amt + P2.y);
}

export function pointWithinRect(P, R) {
    return !(P.x < R.x || P.x >= R.x + R.w || P.y < R.y || P.y >= R.y + R.h);
}

export function rectOverlap(R1, R2) {
    return !(R1.x > R2.x + R2.w || R1.x + R1.w <= R2.x || R1.y > R2.y + R2.h || R1.y + R1.h <= R2.y);
}
