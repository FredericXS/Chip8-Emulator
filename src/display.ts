import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./constants";

export class Display {
    pixels = new Uint8Array(SCREEN_WIDTH * SCREEN_HEIGHT);
    scale = 10;

    canvas = document.createElement("canvas");
    ctx = this.canvas.getContext("2d");

    constructor() {
        this.canvas.width = SCREEN_WIDTH * this.scale;
        this.canvas.height = SCREEN_HEIGHT * this.scale;
        document.getElementById("display-root")!.appendChild(this.canvas);
    }

    clear() {
        this.pixels.fill(0);
    }

    xorPixel(x: number, y: number): boolean {
        x %= SCREEN_WIDTH;
        y %= SCREEN_HEIGHT;

        const i = x + y * SCREEN_WIDTH;
        const prev = this.pixels[i];
        this.pixels[i] ^= 1;

        return prev === 1 && this.pixels[i] === 0;
    }


    draw() {
        if (!this.ctx) return;
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "white";
        for(let i = 0; i < this.pixels.length; i++) {
            if (this.pixels[i]) {
                const x = (i % SCREEN_WIDTH) * this.scale;
                const y = Math.floor(i / SCREEN_WIDTH) * this.scale;
                this.ctx.fillRect(x, y, this.scale, this.scale);
            }
        }
    }
}