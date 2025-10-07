// Audio Context for sound generation
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Game state variables
let sequence = [];
let playerSequence = [];
let score = 0;
let highScore = localStorage.getItem('simonHighScore') || 0;
let isPlayerTurn = false;
let isPlaying = false;

// Sound frequencies for each button
const frequencies = {
    0: 329.63, // E4 - Red
    1: 392.00, // G4 - Green
    2: 523.25, // C5 - Blue
    3: 587.33  // D5 - Yellow
};

// Initialize high score display
document.getElementById('highScore').textContent = highScore;
if (highScore > 0) {
    document.getElementById('highScoreDisplay').textContent = `High Score: ${highScore}`;
}

/**
 * Play sound for a button
 */
function playSound(buttonId) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequencies[buttonId];
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

/**
 * Flash a button with animation
 */
function flashButton(buttonId) {
    return new Promise(resolve => {
        const button = document.getElementById(`btn-${buttonId}`);
        button.classList.add('flash');
        playSound(buttonId);

        setTimeout(() => {
            button.classList.remove('flash');
            setTimeout(resolve, 200);
        }, 400);
    });
}

/**
 * Play the current sequence
 */
async function playSequence() {
    isPlaying = true;
    disableButtons();
    document.getElementById('message').textContent = 'Watch the pattern...';

    await new Promise(resolve => setTimeout(resolve, 500));

    for (let i = 0; i < sequence.length; i++) {
        await flashButton(sequence[i]);
    }

    isPlaying = false;
    isPlayerTurn = true;
    enableButtons();
    document.getElementById('message').textContent = 'Your turn!';
}

/**
 * Disable all color buttons
 */
function disableButtons() {
    document.querySelectorAll('.color-button').forEach(btn => {
        btn.classList.add('disabled');
    });
}

/**
 * Enable all color buttons
 */
function enableButtons() {
    document.querySelectorAll('.color-button').forEach(btn => {
        btn.classList.remove('disabled');
    });
}

/**
 * Handle player button click
 */
function handlePlayerClick(buttonId) {
    if (!isPlayerTurn || isPlaying) return;

    playSound(buttonId);
    const button = document.getElementById(`btn-${buttonId}`);
    button.classList.add('flash');
    setTimeout(() => button.classList.remove('flash'), 200);

    playerSequence.push(buttonId);

    // Check if the clicked button is correct
    const currentIndex = playerSequence.length - 1;
    if (playerSequence[currentIndex] !== sequence[currentIndex]) {
        gameOver();
        return;
    }

    // Check if player completed the entire sequence
    if (playerSequence.length === sequence.length) {
        isPlayerTurn = false;
        score++;
        document.getElementById('score').textContent = score;
        document.getElementById('message').textContent = 'Correct! Next round...';
        
        setTimeout(() => {
            playerSequence = [];
            addToSequence();
            playSequence();
        }, 1000);
    }
}

/**
 * Add random button to sequence
 */
function addToSequence() {
    const randomButton = Math.floor(Math.random() * 4);
    sequence.push(randomButton);
}

/**
 * Start a new game
 */
function startGame() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    
    sequence = [];
    playerSequence = [];
    score = 0;
    document.getElementById('score').textContent = score;
    
    addToSequence();
    playSequence();
}

/**
 * Handle game over
 */
function gameOver() {
    isPlayerTurn = false;
    disableButtons();
    document.getElementById('message').textContent = 'Wrong! Game Over!';
    
    // Check for new high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('simonHighScore', highScore);
        document.getElementById('highScore').textContent = highScore;
        document.getElementById('newHighScore').classList.remove('hidden');
    } else {
        document.getElementById('newHighScore').classList.add('hidden');
    }
    
    document.getElementById('finalScore').textContent = score;
    
    setTimeout(() => {
        document.getElementById('gameScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }, 1500);
}

/**
 * Restart the game
 */
function restartGame() {
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    
    sequence = [];
    playerSequence = [];
    score = 0;
    document.getElementById('score').textContent = score;
    
    addToSequence();
    playSequence();
}