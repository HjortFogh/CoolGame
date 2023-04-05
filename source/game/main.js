import { GamePrefab, createGameObject } from "../engine/canvas/object.js";
import { Transform } from "../engine/components/transform.js";
import * as Engine from "../engine/engine.js";
import { createPoint } from "../engine/point.js";

let viewLayerColors = ["red", "orange", "yellow", "lime", "green"];

class PlayerViewer extends Engine.Viewer {
    start() {
        this.transform = this.gameObject.getComponent(Transform);
        this.setViewLayer(4);
    }

    display() {
        fill(120);
        circle(this.transform.position.x, this.transform.position.y, 50);
    }
}

class BulletViewer extends Engine.Viewer {
    start() {
        this.transform = this.gameObject.getComponent(Transform);
        this.setViewLayer(2);
    }

    display() {
        fill(0, 100);
        circle(this.transform.position.x, this.transform.position.y, 100);
    }
}

class BulletController extends Engine.Controller {
    start() {
        Engine.Time.createTimer(() => this.destroySelf(), 5);
    }

    destroySelf() {
        this.gameObject.destroy();
    }
}

class PlayerController extends Engine.Controller {
    start() {
        this.transform = this.gameObject.getComponent(Transform);
        this.bulletPrefab = Engine.AssetManager.getAsset("BulletPrefab");
    }

    update() {
        this.transform.position.x += (Engine.Input.getInput("d") - Engine.Input.getInput("a")) * 500 * Engine.Time.deltaTime();
        this.transform.position.y += (Engine.Input.getInput("s") - Engine.Input.getInput("w")) * 500 * Engine.Time.deltaTime();
        if (Engine.Input.getInput("left")) {
            let bullet = this.bulletPrefab.spawn();
            bullet.getComponent(Transform).position = createPoint(this.transform.position.x, this.transform.position.y);
        }
    }
}

class TestViewer extends Engine.Viewer {
    start(viewLayer) {
        this.transform = this.gameObject.getComponent(Transform);
        this.setViewLayer(viewLayer);
    }

    display() {
        fill(viewLayerColors[this.viewLayer]);
        circle(this.transform.position.x, this.transform.position.y, 20);
    }
}

class TestController extends Engine.Controller {
    start() {
        this.transform = this.gameObject.getComponent(Transform);
        this.transform.position = createPoint(random(width), random(height));
        Engine.Time.createTimer(() => this.gameObject.restart(), 8);
    }

    update() {
        this.transform.position.x += random(-2, 2);
        this.transform.position.y += random(-2, 2);
        // if (random() < 0.005) this.gameObject.destroy();
    }
}

class TestScene extends Engine.Scene {
    start() {
        console.log("TestScene started!");
        textSize(40);

        this.addGameObject(createGameObject(new PlayerViewer(), new PlayerController()));
        for (let i = 0; i < 1000; i++) this.addGameObject(createGameObject(new TestViewer(int(random(viewLayerColors.length))), new TestController()));

        let bullet = createGameObject(new BulletViewer(), new TestController(), new BulletController());
        let bulletPrefab = new GamePrefab(bullet);
        this.bindGamePrefab(bulletPrefab);
        Engine.AssetManager.addAsset(bulletPrefab, "BulletPrefab");
    }

    onEnter() {
        console.log("Entered TestScene");
    }
    onExit() {
        console.log("Exited TestScene");
    }

    background() {
        background(140, 80, 50);
        if (Engine.Input.getReleased("c")) Engine.SceneManager.transition(new TestTransition(3), "SettingsScene");
    }

    overlay() {
        text(round(frameRate(), 2), 50, 50);
        text(this.gameObjects.length, 50, 100);
    }
}

class SettingsScene extends Engine.Scene {
    start() {
        console.log("Settings started!");
    }

    onEnter() {
        console.log("Entered SettingsScene");
    }
    onExit() {
        console.log("Exited SettingsScene");
    }

    background() {
        background(80);
        if (Engine.Input.getPressed("c")) Engine.SceneManager.transition(new TestTransition(3), "TestScene");
    }
}

class TestTransition extends Engine.SceneTransition {
    start() {
        console.log("TestTransition started!");
    }

    display(p) {
        fill(0);
        if (!this.hasChanged()) rect(0, 0, width * (p * 2), height);
        else rect(width * (p - 0.5) * 2, 0, width, height);
    }
}

function entry() {
    Engine.SceneManager.registerScene(new TestScene(), "TestScene");
    Engine.SceneManager.registerScene(new SettingsScene(), "SettingsScene");
    Engine.SceneManager.setEntryScene("TestScene");
}

Engine.initialize(entry);
