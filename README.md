# Tic-Tac-Toe

A two-player browser game built with HTML, CSS, and JavaScript.

## Features

- X starts and players alternate turns.
- Detects wins and draws.
- Prevents moves after the game ends.
- Reset button starts a new game.
- Keyboard-operable square buttons and a live status message.

## Run the game

No build step or package installation is required. Open `index.html` in a modern browser. Use the mouse or keyboard to select an empty square. Select **Reset Game** to start over.

## Run tests

The tests use Node.js's built-in test runner (Node.js 18 or newer recommended). From the repository root, run:

```bash
node --test tests/game.test.js
```

The tests cover occupied cells, win and draw detection, reset behavior, and accessible markup.

## Files

- `index.html` — page structure and board controls.
- `style.css` — layout and visual focus styles.
- `script.js` — game logic.
- `tests/game.test.js` — gameplay and accessibility regression tests.
