  const gameBoard = document.getElementById('game-board');
        const movesCountSpan = document.getElementById('moves-count');
        const chronoBtn = document.getElementById('chrono-btn');
        const newGameBtn = document.getElementById('new-game-btn');
        const winModal = document.getElementById('win-modal');
        const finalMovesSpan = document.getElementById('final-moves');
        const playAgainBtn = document.getElementById('play-again-btn');
        const rulesBtn = document.getElementById('rules-btn');
        const rulesModal = document.getElementById('rules-modal');
        const closeRulesBtn = document.getElementById('close-rules-btn');

        const GRID_SIZE = 4;
        const TOTAL_TILES = GRID_SIZE * GRID_SIZE;
        const SHUFFLE_MOVES = 100;

        const TILE_TYPES = {
            'corner': { svg: '<path class="circuit" d="M20 80 Q20 20 80 20"/>', connections: [2, 3] },
            'straight': { svg: '<path class="circuit" d="M20 50 L80 50"/>', connections: [1, 3] },
        };
        
        const SOLVED_PATH = [
            { type: 'corner', rotation: 0 }, { type: 'straight', rotation: 0 }, { type: 'straight', rotation: 0 }, { type: 'corner', rotation: 1 },
            { type: 'straight', rotation: 1 }, { type: 'corner', rotation: 0 }, { type: 'corner', rotation: 1 }, { type: 'straight', rotation: 1 },
            { type: 'straight', rotation: 1 }, { type: 'corner', rotation: 3 }, { type: 'corner', rotation: 2 }, { type: 'straight', rotation: 1 },
            { type: 'corner', rotation: 3 }, { type: 'straight', rotation: 0 }, { type: 'straight', rotation: 0 }, { type: 'corner', rotation: 2 }
        ];

        let boardState = [];
        let emptyTileIndex = -1;
        let moveHistory = [];
        let moves = 0;

        function getTileSVG(tile) {
            if (!tile || tile.type === 'empty') return '';
            const typeInfo = TILE_TYPES[tile.type];
            return `<svg viewBox="0 0 100 100" style="transform: rotate(${tile.rotation * 90}deg);">${typeInfo.svg}</svg>`;
        }

        function renderBoard() {
            gameBoard.innerHTML = '';
            gameBoard.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
            boardState.forEach((tile, index) => {
                const tileEl = document.createElement('div');
                tileEl.classList.add('tile');
                tileEl.dataset.index = index;

                if (tile.type === 'empty') {
                    tileEl.classList.add('empty');
                } else {
                    tileEl.innerHTML = getTileSVG(tile);
                    tileEl.addEventListener('click', handleTileClick);
                }
                gameBoard.appendChild(tileEl);
            });
            updateStats();
        }
        
        function updateStats() {
            movesCountSpan.textContent = moves;
            chronoBtn.disabled = moveHistory.length === 0;
        }

        function swapTiles(index1, index2) {
            [boardState[index1], boardState[index2]] = [boardState[index2], boardState[index1]];

            if (boardState[index1].type === 'empty') emptyTileIndex = index1;
            if (boardState[index2].type === 'empty') emptyTileIndex = index2;
            
            renderBoard();
        }

        function handleTileClick(event) {
            const clickedIndex = parseInt(event.currentTarget.dataset.index);
            const { row: clickedRow, col: clickedCol } = getRowCol(clickedIndex);
            const { row: emptyRow, col: emptyCol } = getRowCol(emptyTileIndex);

            const isAdjacent = (Math.abs(clickedRow - emptyRow) + Math.abs(clickedCol - emptyCol)) === 1;

            if (isAdjacent) {
                moveHistory.push({ from: clickedIndex, to: emptyTileIndex });
                moves++;
                swapTiles(clickedIndex, emptyTileIndex);
                
                setTimeout(checkWin, 100);
            }
        }
        
        function checkWin() {
            let isSolved = true;
            for(let i=0; i<TOTAL_TILES - 1; i++){
                if(boardState[i].type !== SOLVED_PATH[i].type || boardState[i].rotation !== SOLVED_PATH[i].rotation){
                    isSolved = false;
                    break;
                }
            }
            
            if (isSolved){
                 showWinModal();
            }
        }

        function showWinModal() {
            finalMovesSpan.textContent = moves;
            winModal.classList.add('visible');
        }

        function hideWinModal() {
            winModal.classList.remove('visible');
        }

        function showRulesModal() {
            rulesModal.classList.add('visible');
        }

        function hideRulesModal() {
            rulesModal.classList.remove('visible');
        }

        function performChronoShift() {
            if (moveHistory.length > 0) {
                const lastMove = moveHistory.pop();
                moves++;
                swapTiles(lastMove.to, lastMove.from);
            }
        }

        function getRowCol(index) {
            return {
                row: Math.floor(index / GRID_SIZE),
                col: index % GRID_SIZE,
            };
        }

        function shuffleBoard() {
            for (let i = 0; i < SHUFFLE_MOVES; i++) {
                const { row: emptyRow, col: emptyCol } = getRowCol(emptyTileIndex);
                const possibleMoves = [];

                if (emptyRow > 0) possibleMoves.push(emptyTileIndex - GRID_SIZE);
                if (emptyRow < GRID_SIZE - 1) possibleMoves.push(emptyTileIndex + GRID_SIZE);
                if (emptyCol > 0) possibleMoves.push(emptyTileIndex - 1);
                if (emptyCol < GRID_SIZE - 1) possibleMoves.push(emptyTileIndex + 1);

                const randomIndex = Math.floor(Math.random() * possibleMoves.length);
                const tileToMove = possibleMoves[randomIndex];
                swapTiles(tileToMove, emptyTileIndex);
            }
            moves = 0;
            moveHistory = [];
        }

        function newGame() {
            hideWinModal();
            boardState = JSON.parse(JSON.stringify(SOLVED_PATH));
            boardState.push({ type: 'empty' });
            
            emptyTileIndex = TOTAL_TILES - 1; 

            SOLVED_PATH[TOTAL_TILES - 1] = {type:'empty'};

            shuffleBoard();
            renderBoard();
        }

        chronoBtn.addEventListener('click', performChronoShift);
        newGameBtn.addEventListener('click', newGame);
        playAgainBtn.addEventListener('click', newGame);
        rulesBtn.addEventListener('click', showRulesModal);
        closeRulesBtn.addEventListener('click', hideRulesModal);

        window.addEventListener('click', (event) => {
            if (event.target === winModal) {
                hideWinModal();
            }
            if (event.target === rulesModal) {
                hideRulesModal();
            }
        });

        window.onload = function() {
            newGame();
        };