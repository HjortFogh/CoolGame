import { Engine } from "../../engine/engine.js";
import { EntityStat } from "./entity.js";

export class Damageable extends Engine.Model {
    entityStat = null;
    immunityTime;
    immune = false;

    start(immunityTime = 0.1) {
        this.entityStat = this.gameObject.getComponent("EntityStat");
        if (this.entityStat === undefined) {
            this.entityStat = new EntityStat();
            this.gameObject.addComponent(this.entityStat);
        }
        this.immunityTime = immunityTime;
    }

    restart() {
        this.immune = false;
    }

    damage(amount) {
        if (this.immune) return;
        this.entityStat.health -= amount;
        if (this.immunityTime > 0) {
            this.immune = true;
            Engine.Time.createTimer(() => (this.immune = false), this.immunityTime);
        }
    }
}
