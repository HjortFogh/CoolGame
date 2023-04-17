import { Sprite, SpriteAtlas } from "../engine/assets/sprite.js";
import { GamePrefab, createGameObject } from "../engine/canvas/object.js";
import { Camera } from "../engine/canvas/scene.js";
import { Animator } from "../engine/components/animation.js";
import { CircleCollider, CollisionEvent, RectCollider } from "../engine/components/collisions.js";
import { Transform } from "../engine/components/transform.js";
import * as Engine from "../engine/engine.js";
import { createPoint } from "../engine/point.js";

let viewLayerColors = ["red", "orange", "yellow", "lime", "green"];

// class PlayerViewer extends Engine.Viewer {
//     start() {
//         imageMode(CENTER);
//         noSmooth();
//         this.transform = this.gameObject.getComponent(Transform);
//         // this.collider = this.gameObject.getComponent(CircleCollider);
//         this.setViewLayer(4);
//         this.sprites = Engine.AssetManager.getAsset("PigImage").sprites;
//     }

//     display() {
//         fill(120);

//     }
// }

class PlayerController extends Engine.Controller {
    start() {
        this.transform = this.gameObject.getComponent(Transform);
        Camera.setTarget(this.transform);
        this.bulletPrefab = Engine.AssetManager.getAsset("BulletPrefab");
        this.gameObject.destroy = () => 0;
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
        this.transform = this.gameObject.getComponent(Transform);
        Engine.Time.createTimer(() => this.gameObject.destroy(), 5);
    }

    update() {
        this.transform.position.x += random(-2, 2);
        this.transform.position.y += random(-2, 2);
    }
}

class TestViewer extends Engine.Viewer {
    start(viewLayer) {
        this.transform = this.gameObject.getComponent(Transform);
        this.setViewLayer(viewLayer);
        // this.collider = this.gameObject.getComponent(RectCollider);
    }

    display() {
        fill(viewLayerColors[this.viewLayer]);
        circle(this.transform.position.x, this.transform.position.y, 20);
        // this.collider.verticies.forEach((vert) => circle(this.transform.position.x + vert.x, this.transform.position.y + vert.y, 4));
    }
}

class TestController extends Engine.Controller {
    start() {
        this.transform = this.gameObject.getComponent(Transform);
        this.transform.position = createPoint(random(-width / 2 + 100, width / 2 - 100), random(-height / 2 + 100, height / 2 - 100));
        Engine.Time.createTimer(() => this.gameObject.restart(), 8);
        this.gameObject.getComponent(RectCollider).addListener(CollisionEvent.onEnter, (collider) => this.onCollision(collider));
    }

    update() {
        this.transform.position.x += random(-2, 2);
        this.transform.position.y += random(-2, 2);
    }

    onCollision(collider) {
        if (collider.gameObject.components.has("TestController")) return;
        this.gameObject.destroy();
    }
}

let frameRates = [];
for (let i = 0; i < 100; i++) frameRates.push(0);

class TestScene extends Engine.Scene {
    start() {
        console.log("TestScene started!");
        textSize(40);
        imageMode(CENTER);
        noSmooth();

        this.addGameObject(createGameObject(new PlayerController(), new Animator(Engine.AssetManager.getAsset("PigImage").export(), 4, 4)));
        for (let i = 0; i < 300; i++)
            this.addGameObject(
                createGameObject(new TestViewer(int(random(viewLayerColors.length))), new TestController(), new RectCollider(createPoint(20, 20)))
            );

        let bullet = createGameObject(new BulletViewer(), new BulletController(), new CircleCollider(50));
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
        frameRates.shift();
        frameRates.push(frameRate());
        let average = frameRates.reduce((prev, curr) => prev + curr) / frameRates.length;
        text(round(average, 2), 50, 50);

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
        if (Engine.Input.getPressed("v")) Engine.SceneManager.transition(new TestTransition(1), "SettingsScene2");
    }

    overlay() {
        text("Hello there (._.)", 50, 50);
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

function preload() {
    Engine.AssetManager.addAsset(new SpriteAtlas("../assets/testAtlas.png", createPoint(8, 8)), "PigImage");
}

function entry() {
    Engine.SceneManager.registerScene(new TestScene(), "TestScene");
    Engine.SceneManager.registerScene(new SettingsScene(), "SettingsScene");
    Engine.SceneManager.registerScene(new SettingsScene(), "SettingsScene2");
    Engine.SceneManager.setEntryScene("TestScene");
}

Engine.initialize(preload, entry);
