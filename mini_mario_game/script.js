const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gameState = {
    coins: 0,
    score: 0,
    lives: 3,
    level: 1,
    isGameOver: false,
    levelComplete: false
};

const player = {
    x: 100,
    y: 100,
    width: 32,
    height: 40,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpPower: 13,
    onGround: false,
    direction: 1,
    invincible: false,
    invincibleTime: 0
};

const gravity = 0.6;
const friction = 0.8;
const maxVelocityX = 8;

let camera = {
    x: 0,
    y: 0
};

let platforms = [];
let coins = [];
let enemies = [];
let flag = null;

const keys = {};

const levels = [
    {
        platforms: [
            {x: 0, y: 450, width: 800, height: 50},
            {x: 200, y: 380, width: 150, height: 20},
            {x: 400, y: 310, width: 120, height: 20},
            {x: 600, y: 240, width: 150, height: 20},
            {x: 800, y: 380, width: 120, height: 20},
            {x: 1000, y: 310, width: 180, height: 20},
            {x: 1200, y: 240, width: 140, height: 20},
            {x: 1400, y: 450, width: 400, height: 50}
        ],
        coins: [
            {x: 250, y: 340}, {x: 280, y: 340}, {x: 310, y: 340},
            {x: 450, y: 270}, {x: 480, y: 270},
            {x: 650, y: 200}, {x: 680, y: 200}, {x: 710, y: 200},
            {x: 1050, y: 270}, {x: 1080, y: 270}, {x: 1110, y: 270},
            {x: 1250, y: 200}, {x: 1280, y: 200}
        ],
        enemies: [
            {x: 400, y: 430, width: 30, height: 30, direction: 1, speed: 2, range: 200, startX: 400},
            {x: 1000, y: 290, width: 30, height: 30, direction: 1, speed: 1.5, range: 150, startX: 1000}
        ],
        flag: {x: 1600, y: 350}
    },
    {
        platforms: [
            {x: 0, y: 450, width: 300, height: 50},
            {x: 400, y: 400, width: 100, height: 20},
            {x: 600, y: 350, width: 100, height: 20},
            {x: 800, y: 300, width: 100, height: 20},
            {x: 1000, y: 250, width: 150, height: 20},
            {x: 1250, y: 300, width: 100, height: 20},
            {x: 1450, y: 350, width: 100, height: 20},
            {x: 1650, y: 400, width: 100, height: 20},
            {x: 1850, y: 450, width: 300, height: 50}
        ],
        coins: [
            {x: 450, y: 360}, {x: 480, y: 360},
            {x: 650, y: 310}, {x: 680, y: 310},
            {x: 850, y: 260}, {x: 880, y: 260},
            {x: 1050, y: 210}, {x: 1080, y: 210}, {x: 1110, y: 210},
            {x: 1300, y: 260}, {x: 1330, y: 260},
            {x: 1500, y: 310}, {x: 1530, y: 310},
            {x: 1700, y: 360}, {x: 1730, y: 360}
        ],
        enemies: [
            {x: 600, y: 330, width: 30, height: 30, direction: 1, speed: 1.5, range: 150, startX: 600},
            {x: 1250, y: 280, width: 30, height: 30, direction: 1, speed: 2, range: 180, startX: 1250},
            {x: 1850, y: 430, width: 30, height: 30, direction: 1, speed: 1.8, range: 220, startX: 1850}
        ],
        flag: {x: 2000, y: 350}
    }
];

function loadLevel(levelNum) {
    const levelData = levels[levelNum - 1];
    platforms = JSON.parse(JSON.stringify(levelData.platforms));
    coins = JSON.parse(JSON.stringify(levelData.coins));
    enemies = JSON.parse(JSON.stringify(levelData.enemies));
    flag = {...levelData.flag};
    
    player.x = 100;
    player.y = 100;
    player.velocityX = 0;
    player.velocityY = 0;
    camera.x = 0;
    
    gameState.levelComplete = false;
}

function updateUI() {
    document.getElementById('coins').textContent = gameState.coins;
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('lives').textContent = gameState.lives;
    document.getElementById('level').textContent = gameState.level;
}

