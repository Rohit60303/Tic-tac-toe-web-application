// Game variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameMode = 'player'; // 'player' or 'computer'
let gameActive = true;
let scores = { X: 0, O: 0, draw: 0 };

// Winning combinations
let winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
];

// Set game mode function
function setGameMode(mode) {
    gameMode = mode;
    
    // Update button styles
    document.getElementById('playerBtn').classList.remove('active');
    document.getElementById('computerBtn').classList.remove('active');
    
    if (mode === 'player') {
        document.getElementById('playerBtn').classList.add('active');
    } else {
        document.getElementById('computerBtn').classList.add('active');
    }
    
    resetGame();
}

// Handle cell clicks
function makeMove(index) {
    // Check if cell is empty and game is active
    if (board[index] === '' && gameActive) {
        // Make the move
        board[index] = currentPlayer;
        updateBoard();
        
        // Check for win or draw
        if (checkWinner()) {
            document.getElementById('status').innerHTML = 'Player ' + currentPlayer + ' Wins!';
            scores[currentPlayer]++;
            updateScores();
            gameActive = false;
            highlightWinner();
        } else if (checkDraw()) {
            document.getElementById('status').innerHTML = "It's a Draw!";
            scores.draw++;
            updateScores();
            gameActive = false;
        } else {
            // Switch player
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            
            if (gameMode === 'computer' && currentPlayer === 'O') {
                document.getElementById('status').innerHTML = "Computer's Turn";
                setTimeout(computerMove, 1000);
            } else {
                document.getElementById('status').innerHTML = 'Player ' + currentPlayer + "'s Turn";
            }
        }
    }
}

// Computer move function
function computerMove() {
    if (!gameActive) return;
    
    // Simple AI: try to win, then block, then random
    let move = findWinningMove('O');
    if (move === -1) {
        move = findWinningMove('X'); // block player
    }
    if (move === -1) {
        move = getRandomMove();
    }
    
    if (move !== -1) {
        makeMove(move);
    }
}

// Find winning move for a player
function findWinningMove(player) {
    for (let i = 0; i < winningCombinations.length; i++) {
        let combo = winningCombinations[i];
        let positions = [board[combo[0]], board[combo[1]], board[combo[2]]];
        
        // Count player's marks and empty spaces
        let playerCount = 0;
        let emptyIndex = -1;
        
        for (let j = 0; j < 3; j++) {
            if (positions[j] === player) {
                playerCount++;
            } else if (positions[j] === '') {
                emptyIndex = combo[j];
            }
        }
        
        // If player has 2 marks and 1 empty space, return empty space
        if (playerCount === 2 && emptyIndex !== -1) {
            return emptyIndex;
        }
    }
    return -1;
}

// Get random available move
function getRandomMove() {
    let availableMoves = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            availableMoves.push(i);
        }
    }
    
    if (availableMoves.length > 0) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    return -1;
}

// Update the visual board
function updateBoard() {
    let cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = board[i];
    }
}

// Check for winner
function checkWinner() {
    for (let i = 0; i < winningCombinations.length; i++) {
        let combo = winningCombinations[i];
        if (board[combo[0]] !== '' && 
            board[combo[0]] === board[combo[1]] && 
            board[combo[1]] === board[combo[2]]) {
            return true;
        }
    }
    return false;
}

// Highlight winning combination
function highlightWinner() {
    let cells = document.querySelectorAll('.cell');
    for (let i = 0; i < winningCombinations.length; i++) {
        let combo = winningCombinations[i];
        if (board[combo[0]] !== '' && 
            board[combo[0]] === board[combo[1]] && 
            board[combo[1]] === board[combo[2]]) {
            
            cells[combo[0]].classList.add('winner');
            cells[combo[1]].classList.add('winner');
            cells[combo[2]].classList.add('winner');
            break;
        }
    }
}

// Check for draw
function checkDraw() {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            return false;
        }
    }
    return true;
}

// Update scores display
function updateScores() {
    document.getElementById('scoreX').innerHTML = scores.X;
    document.getElementById('scoreO').innerHTML = scores.O;
    document.getElementById('scoreDraw').innerHTML = scores.draw;
}

// Reset the game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    
    // Clear the board
    let cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = '';
        cells[i].classList.remove('winner');
    }
    
    document.getElementById('status').innerHTML = "Player X's Turn";
}