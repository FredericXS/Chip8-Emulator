import { MEMORY_SIZE, PROGRAM_START } from "./constants.js";

export class Memory {
    ram = new Uint8Array(MEMORY_SIZE);

    loadRom(data: Uint8Array) {
        this.ram.set(data, PROGRAM_START);
    }

    readByte(addr: number): number {
        return this.ram[addr];
    }

    writeByte(addr: number, value: number) {
        this.ram[addr] = value & 0xff;
    }

    reset() {
        this.ram.fill(0);
    }
}