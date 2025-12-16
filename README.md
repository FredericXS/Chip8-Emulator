# CHIP-8 Emulator

A simple CHIP-8 emulator written in **TypeScript**, playable directly in the browser.
Play classic games like **Tetris** and **Pong**, or load your own ROMs.

## Features

- Run CHIP-8 games in the browser
- Built-in ROMs included
- Load your own ROMs
- Keyboard controls for gameplay
- Sound support

## Play Online

Visit the live version of the emulator [here](https://chip8-emulator-hazel.vercel.app/)

- Select a ROM from the dropdown or upload your own
- Use your keyboard to play

## Local Usage

```bash
git clone https://github.com/FredericXS/Chip8-Emulator.git
cd Chip8-Emulator

npm install
npm run build
npm run start
```

Opens a browser at http://localhost:5173

## Controls

CHIP-8 standard keypad layout:

```
1 2 3 C
4 5 6 D
7 8 9 E
A 0 B F
```

Use the keyboard keys corresponding to the above layout to control games.

## License

This project is licensed under the MIT License.
