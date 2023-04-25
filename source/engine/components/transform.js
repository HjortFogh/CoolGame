import { createVector } from "../vector.js";
import { Model } from "./component.js";

export class Transform extends Model {
    position;
    scale;
    rotation;

    start(pos = createVector(0, 0), scale = createVector(50, 50), rot = 0) {
        this.position = pos;
        this.scale = scale;
        this.rotation = rot;
    }
}
