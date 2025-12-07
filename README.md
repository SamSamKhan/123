# Snake Game
A simple browser-based Snake game built with HTML5 canvas and vanilla JavaScript.

## How to run
You only need a modern desktop browser (Chrome, Firefox, Safari, or Edge). Choose one of the options below:

### Option A: Open the file directly
1) Download or clone this repository.
2) Double-click `index.html` (or right-click and open it in your browser).
3) If the browser blocks local keyboard input, use Option B instead.

### Option B: Serve it locally
1) Download or clone this repository.
2) From the project folder run:
   ```bash
   python -m http.server 8000
   ```
3) Visit `http://localhost:8000` in your browser.
4) Stop the server anytime with **Ctrl+C**.

## How to play
- Press **Start / Restart** (or tap the **Spacebar** when the game is over) to begin.
- Move with **Arrow keys** or **WASD**.
- Eat the pink fruit to grow and earn points.
- Hitting a wall or your own tail ends the run.

## Files
- `index.html` – page layout and UI controls
- `styles.css` – styling for the game shell and canvas
- `snake.js` – game logic and rendering
