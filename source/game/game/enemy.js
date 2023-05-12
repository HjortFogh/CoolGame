import { Engine } from "../../engine/engine.js";

import { Damageable } from "./damage.js";
import { EntityStat } from "./entity.js";

class EnemyViewer extends Engine.Viewer {
    start() {
        this.transform = this.gameObject.getComponent("Transform");
        this.transform.scale.set(Engine.createVector(50));
        this.setViewLayer(5);
    }

    display() {
        noStroke();
        fill(255, 80, 140);
        circle(this.transform.position.x, this.transform.position.y, this.transform.scale.x);
    }
}

class BasicEnemyController extends Engine.Controller {
    start() {
        this.transform = this.gameObject.getComponent("Transform");
        this.playerTransform = Engine.AssetManager.getAsset("Player").getComponent("Transform");

        this.stats = this.gameObject.getComponent("EntityStat");

        this.bulletPrefab = Engine.AssetManager.getAsset("basicBulletPrefab");
        Engine.Time.createTimer(() => this.shoot(), 1);

        this.stats.addEventListener("death", () => this.gameObject.destroy());
        this.gameObject.onDestroy(() => (this.isDead = true));
    }

    update() {
        let move = Engine.Vector.sub(this.playerTransform.position, this.transform.position);
        move.setMagnitude(this.stats.speed * Engine.Time.deltaTime());
        this.transform.position.add(move);
    }

    shoot() {
        if (this.isDead) return;
        Engine.Time.createTimer(() => this.shoot(), 0.5);
        let bullet = this.bulletPrefab.spawn();
        let rotation = Math.atan2(this.playerTransform.position.y - this.transform.position.y, this.playerTransform.position.x - this.transform.position.x);
        bullet.getComponent("BasicBulletController").fire(this.gameObject, this.transform.position, rotation, 1, 300);
    }
}

export class EnemyHealthViewer extends Engine.Viewer {
    start() {
        this.stat = this.gameObject.getComponent("EntityStat");
        this.transform = this.gameObject.getComponent("Transform");
        this.setViewLayer(8);
    }

    display() {
        let pos = this.transform.position;
        let w = 60;
        let h = 20;

        noStroke();
        fill(0);
        rect(pos.x - w / 2, pos.y + 60, w, h);
        fill(220, 50, 20);
        rect(pos.x - w / 2, pos.y + 60, w * (this.stat.health / this.stat.baseHealth), h);
    }
}

export function createEnemy() {
    let controller = new BasicEnemyController();
    let viewer = new EnemyViewer();
    let healthViewer = new EnemyHealthViewer();
    let collider = new Engine.RectCollider(Engine.createVector(50));

    let stat = new EntityStat();
    stat.setTag("Enemy");
    let damageable = new Damageable();

    return Engine.createGameObject(controller, viewer, collider, stat, damageable, healthViewer);
}
