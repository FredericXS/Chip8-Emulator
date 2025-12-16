export const MEMORY_SIZE = 4096;
export const SCREEN_WIDTH = 64;
export const SCREEN_HEIGHT = 32;
export const PROGRAM_START = 0x200;
export const CYCLES_PER_FRAME = 10;
export const CPU_HZ = 700;

export const KEYBOARD_MAP: Record<string, number> = {
  "1": 0x1,
  "2": 0x2,
  "3": 0x3,
  "4": 0xC,

  "q": 0x4,
  "w": 0x5,
  "e": 0x6,
  "r": 0xD,

  "a": 0x7,
  "s": 0x8,
  "d": 0x9,
  "f": 0xE,

  "z": 0xA,
  "x": 0x0,
  "c": 0xB,
  "v": 0xF,
};