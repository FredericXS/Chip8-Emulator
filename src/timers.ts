export class Timers {
    delay = 0
    sound = 0;

    tick() {
        if (this.delay > 0) this.delay--;
        if (this.sound > 0) this.sound--;
    }

    reset() {
        this.delay = 0;
        this.sound = 0;
    }
}