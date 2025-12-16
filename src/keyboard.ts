export class Keyboard {
  keys = new Uint8Array(16);

  isPressed(key: number): boolean {
    return this.keys[key] === 1;
  }

  press(key: number) {
    this.keys[key] = 1;
  }

  release(key: number) {
    this.keys[key] = 0;
  }
}