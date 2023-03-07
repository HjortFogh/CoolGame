// Input

let userInput = {};

window.keyPressed = () => {
    userInput[key] = true;
};

window.keyReleased = () => {
    userInput[key] = false;
};

export function getInput(key) {
    return userInput[key] !== undefined ? userInput[key] : false;
}
