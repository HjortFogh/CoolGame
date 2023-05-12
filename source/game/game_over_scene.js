// Exports:
// - GameOverScene

import { Engine } from "../engine/engine.js";
import { BasicSceneTransition, Button } from "./misc.js";

/**
 * Scene displayed when the player has died
 */
export class GameOverScene extends Engine.Scene {
    /**
     * Create a button which takes you to the main menu
     */
    start() {
        let mainMenuBtn = new Button();
        mainMenuBtn.setText("Main menu");
        mainMenuBtn.setSize(Engine.createVector(300, 120));
        mainMenuBtn.setPosition(Engine.createVector((width - 300) / 2, 400));
        mainMenuBtn.onLeftPress = () => Engine.SceneManager.transition(new BasicSceneTransition(2), "MainMenuScene");
        this.addUIElement(mainMenuBtn);
    }

    /**
     * Display the text: "You Died"
     */
    background() {
        background(70);

        strokeWeight(4);
        stroke(0);
        fill(255, 0, 0);
        textFont("monospace");
        textSize(60);
        textAlign(CENTER, CENTER);
        text("You Died", width / 2, 200);
    }
}
