/**
 * Pong Game - Classic arcade game implementation
 * Hacktoberfest 2025
 * 
 * A two-player pong game where you play against the computer.
 * Control your paddle with the mouse or W/S keys.
 */

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let gameRunning = false;
let gamePaused = false;
let playerScore = 0;
let computerScore = 0;
let winningScore = 5;

// Difficulty settings
const difficulties = {
    easy: { computerSpeed: 3, ballSpeed: 4 },
    medium: { computerSpeed: 4, ballSpeed: 5 },
    hard: { computerSpeed: 5, ballSpeed: 6.5 }
};

let currentDifficulty = difficulties.medium;

// Paddle properties
const paddleWidth = 15;
const paddleHeight = 80;
const paddleSpeed = 8;

// Player paddle
const player = {
    x: 20,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

// Computer paddle
const computer = {
    x: canvas.width - 20 - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight
};

// Ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    dx: 5,
    dy: 3,
    speed: 5
};

// Mouse tracking
let mouseY = canvas.height / 2;

/**
 * Initialize or reset the game
 */
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    updateScoreboard();
    resetBall();
    player.y = canvas.height / 2 - paddleHeight / 2;
    computer.y = canvas.height / 2 - paddleHeight / 2;
}

/**
 * Reset ball to center with random direction
 */
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    
    // Random direction
    const angle = (Math.random() * Math.PI / 3) - Math.PI / 6; // -30 to 30 degrees
    const direction = Math.random() < 0.5 ? 1 : -1;
    
    ball.speed = currentDifficulty.ballSpeed;
    ball.dx = direction * ball.speed * Math.cos(angle);
    ball.dy = ball.speed * Math.sin(angle);
}

/**
 * Start the game
 */
function startGame() {
    // Get difficulty setting
    const difficultySelect = document.getElementById('difficulty');
    currentDifficulty = difficulties[difficultySelect.value];
    
    resetGame();
    gameRunning = true;
    gamePaused = false;
    
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('pauseBtn').style.display = 'inline-block';
    document.getElementById('gameStatus').textContent = 'Game in progress...';
    
    gameLoop();
}

/**
 * Toggle pause state
 */
function togglePause() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    
    if (gamePaused) {
        document.getElementById('pauseBtn').textContent = 'RESUME';
        document.getElementById('gameStatus').textContent = 'PAUSED';
    } else {
        document.getElementById('pauseBtn').textContent = 'PAUSE';
        document.getElementById('gameStatus').textContent = 'Game in progress...';
        gameLoop();
    }
}

/**
 * End the game and show winner
 */
function endGame(winner) {
    gameRunning = false;
    document.getElementById('startBtn').style.display = 'inline-block';
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('gameStatus').textContent = `${winner} WINS! 🎉`;
    document.getElementById('startBtn').textContent = 'PLAY AGAIN';
}

/**
 * Update player paddle position
 */
function updatePlayer() {
    // Keyboard controls
    player.y += player.dy;
    
    // Mouse controls (smooth following)
    const targetY = mouseY - player.height / 2;
    const diff = targetY - player.y;
    player.y += diff * 0.2;
    
    // Keep paddle within canvas
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

/**
 * Update computer paddle position (AI)
 */
function updateComputer() {
    // Predict where ball will be
    const ballCenter = ball.y;
    const paddleCenter = computer.y + computer.height / 2;
    
    // Add some imperfection to make it beatable
    const reactionDelay = 5;
    
    if (ball.dx > 0) { // Ball moving towards computer
        if (paddleCenter < ballCenter - reactionDelay) {
            computer.y += currentDifficulty.computerSpeed;
        } else if (paddleCenter > ballCenter + reactionDelay) {
            computer.y -= currentDifficulty.computerSpeed;
        }
    } else {
        // Return to center when ball is moving away
        const centerY = canvas.height / 2 - computer.height / 2;
        if (computer.y < centerY) {
            computer.y += 2;
        } else if (computer.y > centerY) {
            computer.y -= 2;
        }
    }
    
    // Keep paddle within canvas
    if (computer.y < 0) computer.y = 0;
    if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
}

/**
 * Update ball position and handle collisions
 */
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Top and bottom wall collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy *= -1;
    }
    
    // Player paddle collision
    if (ball.x - ball.radius < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height) {
        
        // Calculate hit position (-1 to 1)
        const hitPos = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
        
        // Adjust angle based on where the ball hit the paddle
        ball.dx = Math.abs(ball.dx);
        ball.dy = hitPos * ball.speed * 0.8;
        
        // Slight speed increase
        ball.speed *= 1.05;
        ball.dx = ball.speed * Math.cos(Math.atan2(ball.dy, ball.dx));
    }
    
    // Computer paddle collision
    if (ball.x + ball.radius > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height) {
        
        const hitPos = (ball.y - (computer.y + computer.height / 2)) / (computer.height / 2);
        
        ball.dx = -Math.abs(ball.dx);
        ball.dy = hitPos * ball.speed * 0.8;
        
        ball.speed *= 1.05;
        ball.dx = -ball.speed * Math.cos(Math.atan2(ball.dy, Math.abs(ball.dx)));
    }
    
    // Score points
    if (ball.x - ball.radius < 0) {
        computerScore++;
        updateScoreboard();
        
        if (computerScore >= winningScore) {
            endGame('COMPUTER');
        } else {
            resetBall();
        }
    }
    
    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        updateScoreboard();
        
        if (playerScore >= winningScore) {
            endGame('PLAYER');
        } else {
            resetBall();
        }
    }
}

/**
 * Update scoreboard display
 */
function updateScoreboard() {
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
}

/**
 * Draw a paddle
 */
function drawPaddle(paddle) {
    ctx.fillStyle = 'white';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    // Add gradient effect
    const gradient = ctx.createLinearGradient(paddle.x, 0, paddle.x + paddle.width, 0);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

/**
 * Draw the ball
 */
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    
    // Add glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'white';
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.closePath();
}

/**
 * Draw the center line
 */
function drawCenterLine() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

/**
 * Draw everything
 */
function draw() {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    drawCenterLine();
    
    // Draw paddles and ball
    drawPaddle(player);
    drawPaddle(computer);
    drawBall();
}

/**
 * Main game loop
 */
function gameLoop() {
    if (!gameRunning || gamePaused) return;
    
    updatePlayer();
    updateComputer();
    updateBall();
    draw();
    
    requestAnimationFrame(gameLoop);
}

// Event Listeners

// Mouse movement
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'W') {
        player.dy = -paddleSpeed;
    } else if (e.key === 's' || e.key === 'S') {
        player.dy = paddleSpeed;
    } else if (e.key === 'p' || e.key === 'P') {
        togglePause();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'W' || e.key === 's' || e.key === 'S') {
        player.dy = 0;
    }
});

// Initial draw
draw();
