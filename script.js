const board = document.getElementById("game-board");
const playerXWins = document.getElementById("playerXWins");
const playerOWins = document.getElementById("playerOWins");
const restartGame = document.getElementById("restartGame");
const resetScores = document.getElementById("resetScores");
const humanVsHuman = document.getElementById("humanVsHuman");
const humanVsComputer = document.getElementById("humanVsComputer");

let gameMode = "human";
let currentPlayer = "X";
let boardState = Array(9).fill(null);
let scores = { X: 0, O: 0 };
let isGameActive = true;
let statusMessage = document.createElement("div");
statusMessage.id = "statusMessage";
board.parentElement.insertBefore(statusMessage, board);

function updateStatusMessage(message) {
    statusMessage.textContent = message;
}

// Initialize the board
function initBoard() {
    board.innerHTML = "";
    boardState = Array(9).fill(null);
    isGameActive = true;
    currentPlayer = "X";
    updateStatusMessage(`Player X's Turn`);
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", handleCellClick);
        board.appendChild(cell);
    }
}

// Check for a winner
function checkWinner() {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a];
        }
    }

    if (boardState.every(cell => cell)) {
        return "Draw";
    }

    return null;
}

// Handle cell clicks
function handleCellClick(event) {
    const index = event.target.dataset.index;

    if (!isGameActive || boardState[index]) return;

    boardState[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add("taken");

    const winner = checkWinner();

    if (winner) {
        isGameActive = false;
        if (winner !== "Draw") {
            scores[winner]++;
            updateScores();
            updateStatusMessage(`Player ${winner} Wins!`);
        } else {
            updateStatusMessage(`It's a Draw!`);
        }
        return;
    }

    if (gameMode === "human") {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateStatusMessage(`Player ${currentPlayer}'s Turn`);
    } else if (gameMode === "computer") {
        if (currentPlayer === "X") {
            currentPlayer = "O";
            updateStatusMessage(`Computer's Turn`);
            setTimeout(computerMove, 500); // Delay for computer move
        }
    }
}

// Computer move logic
function computerMove() {
    let availableMoves = boardState.map((cell, index) => (cell === null ? index : null)).filter(index => index !== null);
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    boardState[randomMove] = currentPlayer;
    const cell = board.querySelector(`[data-index="${randomMove}"]`);
    cell.textContent = currentPlayer;
    cell.classList.add("taken");

    const winner = checkWinner();
    if (winner) {
        isGameActive = false;
        if (winner !== "Draw") {
            scores[winner]++;
            updateScores();
            updateStatusMessage(`Player ${winner} Wins!`);
        } else {
            updateStatusMessage(`It's a Draw!`);
        }
        return;
    }

    currentPlayer = "X";
    updateStatusMessage(`Player X's Turn`);
}

// Update the score display
function updateScores() {
    playerXWins.textContent = scores.X;
    playerOWins.textContent = scores.O;
}

// Restart the game
restartGame.addEventListener("click", initBoard);

// Reset scores
resetScores.addEventListener("click", () => {
    scores = { X: 0, O: 0 };
    updateScores();
    initBoard();
    updateStatusMessage(`Scores Reset. Player X's Turn`);
});

// Change game mode
humanVsHuman.addEventListener("click", () => {
    gameMode = "human";
    initBoard();
    updateStatusMessage(`Human vs Human Mode. Player X's Turn`);
});

humanVsComputer.addEventListener("click", () => {
    gameMode = "computer";
    initBoard();
    updateStatusMessage(`Human vs Computer Mode. Player X's Turn`);
});

// Initialize the game on load
initBoard();
