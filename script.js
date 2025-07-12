const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20; // Size of each square

let score = 0;
let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";

let food = {
  x: Math.floor(Math.random() * (canvas.width / box)) * box,
  y: Math.floor(Math.random() * (canvas.height / box)) * box,
};

// Snake color (head and body)
let snakeHeadColor = "lime";
let snakeBodyColor = "green";

let game; // for interval
let gameRunning = false;

document.addEventListener("keydown", (e) => {
  if (!gameRunning) return; // ignore keys if game not running
  changeDirection(e);
});

function changeDirection(e) {
  const key = e.key;
  if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? snakeHeadColor : snakeBodyColor;
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Move snake
  let head = { x: snake[0].x, y: snake[0].y };

  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  // Game Over if hit wall or itself
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    collision(head, snake)
  ) {
    clearInterval(game);
    alert("Game Over! Your score: " + score);
    gameRunning = false;
    // Re-enable start button
    document.getElementById("startBtn").disabled = false;
    
    return;
  }

  // If snake eats food
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").textContent = "Score: " + score;
    food = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

function collision(head, array) {
  for (let i = 1; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

function drawPreviewSnake() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw snake at initial position
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? snakeHeadColor : snakeBodyColor;
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }
  // Draw food as well
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);
}

function startGame() {
  if (game) clearInterval(game);

  // disable start (game running)
  
  document.getElementById("startBtn").disabled = true;

  score = 0;
  document.getElementById("score").textContent = "Score: " + score;

  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
  };

  gameRunning = true;
  game = setInterval(draw, 100);
}

document.getElementById("startBtn").addEventListener("click", startGame);



// Change Color button logic
document.getElementById("colorBtn").addEventListener("click", () => {
  const colors = [
    ["lime", "green"],
    ["cyan", "blue"],
    ["orange", "darkorange"],
    ["purple", "violet"],
    ["yellow", "gold"],
    ["pink", "hotpink"],
  ];
  const [headColor, bodyColor] = colors[Math.floor(Math.random() * colors.length)];
  snakeHeadColor = headColor;
  snakeBodyColor = bodyColor;

  // Redraw preview snake if game not running
  if (!gameRunning) {
    drawPreviewSnake();
  }
});


// Draw initial preview snake with default colors
drawPreviewSnake();
