/**
 * A 2-dimentional vector
 */
export class Vector {
    /**
     * @type {Float}
     */
    x;
    /**
     * @type {Float}
     */
    y;

    /**
     * Create a new Vector
     * @param {Float} x Default is 0
     * @param {Float} y Default is equal to x
     */
    constructor(x = 0, y = x) {
        this.x = x;
        this.y = y;
    }

    /**
     * Add two Vector(s)
     * @param {Vector} vec1
     * @param {Vector} vec2
     * @returns
     * @static
     */
    static add(vec1, vec2) {
        return new Vector(vec1.x + vec2.x, vec1.y + vec2.y);
    }

    /**
     * Subtract two Vector(s)
     * @param {Vector} vec1
     * @param {Vector} vec2
     * @returns
     * @static
     */
    static sub(vec1, vec2) {
        return new Vector(vec1.x - vec2.x, vec1.y - vec2.y);
    }

    /**
     * Multiplie two Vector(s)
     * @param {Vector} vec1
     * @param {Vector} vec2
     * @returns
     * @static
     */
    static mult(vec, scalar) {
        return new Vector(vec.x * scalar, vec.y * scalar);
    }

    /**
     * Checks if the Vector has a length of 0
     * @returns {Boolean}
     */
    isZero() {
        return this.x == 0 && this.y == 0;
    }

    /**
     * Sets the Vector and returns itself
     * @param {Vector} vec
     * @returns {Vector}
     */
    set(vec) {
        this.x = vec.x;
        this.y = vec.y;
        return this;
    }

    /**
     * Adds a Vector to the Vector and returns itself
     * @param {Vector} vec
     * @returns {Vector}
     */
    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    /**
     * Subtracts a Vector from the Vector and returns itself
     * @param {Vector} vec
     * @returns {Vector}
     */
    sub(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }

    /**
     * Calculates the dot product
     * @param {Vector} vec
     * @returns {Float}
     */
    dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }

    /**
     * Multiple the Vector with a scalar and return itself
     * @param {Float} scalar
     * @returns {Vector}
     */
    mult(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    /**
     * Gets the magnitude of the Vector
     * @returns {Float}
     */
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    /**
     * Normalize the Vector, meaning its magnitude will be set to 1 and returns itself
     * @returns {Vector}
     */
    normalize() {
        let mag = this.magnitude();
        if (mag == 0) return this;
        this.x /= mag;
        this.y /= mag;
        return this;
    }

    /**
     * Set the magnitude of the vector
     * @param {Float} mag
     * @returns {Vector}
     */
    setMagnitude(mag) {
        this.normalize();
        this.x *= mag;
        this.y *= mag;
        return this;
    }

    /**
     * Return a copy of the Vector
     * @returns {Vector}
     */
    copy() {
        return new Vector(this.x, this.y);
    }
}

/**
 * Create a new Vector
 * @param {Float} x
 * @param {Float} y
 * @returns {Vector}
 */
export function createVector(x, y) {
    return new Vector(x, y);
}

/**
 * Create a new rectangle
 * @param {Float} x
 * @param {Float} y
 * @param {Float} w
 * @param {Float} h
 * @returns {Object}
 */
export function createRect(x, y, w, h) {
    return { x: x, y: y, w: w, h: h };
}

/**
 * Lerps between two Vector(s) with a given amount
 * @param {Vector} P1
 * @param {Vector} P2
 * @param {Float} amt
 * @returns {Vector}
 */
export function lerpPoint(P1, P2, amt) {
    return createVector((P1.x - P2.x) * amt + P2.x, (P1.y - P2.y) * amt + P2.y);
}

/**
 * Checks if the point is within a rectangle
 * @param {Vector} P
 * @param {Object} R
 * @returns {Boolean}
 */
export function pointWithinRect(P, R) {
    return !(P.x < R.x || P.x >= R.x + R.w || P.y < R.y || P.y >= R.y + R.h);
}

/**
 * Checks if two rectangles overlap
 * @param {Object} R1
 * @param {Object} R2
 * @returns {Boolean}
 */
export function rectOverlap(R1, R2) {
    return !(R1.x > R2.x + R2.w || R1.x + R1.w <= R2.x || R1.y > R2.y + R2.h || R1.y + R1.h <= R2.y);
}
