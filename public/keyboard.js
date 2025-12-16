export class Keyboard {
    constructor() {
        this.keys = new Uint8Array(16);
    }
    isPressed(key) {
        return this.keys[key] === 1;
    }
    press(key) {
        this.keys[key] = 1;
    }
    release(key) {
        this.keys[key] = 0;
    }
}
