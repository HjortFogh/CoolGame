import * as Engine from "../../engine/engine.js";
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

    damage(amount) {
        if (this.immune) return;
        this.entityStat.health -= amount;
        if (this.immunityTime > 0) {
            Engine.Time.createTimer(() => this.immunityEnded(), this.immunityTime);
            this.immune = true;
        }
    }

    immunityEnded() {
        this.immune = false;
    }
}