function drawPlayer() {
    ctx.save();
    ctx.translate(player.x - camera.x, player.y);
    
    if (player.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
        ctx.globalAlpha = 0.5;
    }
    
    if (player.direction === -1) {
        ctx.scale(-1, 1);
        ctx.translate(-player.width, 0);
    }
    
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(0, 10, player.width, 20);
    
    ctx.fillStyle = '#f39c12';
    ctx.fillRect(8, 0, 16, 12);
    
    ctx.fillStyle = 'white';
    ctx.fillRect(10, 2, 4, 4);
    ctx.fillRect(18, 2, 4, 4);
    ctx.fillStyle = 'black';
    ctx.fillRect(12, 3, 2, 2);
    ctx.fillRect(20, 3, 2, 2);
    
    ctx.fillStyle = '#3498db';
    const legOffset = player.onGround && Math.abs(player.velocityX) > 0.1 ? Math.sin(Date.now() / 100) * 3 : 0;
    ctx.fillRect(4, 30, 10, 10 + legOffset);
    ctx.fillRect(18, 30, 10, 10 - legOffset);
    
    ctx.restore();
}

function drawPlatforms() {
    platforms.forEach(platform => {
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(platform.x - camera.x, platform.y, platform.width, platform.height);
        
        ctx.fillStyle = '#229954';
        for (let i = 0; i < platform.width; i += 20) {
            ctx.fillRect(platform.x - camera.x + i, platform.y, 15, 5);
        }
    });
}

function drawCoins() {
    coins.forEach(coin => {
        if (!coin.collected) {
            const rotation = Math.sin(Date.now() / 200) * 0.3;
            const bounce = Math.sin(Date.now() / 300) * 5;
            
            ctx.save();
            ctx.translate(coin.x - camera.x + 10, coin.y + bounce + 10);
            ctx.rotate(rotation);
            
            ctx.fillStyle = '#f39c12';
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#f1c40f';
            ctx.beginPath();
            ctx.arc(0, 0, 7, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#f39c12';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$', 0, 0);
            
            ctx.restore();
        }
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = '#8e44ad';
        ctx.fillRect(enemy.x - camera.x, enemy.y, enemy.width, enemy.height);
        
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(enemy.x - camera.x + 5, enemy.y + 8, 6, 6);
        ctx.fillRect(enemy.x - camera.x + 19, enemy.y + 8, 6, 6);
        
        ctx.fillStyle = '#9b59b6';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(enemy.x - camera.x + 5 + i * 10, enemy.y);
            ctx.lineTo(enemy.x - camera.x + 10 + i * 10, enemy.y - 8);
            ctx.lineTo(enemy.x - camera.x + 15 + i * 10, enemy.y);
            ctx.fill();
        }
    });
}

function drawFlag() {
    if (flag) {
        ctx.fillStyle = '#95a5a6';
        ctx.fillRect(flag.x - camera.x, flag.y, 8, 100);
        
        ctx.fillStyle = '#27ae60';
        ctx.beginPath();
        ctx.moveTo(flag.x - camera.x + 8, flag.y + 10);
        ctx.lineTo(flag.x - camera.x + 48, flag.y + 25);
        ctx.lineTo(flag.x - camera.x + 8, flag.y + 40);
        ctx.fill();
        
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('★', flag.x - camera.x + 20, flag.y + 30);
    }
}

