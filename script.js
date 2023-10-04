const canvas = document.querySelector('#game'); 
const ctx = canvas.getContext('2d');

const moveInterval = 300; 
const frame = 40; 
const size = {w: 10, h: 10}; 

canvas.width = frame * size.w;
canvas.height = frame * size.h;

const Keys = {
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40
};

const Directions = {
    LEFT: 'left',
    UP: 'up',
    RIGHT: 'right',
    DOWN: 'down'
}

const KeysToDirections = {
    [Keys.LEFT_ARROW]: Directions.LEFT,
    [Keys.UP_ARROW]: Directions.UP,
    [Keys.RIGHT_ARROW]: Directions.RIGHT,
    [Keys.DOWN_ARROW]: Directions.DOWN
};

let snake = []; 
snake[0] = getRandomPosition();

let snakeX = snake[0].x; 
let snakeY = snake[0].y;

let apple = addApple();

let img = new Image(); 
img.src = 'apple.jpg';

let direction; 
let currentMoveInterval = moveInterval;
let isRunning = true;
let prevMoveTimestamp;
let pressedKey;

document.addEventListener('keydown', onKeyDown); 

function onKeyDown(event) {
    if (isValidInput(event.keyCode)) {
        pressedKey = event.keyCode;
    }
}

function isValidInput(keyCode) {
    return (keyCode == Keys.LEFT_ARROW && direction != Directions.RIGHT)
        || (keyCode == Keys.UP_ARROW && direction != Directions.DOWN)
        || (keyCode == Keys.RIGHT_ARROW && direction != Directions.LEFT)
        || (keyCode == Keys.DOWN_ARROW && direction != Directions.UP);
}

function gameLoop (timestamp) { 
    if (!prevMoveTimestamp) {
        prevMoveTimestamp = timestamp;
    }

    if (timestamp - prevMoveTimestamp >= currentMoveInterval) {
        clearView();
        updateSnakePosition();
        drawApple();
        drawSnake();
        eatApple();

        if (checkCollisions()) {
            finishGame();
        }
        else {
            moveSnake();
        }

        prevMoveTimestamp = timestamp;
    }

    if (isRunning) {
        requestAnimationFrame(gameLoop);
    }
}

function clearView() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawApple() {
    ctx.drawImage (img, apple.x * frame, apple.y * frame, frame, frame);
}

function addApple () {
    const maxIterations = 100; 

    for (let j = 0; j < maxIterations; j++) {
        let newApple = getRandomPosition(); 
        let isOccupied = false; 

        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === newApple.x && snake[i].y === newApple.y) { 
                isOccupied = true; 
                console.log('position occupied, trying again!');
                break; 
            }
        }

        if (isOccupied) {
            continue; 
        }

        return newApple;
    }

    console.log('failed to find new apple position');
    return { x: -1, y: -1 };
}

function drawSnake() {
    
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? 'blue' : 'violet';
        ctx.fillRect(snake[i].x * frame, snake[i].y * frame, frame, frame);
    }
}

function updateSnakePosition () {
    direction = KeysToDirections[pressedKey];

    if (direction == Directions.LEFT) snakeX--;
    if (direction == Directions.RIGHT) snakeX++;
    if (direction == Directions.UP) snakeY--;
    if (direction == Directions.DOWN) snakeY++;
}

function eatApple () {
    if(snakeX !== apple.x || snakeY !== apple.y) {
        return;
    }
    
    console.log('apple eaten');

    apple = addApple();

    let head = snake[0];
    snake.push({ x: head.x, y: head.y });

    currentMoveInterval = Math.max(currentMoveInterval * 0.9, 100);
}

function checkCollisions() {
    if (checkSelfCollision()) {
        return true;
    }

    return snakeX < 0 || snakeY < 0 || snakeX >= size.w || snakeY >= size.h;
}

function checkSelfCollision() {
    for (let i = 1; i < snake.length; i++) {
        let p = snake[i];
        if (snakeX === p.x && snakeY === p.y) {
            return true;
        }
    }

    return false;
}

function moveSnake() {
    snake.pop();

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    snake.unshift(newHead); 
}

function getRandomPosition() {
    let getRandomNumber = arg => Math.floor(Math.random() * arg);

    return {
        x: getRandomNumber(size.w),
        y: getRandomNumber(size.h)
    };
}

function finishGame() {
    isRunning = false;
    setTimeout(() => alert('End game'), 0);
}

requestAnimationFrame(gameLoop);