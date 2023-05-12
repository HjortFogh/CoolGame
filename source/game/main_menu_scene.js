// Exports:
// - MainMenuScene

import { Engine } from "../engine/engine.js";
import { BasicSceneTransition, Button } from "./misc.js";

/**
 * A UIElement ment to display the information about different controlls to the user
 */
class ControllsInformation extends Engine.UIElement {
    /**
     * Display the information
     */
    displayElement() {
        let size = this.getSize();
        noStroke();
        fill(255, 50);
        rect(0, 0, size.x, size.y);

        strokeWeight(2);
        stroke(255);
        fill(255);
        textFont("monospace");
        textSize(30);
        textAlign(CENTER, CENTER);

        text("Use WASD to move", size.x / 2, 100);
        text("Use E to dash", size.x / 2, 200);
        text("Use Left mouse to shoot", size.x / 2, 300);
    }
}

/**
 * A menu containing a start button and the ControllsInformation
 */
class Menu extends Engine.UIElement {
    /**
     * Setup the start game button and the ControllsInformation
     */
    start() {
        let size = Engine.createVector(width * 0.6, height);
        this.setPosition(Engine.createVector((width - size.x) / 2, (height - size.y) / 2));
        this.setSize(size);

        let startGameBtn = new Button();
        startGameBtn.onLeftPress = () => Engine.SceneManager.transition(new BasicSceneTransition(2), "GameScene");
        startGameBtn.setText("Start Game");
        startGameBtn.setSize(Engine.createVector(300, 120));
        startGameBtn.setPosition(Engine.createVector((size.x - 300) / 2, 50));
        this.addElement(startGameBtn);

        let controllsInfo = new ControllsInformation();
        controllsInfo.setPosition(Engine.createVector((size.x - 400) / 2, 250));
        controllsInfo.setSize(Engine.createVector(400, 400));
        this.addElement(controllsInfo);
    }

    /**
     * Display the background of the menu
     */
    displayElement() {
        let size = this.getSize();
        noStroke();
        fill(255, 50);
        rect(0, 0, size.x, size.y);
    }
}

/**
 * The main menu which only displays a menu
 */
export class MainMenuScene extends Engine.Scene {
    start() {
        this.addUIElement(new Menu());
    }

    background() {
        background(70);
    }
}