function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    const cloudPositions = [
        {x: 100 - camera.x * 0.3, y: 50},
        {x: 400 - camera.x * 0.3, y: 100},
        {x: 700 - camera.x * 0.3, y: 70},
        {x: 1100 - camera.x * 0.3, y: 90}
    ];
    
    cloudPositions.forEach(cloud => {
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, 25, 0, Math.PI * 2);
        ctx.arc(cloud.x + 30, cloud.y, 30, 0, Math.PI * 2);
        ctx.arc(cloud.x + 60, cloud.y, 25, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updatePlayer() {
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        player.velocityX -= player.speed * 0.3;
        player.direction = -1;
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        player.velocityX += player.speed * 0.3;
        player.direction = 1;
    }
    
    if ((keys['ArrowUp'] || keys['w'] || keys['W'] || keys[' ']) && player.onGround) {
        player.velocityY = -player.jumpPower;
        player.onGround = false;
    }
    
    player.velocityX *= friction;
    player.velocityY += gravity;
    
    player.velocityX = Math.max(-maxVelocityX, Math.min(maxVelocityX, player.velocityX));
    
    player.x += player.velocityX;
    player.y += player.velocityY;
    
    player.onGround = false;
    platforms.forEach(platform => {
        if (player.x + player.width > platform.x &&
            player.x < platform.x + platform.width &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height &&
            player.velocityY > 0) {
            
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.onGround = true;
        }
    });
    
    coins.forEach(coin => {
        if (!coin.collected &&
            player.x + player.width > coin.x &&
            player.x < coin.x + 20 &&
            player.y + player.height > coin.y &&
            player.y < coin.y + 20) {
            
            coin.collected = true;
            gameState.coins++;
            gameState.score += 100;
            updateUI();
        }
    });
    
    if (!player.invincible) {
        enemies.forEach(enemy => {
            if (player.x + player.width > enemy.x &&
                player.x < enemy.x + enemy.width &&
                player.y + player.height > enemy.y &&
                player.y < enemy.y + enemy.height) {
                
                if (player.velocityY > 0 && player.y + player.height - player.velocityY <= enemy.y) {
                    gameState.score += 200;
                    enemy.x = -1000; 
                    player.velocityY = -8;
                } else {
                    playerHit();
                }
            }
        });
    }
    
    if (flag && player.x + player.width > flag.x && player.x < flag.x + 50) {
        levelComplete();
    }
    
    if (player.y > canvas.height) {
        playerHit();
    }
    
    camera.x = Math.max(0, player.x - canvas.width / 3);
    
    if (player.invincible) {
        player.invincibleTime--;
        if (player.invincibleTime <= 0) {
            player.invincible = false;
        }
    }
}

function updateEnemies() {
    enemies.forEach(enemy => {
        enemy.x += enemy.speed * enemy.direction;
        
        if (enemy.x > enemy.startX + enemy.range) {
            enemy.direction = -1;
        } else if (enemy.x < enemy.startX - enemy.range) {
            enemy.direction = 1;
        }
    });
}

function playerHit() {
    if (player.invincible) return;
    
    gameState.lives--;
    updateUI();
    
    if (gameState.lives <= 0) {
        gameOver();
    } else {
        player.x = 100;
        player.y = 100;
        player.velocityX = 0;
        player.velocityY = 0;
        player.invincible = true;
        player.invincibleTime = 120;
        camera.x = 0;
    }
}

// Level Complete
function levelComplete() {
    if (gameState.levelComplete) return;
    
    gameState.levelComplete = true;
    const bonus = gameState.lives * 500;
    gameState.score += bonus;
    
    document.getElementById('levelCoins').textContent = gameState.coins;
    document.getElementById('levelBonus').textContent = bonus;
    document.getElementById('levelCompleteScreen').classList.add('show');
    updateUI();
}

// Next Level
function nextLevel() {
    gameState.level++;
    
    if (gameState.level > levels.length) {
        // Game won!
        alert('🎉 Congratulations! You beat all levels!\n\nFinal Score: ' + gameState.score);
        restartGame();
        return;
    }
    
    document.getElementById('levelCompleteScreen').classList.remove('show');
    loadLevel(gameState.level);
    updateUI();
    gameLoop();
}

// Game Over
function gameOver() {
    gameState.isGameOver = true;
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('finalCoins').textContent = gameState.coins;
    document.getElementById('finalLevel').textContent = gameState.level;
    document.getElementById('gameOverScreen').classList.add('show');
}

function restartGame() {
    gameState = {
        coins: 0,
        score: 0,
        lives: 3,
        level: 1,
        isGameOver: false,
        levelComplete: false
    };
    
    player.invincible = false;
    player.invincibleTime = 0;
    
    document.getElementById('gameOverScreen').classList.remove('show');
    document.getElementById('levelCompleteScreen').classList.remove('show');
    
    loadLevel(1);
    updateUI();
    gameLoop();
}

function gameLoop() {
    if (gameState.isGameOver || gameState.levelComplete) return;
    
    drawBackground();
    drawPlatforms();
    drawCoins();
    drawEnemies();
    drawFlag();
    drawPlayer();
    
    updatePlayer();
    updateEnemies();
    
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

let touchStartX = 0;
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    keys[' '] = true;
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys[' '] = false;
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touchX = e.touches[0].clientX;
    if (touchX < touchStartX - 30) {
        keys['ArrowLeft'] = true;
        keys['ArrowRight'] = false;
    } else if (touchX > touchStartX + 30) {
        keys['ArrowRight'] = true;
        keys['ArrowLeft'] = false;
    } else {
        keys['ArrowLeft'] = false;
        keys['ArrowRight'] = false;
    }
});

loadLevel(1);
updateUI();
gameLoop();