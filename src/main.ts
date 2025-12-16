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

async function loadRomFromURL(path: string) {
    running = false;
    resetEmulator();

    const res = await fetch(path);
    const buffer = await res.arrayBuffer();
    memory.loadRom(new Uint8Array(buffer));

    running = true;
}

async function loadRomFromFile(file: File) {
    running = false;
    resetEmulator();

    const buffer = await file.arrayBuffer();
    memory.loadRom(new Uint8Array(buffer));

    running = true;
}

// UI Handlers
function initUI() {
    const resetBtn = document.getElementById("reset") as HTMLButtonElement;
    resetBtn.onclick = () => resetEmulator();

    const localFileBtn = document.getElementById("loadLocalROM") as HTMLButtonElement;
    const romSelect = document.getElementById("romSelect") as HTMLSelectElement;
    localFileBtn.onclick = () => loadRomFromURL(romSelect.value);

    const customFileBtn = document.getElementById("loadCustomROM") as HTMLButtonElement;
    const romFileInput = document.getElementById("romFile") as HTMLInputElement;
    customFileBtn.onclick = async () => {
        const file = romFileInput.files?.[0];
        if (file) await loadRomFromFile(file);
    };
}

// Timers & Sound
function startTimerLoop() {
    setInterval(() => {
        timers.tick();

        if (timers.sound > 0) {
            sound.start();
        } else {
            sound.stop();
        }
    }, 1000 / 60);
}

// Main Emulation Loop
let running = false;

function mainLoop() {
    if (running) {
        for (let i = 0; i < CYCLES_PER_FRAME; i++) cpu.cycle();
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
