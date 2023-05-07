import * as Engine from "../../engine/engine.js";

export class MainMenuScene extends Engine.Scene {
    start() {
        let uiElement = new Engine.UI.Surface(Engine.createVector(100, 100), Engine.createVector(width - 200, height - 200));
        let uiButton = new Engine.UI.Button(Engine.createVector(100), Engine.createVector(200, 80));

        uiButton.addEventListener("LeftMouseReleased", () => Engine.SceneManager.changeScene("GameScene"));
        // uiElement.addEventListener("hoverEnter", () => console.log("HoverEnter"));

        uiElement.addElement(uiButton);

        // let coolStyle = { visible: false };
        // uiElement.setStyle(coolStyle);

        this.addUIElement(uiElement);
    }

    background() {
        background(100, 150, 200);
        if (Engine.Input.getReleased("1")) Engine.SceneManager.changeScene("GameScene");
    }
}
