const canvas = document.getElementById('gameCanvas');
canvas.width = 800;
canvas.height = 600;
const context = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 50;
const ballSize = 4;
const paddlePadding = 10;
const winningScore = 10;
const ballSpeed = 3;

let playerPaddleY = (canvas.height - paddleHeight) / 2;
let aiPaddleY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
let ballMoving = false;

let playerScore = 0;
let aiScore = 0;

function drawPaddle(x, y, width, height) {
    context.fillStyle = '#39FF14';
    context.shadowColor = '#39FF14';
    context.shadowBlur = 10;
    context.fillRect(x, y, width, height);
    /// Shadow is Reset to avoid affecting other drawing
    context.shadowColor = '39FF14';
    context.shadowBlur = 0;
}

function drawBall(x, y, size) {
    context.fillStyle = '#FF1493' ;
    context.shadowColor = '#FF1493';
    context.shadowBlur = 10;
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2, true);
    context.fill();
    /// Shadow is Reset to avoid affecting other drawing
    context.shadowColor = 'transparent';
    context.shadowBlur = 0;
}

function drawBackground() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height)
}

function drawScores() {
    context.fillStyle = '#39FF14';
    context.font = '20px Arial';
    context.fillText(`Player: ${playerScore}`, 50, 50);
    context.fillText(`AI: ${aiScore}`, canvas.width - 100, 50);
}

let gradient = context.createLinearGradient(0, 0, canvas.width, 0);
gradient.addColorStop(0, '#39FF14');
gradient.addColorStop(1, '#FF1493');
context.fillStyle = gradient;


function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPaddle(paddlePadding, playerPaddleY, paddleWidth, paddleHeight);
    drawPaddle(canvas.width - paddleWidth - paddlePadding, aiPaddleY, paddleWidth, paddleHeight);
    drawBall(ballX, ballY, ballSize);
    drawScores();
}

setInterval(draw, 1000 / 60); //Redraw the canvas 60 times per second

function update() {
    if (!ballMoving) {
        return; // SKIPS update when ball is not moving
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballX <= paddleWidth) {
        if (ballY > playerPaddleY && ballY < playerPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else {
            // AI scores
            aiScore++;
            checkWinningCondition();
            resetBall();
        }
    }

    if (ballX >= canvas.width - paddleWidth) {
        if (ballY > aiPaddleY && ballY < aiPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else {
            // Player scores
            playerScore++;
            checkWinningCondition();
            resetBall();
        }
    }
}


function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballMoving = false; // Ball freeze

    setTimeout(() => {
        ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * ballSpeed;
        ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * ballSpeed;
        ballMoving = true; // Ball unfreeze
    }, 100);
}


function checkWinningCondition() {
    if (playerScore >= winningScore || aiScore >= winningScore) {
        isPaused = true;
        alert(playerScore >= winningScore ? 'Player Wins!' : 'AI Wins!');
        playerScore = 0;
        aiScore = 0;
        resetBall(); // Resets the ball

    }
}

canvas.addEventListener('click', function () {
    if (isPaused) { 
        isPaused = false; // Resume the Game on 'click' event
        console.log('Game Resumed');
    }
});

window.addEventListener('mousemove', function (e) {
    const relativeY = e.clientY - canvas.getBoundingClientRect().top;
    if (relativeY > 0 && relativeY < canvas.height) {
        playerPaddleY = relativeY - paddleHeight / 2;
    }
});

function updateAI() {
    if (aiPaddleY + paddleHeight / 2 < ballY) {
        aiPaddleY += 2.75;
    } else if (aiPaddleY + paddleHeight / 2 > ballY) {
        aiPaddleY -= 2.75;
    }
}


function gameLoop() {
    draw();
    if (ballMoving) {
        update();
        updateAI();
    }
    requestAnimationFrame(gameLoop);
}

resetBall();
requestAnimationFrame(gameLoop);