const maze = document.getElementById("maze");
const statusText = document.getElementById("status");
const levelText = document.getElementById("level");
const timerText = document.getElementById("timer");
const scoreText = document.getElementById("score");
const restartBtn = document.getElementById("restart");
const starfield = document.getElementById("starfield");

const moveSound = document.getElementById("move-sound");
const hitSound = document.getElementById("hit-sound");
const warpSound = document.getElementById("warp-sound");

const size = 20;
let playerPos, portalPos;
let cells = [];
let mazeLayout = [];
let level = 1;
let score = 0;
let time = 0;
let timerInterval;
let perfectRun = true;

// Utility
function idx(x, y) { return y * size + x; }

// Stars & comets
for(let i=0;i<100;i++){
  const star = document.createElement("div");
  star.classList.add("star");
  star.style.top = Math.random()*window.innerHeight+"px";
  star.style.left = Math.random()*window.innerWidth+"px";
  star.style.animationDuration = 1 + Math.random()*3 + "s";
  starfield.appendChild(star);
}

function generateComets(num=7){
  for(let i=0;i<num;i++){
    const comet = document.createElement("div");
    comet.classList.add("comet");
    comet.style.top = Math.random()*window.innerHeight+"px";
    comet.style.left = Math.random()*window.innerWidth+"px";
    comet.style.animationDuration = (3+Math.random()*3)+"s";
    starfield.appendChild(comet);
    comet.addEventListener("animationend",()=>{
      comet.style.top=Math.random()*window.innerHeight+"px";
      comet.style.left=window.innerWidth+"px";
      comet.style.animationDuration=(3+Math.random()*3)+"s";
      comet.style.animation="moveComet linear "+comet.style.animationDuration+"s";
    });
  }
}
generateComets();

// Maze generation
function isSolvable(layout){
  const queue=[{x:0,y:0}];const visited=new Set();
  const key=(x,y)=>`${x},${y}`;
  while(queue.length>0){
    const {x,y}=queue.shift();
    if(x===size-1&&y===size-1) return true;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=x+dx,ny=y+dy;
      if(nx<0||ny<0||nx>=size||ny>=size) continue;
      if(layout[idx(nx,ny)]===1) continue;
      if(visited.has(key(nx,ny))) continue;
      visited.add(key(nx,ny));
      queue.push({x:nx,y:ny});
    }
  }
  return false;
}

function generateMaze(newMaze=true){
  maze.innerHTML="";
  cells=[];
  if(newMaze){
    do{
      mazeLayout=Array(size*size).fill(0).map(()=>Math.random()<0.22?1:0);
      for(let y=0;y<3;y++) for(let x=0;x<3;x++) mazeLayout[idx(x,y)]=0;
      for(let y=size-3;y<size;y++) for(let x=size-3;x<size;x++) mazeLayout[idx(x,y)]=0;
    }while(!isSolvable(mazeLayout));
  }
  for(let i=0;i<size*size;i++){
    const cell=document.createElement("div");
    cell.classList.add("cell");
    if(mazeLayout[i]===1) cell.classList.add("wall");
    maze.appendChild(cell);
    cells.push(cell);
  }
  playerPos=0;
  portalPos=size*size-1;
  cells[playerPos].classList.add("player");
  cells[portalPos].classList.add("portal");
}

// Timer
function startTimer(){
  time=0;
  timerText.textContent=`Time: ${time}s`;
  clearInterval(timerInterval);
  timerInterval=setInterval(()=>{
    time++;
    timerText.textContent=`Time: ${time}s`;
  },1000);
}

// Player movement
function leaveTrail(){
  const trail=document.createElement("div");
  trail.classList.add("trail");
  const rect=cells[playerPos].getBoundingClientRect();
  trail.style.top=rect.top+"px";
  trail.style.left=rect.left+"px";
  document.body.appendChild(trail);
  setTimeout(()=>trail.remove(),400);
}

function movePlayer(e){
  const x=playerPos%size;
  const y=Math.floor(playerPos/size);
  let newPos=playerPos;

  if(e.key==="ArrowUp"&&y>0) newPos-=size;
  if(e.key==="ArrowDown"&&y<size-1) newPos+=size;
  if(e.key==="ArrowLeft"&&x>0) newPos-=1;
  if(e.key==="ArrowRight"&&x<size-1) newPos+=1;
  if(newPos===playerPos) return;

  if(cells[newPos].classList.contains("wall")){
    hitSound.play();
    cells[playerPos].classList.remove("player");
    cells[playerPos].classList.add("explosion");
    maze.classList.add("maze-shake");
    perfectRun=false;
    clearInterval(timerInterval);
    statusText.textContent="💥 You hit a meteor! Restarting...";
    setTimeout(()=>{
      maze.classList.remove("maze-shake");
      generateMaze(false);
      startTimer();
      statusText.textContent="";
    },1200);
    return;
  }

  moveSound.play();
  leaveTrail();
  cells[playerPos].classList.remove("player");
  playerPos=newPos;
  cells[playerPos].classList.add("player");

  if(playerPos===portalPos){
    warpSound.play();
    clearInterval(timerInterval);
    let points;
    if(!perfectRun) points=50;
    else points=(time<=30?100:80);
    score+=points;
    scoreText.textContent=`Score: ${score}`;

    perfectRun=true;
    level++;
    levelText.textContent=`Level: ${level}`;
    levelText.classList.add("up");
    setTimeout(()=>levelText.classList.remove("up"),600);

    statusText.textContent=`🛸 You reached the portal! +${points} points`;
    setTimeout(()=>{
      generateMaze(true);
      startTimer();
      statusText.textContent="";
    },1500);
  }
}

// Restart button
restartBtn.addEventListener("click",()=>{
  perfectRun=false;
  generateMaze(false);
  startTimer();
  statusText.textContent="";
});

// Init
document.addEventListener("keydown",movePlayer);
generateMaze(true);
startTimer();
