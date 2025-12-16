var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CYCLES_PER_FRAME, KEYBOARD_MAP } from "./constants.js";
import { CPU } from "./cpu.js";
import { Memory } from "./memory.js";
import { Display } from "./display.js";
import { Timers } from "./timers.js";
import { Keyboard } from "./keyboard.js";
import { Sound } from "./sound.js";
const memory = new Memory();
const display = new Display();
const timers = new Timers();
const keyboard = new Keyboard();
const sound = new Sound();
const cpu = new CPU(memory, display, timers, keyboard);
// Input Handling
function initKeyboard() {
    window.addEventListener("keydown", () => {
        sound.start();
        sound.stop();
    }, { once: true });
    window.addEventListener("keydown", (e) => {
        const key = KEYBOARD_MAP[e.key.toLowerCase()];
        if (key !== undefined && !keyboard.isPressed(key)) {
            keyboard.press(key);
        }
    });
    window.addEventListener("keyup", (e) => {
        const key = KEYBOARD_MAP[e.key.toLowerCase()];
        if (key !== undefined) {
            keyboard.release(key);
        }
    });
}
// Reset / ROM Loading
function resetEmulator() {
    memory.reset();
    cpu.reset();
    display.clear();
    timers.reset();
}
function loadRomFromURL(path) {
    return __awaiter(this, void 0, void 0, function* () {
        running = false;
        resetEmulator();
        const res = yield fetch(path);
        const buffer = yield res.arrayBuffer();
        memory.loadRom(new Uint8Array(buffer));
        running = true;
    });
}
function loadRomFromFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        running = false;
        resetEmulator();
        const buffer = yield file.arrayBuffer();
        memory.loadRom(new Uint8Array(buffer));
        running = true;
    });
}
// UI Handlers
function initUI() {
    const resetBtn = document.getElementById("reset");
    resetBtn.onclick = () => resetEmulator();
    const localFileBtn = document.getElementById("loadLocalROM");
    const romSelect = document.getElementById("romSelect");
    localFileBtn.onclick = () => loadRomFromURL(romSelect.value);
    const customFileBtn = document.getElementById("loadCustomROM");
    const romFileInput = document.getElementById("romFile");
    customFileBtn.onclick = () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const file = (_a = romFileInput.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file)
            yield loadRomFromFile(file);
    });
}
// Timers & Sound
function startTimerLoop() {
    setInterval(() => {
        timers.tick();
        if (timers.sound > 0) {
            sound.start();
        }
        else {
            sound.stop();
        }
    }, 1000 / 60);
}
// Main Emulation Loop
let running = false;
function mainLoop() {
    if (running) {
        for (let i = 0; i < CYCLES_PER_FRAME; i++)
            cpu.cycle();
        display.draw();
    }
    requestAnimationFrame(mainLoop);
}
// Initialize Emulator
function init() {
    initKeyboard();
    initUI();
    startTimerLoop();
    requestAnimationFrame(mainLoop);
}
init();
