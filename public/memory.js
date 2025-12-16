import { MEMORY_SIZE, PROGRAM_START } from "./constants.js";
export class Memory {
    constructor() {
        this.ram = new Uint8Array(MEMORY_SIZE);
    }
    loadRom(data) {
        this.ram.set(data, PROGRAM_START);
    }
    readByte(addr) {
        return this.ram[addr];
    }
    writeByte(addr, value) {
        this.ram[addr] = value & 0xff;
    }
    reset() {
        this.ram.fill(0);
    }
}
