let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameMode = 'player';
let gameActive = true;
let scores = { X: 0, O: 0, draw: 0 };

let winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function setGameMode(mode) {
    gameMode = mode;
    document.getElementById('playerBtn').classList.remove('active');
    document.getElementById('computerBtn').classList.remove('active');
    if (mode === 'player') {
        document.getElementById('playerBtn').classList.add('active');
    } else {
        document.getElementById('computerBtn').classList.add('active');
    }
    resetGame();
}

function makeMove(index) {
    if (board[index] === '' && gameActive) {
        board[index] = currentPlayer;
        updateBoard();
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

function computerMove() {
    if (!gameActive) return;
    let move = findWinningMove('O');
    if (move === -1) {
        move = findWinningMove('X');
    }
    if (move === -1) {
        move = getRandomMove();
    }
    if (move !== -1) {
        makeMove(move);
    }
}

function findWinningMove(player) {
    for (let i = 0; i < winningCombinations.length; i++) {
        let combo = winningCombinations[i];
        let positions = [board[combo[0]], board[combo[1]], board[combo[2]]];
        let playerCount = 0;
        let emptyIndex = -1;
        for (let j = 0; j < 3; j++) {
            if (positions[j] === player) {
                playerCount++;
            } else if (positions[j] === '') {
                emptyIndex = combo[j];
            }
        }
        if (playerCount === 2 && emptyIndex !== -1) {
            return emptyIndex;
        }
    }
    return -1;
}

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

function updateBoard() {
    let cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = board[i];
    }
}

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

function checkDraw() {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            return false;
        }
    }
    return true;
}

function updateScores() {
    document.getElementById('scoreX').innerHTML = scores.X;
    document.getElementById('scoreO').innerHTML = scores.O;
    document.getElementById('scoreDraw').innerHTML = scores.draw;
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    let cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = '';
        cells[i].classList.remove('winner');
    }
    document.getElementById('status').innerHTML = "Player X's Turn";
}
