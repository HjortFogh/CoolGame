import { createPoint } from "../point.js";
import { Model } from "./component.js";

export class Transform extends Model {
    position;
    scale;
    rotation;

    start(pos = createPoint(0, 0), scale = createPoint(50, 50), rot = 0) {
        this.position = pos;
        this.scale = scale;
        this.rotation = rot;
    }
}
