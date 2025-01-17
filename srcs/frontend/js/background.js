document.addEventListener("DOMContentLoaded", () => {
    ball();
});

function ball() {
    const ball = document.querySelector('.pong-ball');
    if (ball) {
        // Get ball dimensions
        const ballWidth = ball.offsetWidth;
        const ballHeight = ball.offsetHeight;

        // Generate random start positions for the ball
        let ballX = Math.random() * (window.innerWidth - ballWidth);
        let ballY = Math.random() * (window.innerHeight - ballHeight);

        // Ball speed
        let ballSpeedX = 4;
        let ballSpeedY = 3;

        function moveBall() {
            ballX += ballSpeedX;
            ballY += ballSpeedY;

            // Bounce on sides
            if (ballX <= 0 || ballX >= window.innerWidth - ballWidth) ballSpeedX *= -1;
            // Bounce on top/bottom
            if (ballY <= 0 || ballY >= window.innerHeight - ballHeight) ballSpeedY *= -1;

            ball.style.left = `${ballX}px`;
            ball.style.top = `${ballY}px`;
        }

        function handleResize() {
            ballX = Math.min(ballX, window.innerWidth - ballWidth);
            ballY = Math.min(ballY, window.innerHeight - ballHeight);
        }

        window.addEventListener('resize', handleResize);

        function gameLoop() {
            moveBall();
            requestAnimationFrame(gameLoop);
        }

        // Set the initial random position for the ball
        ball.style.position = 'absolute';
        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;

        gameLoop();
    } else {
        console.error("Ball element not found");
    }
}
