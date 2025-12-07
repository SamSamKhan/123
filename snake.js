const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const stateEl = document.getElementById('state');
const startBtn = document.getElementById('start');

const gridSize = 20;
const columns = canvas.width / gridSize;
const rows = canvas.height / gridSize;
const speed = 120; // ms between moves

let snake;
let direction;
let pendingDirection;
let food;
let lastTick = 0;
let score = 0;
let running = false;

function setInitialState() {
  snake = [
    { x: 5, y: 10 },
    { x: 4, y: 10 },
    { x: 3, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  pendingDirection = { ...direction };
  food = randomFood();
  score = 0;
  lastTick = 0;
  running = false;
  scoreEl.textContent = score;
  stateEl.textContent = 'Press Start to play';
}

function resetGame() {
  setInitialState();
  running = true;
  stateEl.textContent = 'Good luck!';
  requestAnimationFrame(loop);
}

function loop(timestamp) {
  if (!running) return;
  if (!lastTick) lastTick = timestamp;
  const delta = timestamp - lastTick;

  if (delta >= speed) {
    step();
    lastTick = timestamp;
  }

  draw();
  requestAnimationFrame(loop);
}

function step() {
  direction = pendingDirection;
  const head = snake[0];
  const next = { x: head.x + direction.x, y: head.y + direction.y };

  if (hitWall(next) || hitSelf(next)) {
    stateEl.textContent = 'Game over - press Start to try again';
    running = false;
    return;
  }

  snake.unshift(next);

  if (next.x === food.x && next.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    food = randomFood();
  } else {
    snake.pop();
  }
}

function hitWall(pos) {
  return pos.x < 0 || pos.x >= columns || pos.y < 0 || pos.y >= rows;
}

function hitSelf(pos) {
  return snake.some((segment) => segment.x === pos.x && segment.y === pos.y);
}

function randomFood() {
  let candidate;
  do {
    candidate = {
      x: Math.floor(Math.random() * columns),
      y: Math.floor(Math.random() * rows),
    };
  } while (snake && snake.some((s) => s.x === candidate.x && s.y === candidate.y));
  return candidate;
}

function setDirection(x, y) {
  const isOpposite = direction.x + x === 0 && direction.y + y === 0;
  if (!isOpposite) {
    pendingDirection = { x, y };
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw subtle grid
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  for (let x = gridSize; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = gridSize; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // food
  ctx.fillStyle = getPattern('#f472b6', '#ec4899');
  drawCell(food.x, food.y);

  // snake
  ctx.fillStyle = getPattern('#22d3ee', '#0ea5e9');
  snake.forEach((segment, index) => {
    drawCell(segment.x, segment.y, index === 0);
  });
}

function drawCell(x, y, isHead = false) {
  const padding = 2;
  const size = gridSize - padding * 2;
  const px = x * gridSize + padding;
  const py = y * gridSize + padding;

  ctx.save();
  ctx.translate(px, py);
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(0, 0, size, size, 6);
  } else {
    ctx.rect(0, 0, size, size);
  }
  ctx.fill();

  if (isHead) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(size / 2 - 3, size / 2 - 3, 6, 6, 2);
    } else {
      ctx.rect(size / 2 - 3, size / 2 - 3, 6, 6);
    }
    ctx.fill();
  }
  ctx.restore();
}

function getPattern(colorA, colorB) {
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = patternCanvas.height = 8;
  const pctx = patternCanvas.getContext('2d');
  const gradient = pctx.createLinearGradient(0, 0, 8, 8);
  gradient.addColorStop(0, colorA);
  gradient.addColorStop(1, colorB);
  pctx.fillStyle = gradient;
  pctx.fillRect(0, 0, 8, 8);
  return ctx.createPattern(patternCanvas, 'repeat');
}

function handleKey(event) {
  switch (event.key.toLowerCase()) {
    case 'arrowup':
    case 'w':
      setDirection(0, -1);
      break;
    case 'arrowdown':
    case 's':
      setDirection(0, 1);
      break;
    case 'arrowleft':
    case 'a':
      setDirection(-1, 0);
      break;
    case 'arrowright':
    case 'd':
      setDirection(1, 0);
      break;
    case ' ': // restart on space
      if (!running) resetGame();
      break;
  }
}

startBtn.addEventListener('click', resetGame);
document.addEventListener('keydown', handleKey);

setInitialState();
draw();

