export function createPoint(x, y) {
    return { x: x, y: y };
}

export function createRect(x, y, w, h) {
    return { x: x, y: y, w: w, h: h };
}

export function lerpPoint(P1, P2, amt) {
    return createPoint((P1.x - P2.x) * amt + P2.x, (P1.y - P2.y) * amt + P2.y);
}

export function pointWithinRect(P, R) {
    return !(P.x < R.x || P.x >= R.x + R.w || P.y < R.y || P.y >= R.y + R.h);
}

export function rectOverlap(R1, R2) {
    return !(R1.x > R2.x + R2.w || R1.x + R1.w <= R2.x || R1.y > R2.y + R2.h || R1.y + R1.h <= R2.y);
}
