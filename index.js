const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

const blockSize = 20;
let snake = [{ x: 10, y: 10 }];
let direction = "right";

let food = { x: 15, y: 15 };

let isGameRunning = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

function startGame() {
    if (!isGameRunning) {
        isGameRunning = true;
        snake = [{ x: 10, y: 10 }];
        direction = "right";
        score = 0;
        updateScore();
        spawnFood();
        gameLoop();
    }
}

function updateScore() {
    document.getElementById("score").textContent = score;
    document.getElementById("highScore").textContent = highScore;
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / blockSize)),
        y: Math.floor(Math.random() * (canvas.height / blockSize)),
    };
}

window.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowUp":
            direction = "up";
            break;

        case "ArrowDown":
            direction = "down";
            break;

        case "ArrowLeft":
            direction = "left";
            break;

        case "ArrowRight":
            direction = "right";
            break;
    }
});

function update() {
    const head = { ...snake[0] };

    switch (direction) {
        case "up":
            head.y -= 1;
            break;

        case "down":
            head.y += 1;
            break;

        case "left":
            head.x -= 1;
            break;

        case "right":
            head.x += 1;
            break;
    }

    if (head.x === food.x && head.y === food.y) {
        snake.push({});
        score += 10;
        updateScore();
        spawnFood();
    }

    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width / blockSize ||
        head.y >= canvas.height / blockSize ||
        isCollision(head, snake.slice(1))
    )
        endGame();

    snake.unshift(head);
    snake.pop();
}

function isCollision(head, array) {
    return array.some(segment => segment.x === head.x && segment.y === head.y);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00F";
    snake.forEach(segment => {
        ctx.fillRect(
            segment.x * blockSize,
            segment.y * blockSize,
            blockSize,
            blockSize
        );
    });

    ctx.fillStyle = "#F00";
    ctx.fillRect(food.x * blockSize, food.y * blockSize, blockSize, blockSize);
}

function endGame() {
    isGameRunning = false;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }

    updateScore();
    alert("Game over! Your score is " + score);
}

function gameLoop() {
    if (isGameRunning) {
        update();
        render();
        setTimeout(gameLoop, 100);
    }
}

render();
