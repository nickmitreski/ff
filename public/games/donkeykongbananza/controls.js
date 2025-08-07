export class InputHandler {
    constructor() {
        this.keys = {};
        this.pressedKeys = {}; // Stores keys that were just pressed in the current frame

        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onKeyDown(event) {
        if (!this.keys[event.key.toLowerCase()]) { // Only register as pressed if not already down
            this.pressedKeys[event.key.toLowerCase()] = true;
        }
        this.keys[event.key.toLowerCase()] = true;
    }

    onKeyUp(event) {
        this.keys[event.key.toLowerCase()] = false;
    }

    isKeyDown(key) {
        return this.keys[key.toLowerCase()] || false;
    }

    isKeyPressed(key) {
        return this.pressedKeys[key.toLowerCase()] || false;
    }

    // Call this at the end of each game loop update to clear pressed keys
    update() {
        this.pressedKeys = {};
    }
}

