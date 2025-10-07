// Whack-a-Mole with Web Audio API for sounds
const holes = document.querySelectorAll(".hole");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const difficultySelect = document.getElementById("difficulty");
const countdownDisplay = document.getElementById("countdown");

let audioCtx = null;

// Audio helper: ensure AudioContext exists and is resumed (user gesture required)
function ensureAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

// Short percussive "hit" sound using oscillator + gain envelope
function playHitSound() {
  const ctx = ensureAudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(900, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.22, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.25);
}

// Multi-tone descending "game over" jingle
function playGameOverSound() {
  const ctx = ensureAudioContext();
  const now = ctx.currentTime;
  const freqs = [780, 620, 460, 320];
  freqs.forEach((f, i) => {
    const start = now + i * 0.13;
    const dur = 0.12;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(f, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.18, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + dur + 0.02);
  });
}

/* Game variables */
let score = 0;
let currentHole = null;
let gameTimer = null;
let countdownTimer = null;
let moleSpeed = 800;
const gameTime = 30;

const difficultyLevels = {
  easy: 1000,
  medium: 800,
  hard: 500
};

/* Create mole DOM structure in a hole if not present */
function createMole(hole) {
  if (hole.querySelector(".mole")) return;

  const mole = document.createElement("div");
  mole.className = "mole";

  const eyeLeft = document.createElement("div");
  eyeLeft.className = "eye-left";
  const pupilLeft = document.createElement("div");
  pupilLeft.className = "pupil-left";
  eyeLeft.appendChild(pupilLeft);

  const eyeRight = document.createElement("div");
  eyeRight.className = "eye-right";
  const pupilRight = document.createElement("div");
  pupilRight.className = "pupil-right";
  eyeRight.appendChild(pupilRight);

  const nose = document.createElement("div");
  nose.className = "nose";

  const mouth = document.createElement("div");
  mouth.className = "mouth";

  const earLeft = document.createElement("div");
  earLeft.className = "ear-left";
  const earRight = document.createElement("div");
  earRight.className = "ear-right";

  mole.appendChild(earLeft);
  mole.appendChild(earRight);
  mole.appendChild(eyeLeft);
  mole.appendChild(eyeRight);
  mole.appendChild(nose);
  mole.appendChild(mouth);

  hole.appendChild(mole);
}

/* Pick a random hole and show mole */
function randomHole() {
  holes.forEach(h => h.classList.remove("active"));
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  hole.classList.add("active");
  currentHole = hole;
  createMole(hole);
}

/* Countdown (3..2..1..Go!) before starting main loop */
function startCountdown(cb) {
  let count = 3;
  countdownDisplay.textContent = count;
  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownDisplay.textContent = count;
    } else {
      countdownDisplay.textContent = "Go!";
      setTimeout(() => {
        countdownDisplay.textContent = "";
        clearInterval(interval);
        cb();
      }, 500);
    }
  }, 1000);
}

/* Start main game */
function startGame() {
  // ensure audio unlocked on start gesture
  ensureAudioContext();

  score = 0;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = gameTime;
  startBtn.disabled = true;
  restartBtn.style.display = "none";

  moleSpeed = difficultyLevels[difficultySelect.value] || 800;

  startCountdown(() => {
    randomHole();
    gameTimer = setInterval(randomHole, moleSpeed);

    let timeLeft = gameTime;
    countdownTimer = setInterval(() => {
      timeLeft--;
      timeDisplay.textContent = timeLeft;
      if (timeLeft <= 0) endGame();
    }, 1000);
  });
}

/* End game cleanly */
function endGame() {
  clearInterval(gameTimer);
  clearInterval(countdownTimer);
  holes.forEach(h => h.classList.remove("active"));
  startBtn.disabled = false;
  restartBtn.style.display = "inline-block";
  // play tone to signal game over
  playGameOverSound();
}

/* Handle mole clicks (hit) */
holes.forEach(hole => {
  hole.addEventListener("click", () => {
    if (!hole.classList.contains("active")) return;
    // increment and give audio feedback
    score++;
    scoreDisplay.textContent = score;
    hole.classList.remove("active");
    playHitSound();
  });
});

/* Buttons */
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", () => {
  restartBtn.style.display = "none";
  // startGame will re-initialize and re-unlock audio if needed
  startGame();
});
