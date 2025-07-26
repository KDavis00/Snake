const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let score = 0;
let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let game;
let gameRunning = false;

// Snake and food colors
let snakeHeadColor = "lime";
let snakeBodyColor = "green";

let food = {
  x: Math.floor(Math.random() * (canvas.width / box)) * box,
  y: Math.floor(Math.random() * (canvas.height / box)) * box,
};

// Leaderboard
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
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
  // Move snake by creating a new head
  let head = { x: snake[0].x, y: snake[0].y };
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  let hitWall = head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height;
  let hitSelf = collision(head, snake);

  // Add new head
  snake.unshift(head);

  // Check if food eaten
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").textContent = "Score: " + score;
    food = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
  } else {
    snake.pop(); // remove tail if no food eaten
  }

  // Draw everything
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? snakeHeadColor : snakeBodyColor;
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Game over logic
  if (hitWall || hitSelf) {
    clearInterval(game);
    setTimeout(() => {
      alert("Game Over! Your score: " + score);
      gameRunning = false;
      document.getElementById("startBtn").disabled = false;
      updateLeaderboard(score);
    }, 50);
    return;
  }
}

function collision(head, array) {
  for (let i = 1; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

function startGame() {
  if (game) clearInterval(game);

  score = 0;
  document.getElementById("score").textContent = "Score: " + score;

  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
  };

  gameRunning = true;
  document.getElementById("startBtn").disabled = true;
  game = setInterval(draw, 100);
}

// Change snake color
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

  if (!gameRunning) drawPreviewSnake();
});

// Draw preview snake
function drawPreviewSnake() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? snakeHeadColor : snakeBodyColor;
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);
}

// Leaderboard handling
function updateLeaderboard(newScore) {
  const name = prompt("Enter your name for the leaderboard:") || "Anonymous";
  leaderboard.push({ name, score: newScore });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  renderLeaderboard();
}

function renderLeaderboard() {
  const board = document.getElementById("leaderboard");
  board.innerHTML = "";
  leaderboard.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name}: ${entry.score}`;
    board.appendChild(li);
  });
}

renderLeaderboard();
drawPreviewSnake();

document.getElementById("startBtn").addEventListener("click", startGame);
