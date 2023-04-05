import { createPoint } from "../point.js";
import { Model } from "./component.js";

export class Transform extends Model {
    position = createPoint(0, 0);
    scale = createPoint(1, 1);
    rotation = 0;
}
