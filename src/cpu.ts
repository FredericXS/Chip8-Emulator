import { PROGRAM_START  } from "./constants";
import { Memory } from "./memory";
import { Display } from "./display";
import { Timers } from "./timers";
import { Keyboard } from "./keyboard";

export class CPU {
    V = new Uint8Array(16);
    I = 0;
    PC = PROGRAM_START;

    stack = new Uint16Array(16);
    sp = 0;

    delayTimer = 0;
    soundTimer = 0;

    constructor(
        private memory: Memory,
        private display: Display,
        private timers: Timers,
        private keyboard: Keyboard
    ) {}

    fetchOpcode(): number {
        const hi = this.memory.readByte(this.PC);
        const lo = this.memory.readByte(this.PC + 1);
        return (hi << 8) | lo;
    }

    cycle() {
        const opcode = this.fetchOpcode();
        this.PC += 2;
        this.execute(opcode);
    }

    reset() {
        this.PC = PROGRAM_START;
        this.V.fill(0);
        this.I = 0;
        this.stack.fill(0);
        this.sp = 0;
    }


    execute(opcode: number) {
        const x = (opcode & 0x0F00) >> 8;
        const y = (opcode & 0x00F0) >> 4;
        const nn = opcode & 0x00FF;
        const nnn = opcode & 0x0FFF;

        switch(opcode & 0xF000) {
            case 0x0000:
                switch (opcode) {
                    case 0x00E0:
                        this.display.clear();
                        break;
                    case 0x00EE:
                        this.sp--;
                        this.PC = this.stack[this.sp];
                        break;
                    default:
                        break;
                }
                break;
            case 0x1000:
                this.PC = nnn;
                break;
            case 0x2000:
                this.stack[this.sp] = this.PC;
                this.sp++;
                this.PC = nnn;
                break;
            case 0x3000:
                if (this.V[x] === nn) this.PC += 2;
                break;
            case 0x4000:
                if (this.V[x] !== nn) this.PC += 2;
                break;
            case 0x5000:
                if (this.V[x] === this.V[y]) this.PC += 2;
                break;
            case 0x6000:
                this.V[x] = nn;
                break;
            case 0x7000:
                this.V[x] = (this.V[x] + nn) & 0xff;
                break;
            case 0x8000:
                switch (opcode & 0x000F) {
                    case 0x0:
                        this.V[x] = this.V[y];
                        break;
                    case 0x1:
                        this.V[x] |= this.V[y];
                        break;
                    case 0x2:
                        this.V[x] &= this.V[y];
                        break;
                    case 0x3:
                        this.V[x] ^= this.V[y];
                        break;
                    case 0x4: {
                        const sum = this.V[x] + this.V[y];
                        this.V[0xF] = sum > 0xFF ? 1 : 0;
                        this.V[x] = sum & 0xFF;
                        break;
                    }
                    case 0x5:
                        this.V[0xF] = this.V[x] > this.V[y] ? 1 : 0;
                        this.V[x] = (this.V[x] - this.V[y]) & 0xff;
                        break;
                    case 0x6:
                        this.V[0xF] = this.V[x] & 1;
                        this.V[x] >>= 1;
                        break;
                    case 0x7:
                        this.V[0xF] = this.V[y] > this.V[x] ? 1 : 0;
                        this.V[x] = (this.V[y] - this.V[x]) & 0xff;
                        break;
                    case 0xE:
                        this.V[0xF] = (this.V[x] & 0x80) >> 7;
                        this.V[x] = (this.V[x] << 1) & 0xff;
                        break;
                }
                break;
            case 0x9000:
                if (this.V[x] !== this.V[y]) this.PC += 2;
                break;
            case 0xA000:
                this.I = nnn;
                break;
            case 0xB000:
                this.PC = nnn + this.V[0];
                break;
            case 0xC000:
                this.V[x] = (Math.floor(Math.random() * 256)) & nn;
                break;
            case 0xD000:
                const xPos = this.V[x] % 64;
                const yPos = this.V[y] % 32;
                const height = opcode & 0x000F;

                this.V[0xF] = 0;
                for (let row = 0; row < height; row++) {
                    const spriteByte = this.memory.readByte(this.I + row);
                    for (let col = 0; col < 8; col++) {
                        if ((spriteByte & (0x80 >> col)) !== 0) {
                            const xCoord = (xPos + col) % 64;
                            const yCoord = (yPos + row) % 32;
                            const index = xCoord + yCoord * 64;

                            if (this.display.pixels[index] === 1) {
                                this.V[0xF] = 1;
                            }
                            this.display.pixels[index] ^= 1;
                        }
                    }
                }
                break;
            case 0xE000:
                switch (opcode & 0x00FF) {
                    case 0x9E:
                        if (this.keyboard.isPressed(this.V[x])) {
                            this.PC += 2;
                        }
                        break;
                    case 0xA1:
                        if (!this.keyboard.isPressed(this.V[x])) {
                            this.PC += 2;
                        }
                        break;
                }
                break;

            case 0xF000:
                switch (nn) {
                    case 0x07:
                        this.V[x] = this.timers.delay;
                        break;
                    case 0x0A: {
                        let keyPressed = -1;

                        for (let i = 0; i < 16; i++) {
                            if (this.keyboard.isPressed(i)) {
                            keyPressed = i;
                            break;
                            }
                        }

                        if (keyPressed === -1) {
                            this.PC -= 2;
                        } else {
                            this.V[x] = keyPressed;
                        }
                        break;
                    }
                    case 0x15:
                        this.timers.delay = this.V[x];
                        break;
                    case 0x18:
                        this.timers.sound = this.V[x];
                        break;
                    case 0x1E:
                        this.I = (this.I + this.V[x]) & 0xFFF;
                        break;
                    case 0x29:
                        this.I = 0x050 + this.V[x] * 5;
                        break;
                    case 0x33:
                        this.memory.writeByte(this.I, Math.floor(this.V[x] / 100));
                        this.memory.writeByte(this.I + 1, Math.floor((this.V[x] % 100) / 10));
                        this.memory.writeByte(this.I + 2, this.V[x] % 10);
                        break;
                    case 0x55:
                        for (let i = 0; i <= x; i++) {
                            this.memory.writeByte(this.I + i, this.V[i]);
                        }
                        break;
                    case 0x65:
                        for (let i = 0; i <= x; i++) {
                            this.V[i] = this.memory.readByte(this.I + i);
                        }
                        break;
                }
                break;
            default:
                console.warn(`Unknown opcode: ${opcode.toString(16)}`);
        }
    }
}