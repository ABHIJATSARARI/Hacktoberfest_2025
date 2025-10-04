// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// Game state
let gameRunning = true;
let score = 0;
let lives = 3;
let animationId;

// Player
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 80,
  width: 50,
  height: 50,
  speed: 7,
  dx: 0,
};

// Arrays
let bullets = [];
let asteroids = [];
let particles = [];

// Controls
const keys = {};

// Create stars background
function createStars() {
  const container = document.getElementById("gameContainer");
  for (let i = 0; i < 50; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.width = Math.random() * 3 + "px";
    star.style.height = star.style.width;
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 2 + "s";
    container.appendChild(star);
  }
}

// Draw player
function drawPlayer() {
  ctx.fillStyle = "#00d4ff";
  ctx.beginPath();
  ctx.moveTo(player.x + player.width / 2, player.y);
  ctx.lineTo(player.x, player.y + player.height);
  ctx.lineTo(player.x + player.width / 2, player.y + player.height - 15);
  ctx.lineTo(player.x + player.width, player.y + player.height);
  ctx.closePath();
  ctx.fill();

  // Engine flames
  ctx.fillStyle = "#ff4444";
  ctx.fillRect(player.x + 15, player.y + player.height - 10, 8, 10);
  ctx.fillRect(player.x + 27, player.y + player.height - 10, 8, 10);
}

// Move player
function movePlayer() {
  player.x += player.dx;

  // Boundary detection
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;
}

// Create bullet
function createBullet() {
  bullets.push({
    x: player.x + player.width / 2 - 2,
    y: player.y,
    width: 4,
    height: 15,
    speed: 8,
  });
}

// Draw and update bullets
function updateBullets() {
  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;

    ctx.fillStyle = "#ffff00";
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

    // Remove bullets that are off screen
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });
}

// Create asteroid
function createAsteroid() {
  asteroids.push({
    x: Math.random() * (canvas.width - 40),
    y: -40,
    width: 40,
    height: 40,
    speed: Math.random() * 2 + 2,
    rotation: Math.random() * Math.PI * 2,
  });
}

// Draw and update asteroids
function updateAsteroids() {
  asteroids.forEach((asteroid, index) => {
    asteroid.y += asteroid.speed;
    asteroid.rotation += 0.05;

    // Draw rotating asteroid
    ctx.save();
    ctx.translate(
      asteroid.x + asteroid.width / 2,
      asteroid.y + asteroid.height / 2
    );
    ctx.rotate(asteroid.rotation);
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(
      -asteroid.width / 2,
      -asteroid.height / 2,
      asteroid.width,
      asteroid.height
    );
    ctx.strokeStyle = "#654321";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      -asteroid.width / 2,
      -asteroid.height / 2,
      asteroid.width,
      asteroid.height
    );
    ctx.restore();

    // Check collision with player
    if (
      asteroid.y + asteroid.height > player.y &&
      asteroid.x < player.x + player.width &&
      asteroid.x + asteroid.width > player.x
    ) {
      asteroids.splice(index, 1);
      lives--;
      document.getElementById("lives").textContent = lives;
      createExplosion(asteroid.x, asteroid.y);

      if (lives <= 0) {
        endGame();
      }
    }

    // Remove asteroids that are off screen
    if (asteroid.y > canvas.height) {
      asteroids.splice(index, 1);
    }
  });
}

// Check bullet-asteroid collisions
function checkCollisions() {
  bullets.forEach((bullet, bIndex) => {
    asteroids.forEach((asteroid, aIndex) => {
      if (
        bullet.x < asteroid.x + asteroid.width &&
        bullet.x + bullet.width > asteroid.x &&
        bullet.y < asteroid.y + asteroid.height &&
        bullet.y + bullet.height > asteroid.y
      ) {
        // Remove bullet and asteroid
        bullets.splice(bIndex, 1);
        asteroids.splice(aIndex, 1);

        // Increase score
        score += 10;
        document.getElementById("score").textContent = score;

        // Create explosion effect
        createExplosion(asteroid.x, asteroid.y);
      }
    });
  });
}

// Create explosion effect
function createExplosion(x, y) {
  for (let i = 0; i < 15; i++) {
    particles.push({
      x: x + 20,
      y: y + 20,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      life: 30,
      color: `hsl(${Math.random() * 60 + 10}, 100%, 50%)`,
    });
  }
}

// Update particles
function updateParticles() {
  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life--;

    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.life / 30;
    ctx.fillRect(particle.x, particle.y, 4, 4);
    ctx.globalAlpha = 1;

    if (particle.life <= 0) {
      particles.splice(index, 1);
    }
  });
}

// Main game loop
function gameLoop() {
  if (!gameRunning) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw everything
  drawPlayer();
  movePlayer();
  updateBullets();
  updateAsteroids();
  updateParticles();
  checkCollisions();

  // Spawn asteroids randomly
  if (Math.random() < 0.02) {
    createAsteroid();
  }

  animationId = requestAnimationFrame(gameLoop);
}

// End game
function endGame() {
  gameRunning = false;
  document.getElementById("finalScore").textContent = score;
  document.getElementById("gameOver").style.display = "block";
  cancelAnimationFrame(animationId);
}

// Restart game
function restartGame() {
  gameRunning = true;
  score = 0;
  lives = 3;
  bullets = [];
  asteroids = [];
  particles = [];
  player.x = canvas.width / 2 - 25;
  player.dx = 0;

  document.getElementById("score").textContent = score;
  document.getElementById("lives").textContent = lives;
  document.getElementById("gameOver").style.display = "none";

  gameLoop();
}

// Keyboard event listeners
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  if (e.key === "ArrowLeft") {
    player.dx = -player.speed;
  }
  if (e.key === "ArrowRight") {
    player.dx = player.speed;
  }
  if (e.key === " ") {
    e.preventDefault();
    createBullet();
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;

  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    player.dx = 0;
  }
});

// Restart button event listener
document.getElementById("restartBtn").addEventListener("click", restartGame);

// Initialize game
createStars();
gameLoop();
