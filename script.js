const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const StartGamemodal = document.querySelector(".start-game");
const GameOvermodal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");
const highScoreElement = document.querySelector("#high-score");
const ScoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const blockHeight = 50;
const blockWidth = 50;

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = "00-00";

highScoreElement.innerText = highScore;

const blocks = [];
let snake = [
    { x: 1, y: 3 },
    { x: 1, y: 4 },
    { x: 1, y: 5 }
];

let direction = "down";
let intervalId = null;
let timeintervalId = null;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols)
};

// Build board
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}

function render() {
    let head = null;

    blocks[`${food.x}-${food.y}`]?.classList.add("food");

    if (direction === "left") head = { x: snake[0].x, y: snake[0].y - 1 };
    else if (direction === "right") head = { x: snake[0].x, y: snake[0].y + 1 };
    else if (direction === "up") head = { x: snake[0].x - 1, y: snake[0].y };
    else if (direction === "down") head = { x: snake[0].x + 1, y: snake[0].y };

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId);
        clearInterval(timeintervalId);

        modal.style.display = "flex";
        StartGamemodal.style.display = "none";
        GameOvermodal.style.display = "flex";
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        blocks[`${food.x}-${food.y}`]?.classList.remove("food");

        food = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        };

        blocks[`${food.x}-${food.y}`]?.classList.add("food");

        snake.unshift(head);

        score += 10;
        ScoreElement.innerText = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            highScoreElement.innerText = highScore;
        }
    }

    snake.forEach(seg => {
        blocks[`${seg.x}-${seg.y}`]?.classList.remove("fill");
    });

    snake.unshift(head);
    snake.pop();

    snake.forEach(seg => {
        blocks[`${seg.x}-${seg.y}`]?.classList.add("fill");
    });
}

startButton.addEventListener("click", () => {
    modal.style.display = "none";

    intervalId = setInterval(render, 300);

    timeintervalId = setInterval(() => {
        let [mins, secs] = time.split("-").map(Number);

        if (secs === 59) { mins += 1; secs = 0; }
        else { secs += 1; }

        time = `${String(mins).padStart(2, "0")}-${String(secs).padStart(2, "0")}`;
        timeElement.innerText = time;

    }, 1000);
});

restartButton.addEventListener("click", restartGame);

function restartGame() {
    blocks[`${food.x}-${food.y}`]?.classList.remove("food");

    snake.forEach(seg => {
        blocks[`${seg.x}-${seg.y}`]?.classList.remove("fill");
    });

    score = 0;
    time = "00-00";
    ScoreElement.innerText = score;
    timeElement.innerText = time;

    modal.style.display = "none";
    StartGamemodal.style.display = "none";
    GameOvermodal.style.display = "none";

    snake = [
        { x: 1, y: 3 },
        { x: 1, y: 4 },
        { x: 1, y: 5 }
    ];

    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    };

    intervalId = setInterval(render, 300);

    timeintervalId = setInterval(() => {
        let [mins, secs] = time.split("-").map(Number);

        if (secs === 59) { mins += 1; secs = 0; }
        else { secs += 1; }

        time = `${String(mins).padStart(2, "0")}-${String(secs).padStart(2, "0")}`;
        timeElement.innerText = time;
    }, 1000);
}

addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") direction = "up";
    if (event.key === "ArrowRight") direction = "right";
    if (event.key === "ArrowLeft") direction = "left";
    if (event.key === "ArrowDown") direction = "down";
});
