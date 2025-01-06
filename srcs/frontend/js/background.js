const ball = document.querySelector('.pong-ball');

// Initialize ball position
let ballX = window.innerWidth / 2 - parseFloat(getComputedStyle(ball).width) / 2;
let ballY = window.innerHeight / 2 - parseFloat(getComputedStyle(ball).height) / 2;
let ballSpeedX = 4;
let ballSpeedY = 3;

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce on sides
    if (ballX <= 0 || ballX >= window.innerWidth - ball.offsetWidth) ballSpeedX *= -1;
    // Bounce on top/bottom
    if (ballY <= 0 || ballY >= window.innerHeight - ball.offsetHeight) ballSpeedY *= -1;

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
}

function handleResize() {
    ballX = Math.min(ballX, window.innerWidth - ball.offsetWidth);
    ballY = Math.min(ballY, window.innerHeight - ball.offsetHeight);
}

window.addEventListener('resize', handleResize);

function gameLoop() {
    moveBall();
    requestAnimationFrame(gameLoop);
}

// Initialize ball position in DOM
ball.style.position = 'absolute';
ball.style.left = `${ballX}px`;
ball.style.top = `${ballY}px`;

gameLoop();