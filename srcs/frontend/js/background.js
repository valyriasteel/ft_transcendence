

waitForBallElement();

export function ball() {
    const ball = document.querySelector('.pong-ball');
    
    if (ball) {
        const ballWidth = ball.offsetWidth;
        const ballHeight = ball.offsetHeight;

        let ballX = Math.random() * (window.innerWidth - ballWidth);
        let ballY = Math.random() * (window.innerHeight - ballHeight);

        let ballSpeedX = 4;
        let ballSpeedY = 3;

        function moveBall() {
            ballX += ballSpeedX;
            ballY += ballSpeedY;

            if (ballX <= 0 || ballX >= window.innerWidth - ballWidth) ballSpeedX *= -1;
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

        ball.style.position = 'absolute';
        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;

        gameLoop();
    }
}

export function waitForBallElement() {
    const ball1 = document.querySelector('.pong-ball');
    if (ball1) {
        ball();
    } else {
        setTimeout(waitForBallElement, 100);
    }
}