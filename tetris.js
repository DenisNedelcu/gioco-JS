const canvas = document.getElementById("tetrisCanvas");
const context = canvas.getContext("2d");

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

const board = [];
for (let row = 0; row < ROWS; row++) {
    board[row] = [];
    for (let col = 0; col < COLS; col++) {
        board[row][col] = "";
    }
}

let score = 0;

function drawBlock(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] !== "") {
                drawBlock(col, row, board[row][col]);
            }
        }
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawPiece();
    drawScore();
    requestAnimationFrame(draw);
}

function drawScore() {
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText(`Score: ${score}`, 10, 30);
}

const PIECES = [
    [[1, 1, 1, 1]],
    [
        [1, 1, 1],
        [0, 1, 0],
    ],
    [
        [1, 1, 1],
        [1, 0, 0],
    ],
    [
        [1, 1, 1],
        [0, 0, 1],
    ],
    [
        [0, 1, 1],
        [1, 1, 0],
    ],
    [
        [1, 1],
        [1, 1],
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
    ],
];

const PIECE_COLORS = [
    "#00FFFF", 
    "#0000FF", 
    "#FFA500", 
    "#FFFF00", 
    "#008000", 
    "#800080", 
    "#FF0000", 
];

let currentPiece = randomPiece();
let pieceColor = PIECE_COLORS[Math.floor(Math.random() * PIECE_COLORS.length)];
let pieceRow = 0;
let pieceCol = Math.floor(COLS / 2) - Math.floor(currentPiece[0].length / 2);

let intervalId;
let gameSpeed = 500;

function randomPiece() {
    const randomIndex = Math.floor(Math.random() * PIECES.length);
    return PIECES[randomIndex];
}

function drawPiece() {
    for (let row = 0; row < currentPiece.length; row++) {
        for (let col = 0; col < currentPiece[row].length; col++) {
            if (currentPiece[row][col] === 1) {
                drawBlock(pieceCol + col, pieceRow + row, pieceColor);
            }
        }
    }
}

function movePieceRight() {
    if (canMoveRight()) {
        pieceCol++;
    }
}

function movePieceLeft() {
    if (canMoveLeft()) {
        pieceCol--;
    }
}

function movePieceDown() {
    if (canMoveDown()) {
        pieceRow++;
    } else {
        mergePiece();
        currentPiece = randomPiece();
        pieceColor = PIECE_COLORS[Math.floor(Math.random() * PIECE_COLORS.length)]; 
        pieceRow = 0;
        pieceCol = Math.floor(COLS / 2) - Math.floor(currentPiece[0].length / 2);
    }
}

function canMoveRight() {
    for (let row = 0; row < currentPiece.length; row++) {
        for (let col = 0; col < currentPiece[row].length; col++) {
            if (currentPiece[row][col] === 1) {
                const nextCol = pieceCol + col + 1;
                if (nextCol >= COLS || board[pieceRow + row][nextCol] !== "") {
                    return false;
                }
            }
        }
    }
    return true;
}

function canMoveLeft() {
    for (let row = 0; row < currentPiece.length; row++) {
        for (let col = 0; col < currentPiece[row].length; col++) {
            if (currentPiece[row][col] === 1) {
                const nextCol = pieceCol + col - 1;
                if (nextCol < 0 || board[pieceRow + row][nextCol] !== "") {
                    return false;
                }
            }
        }
    }
    return true;
}

function canMoveDown() {
    for (let row = 0; row < currentPiece.length; row++) {
        for (let col = 0; col < currentPiece[row].length; col++) {
            if (currentPiece[row][col] === 1) {
                const nextRow = pieceRow + row + 1;
                if (nextRow >= ROWS || board[nextRow][pieceCol + col] !== "") {
                    return false;
                }
            }
        }
    }
    return true;
}

function mergePiece() {
    for (let row = 0; row < currentPiece.length; row++) {
        for (let col = 0; col < currentPiece[row].length; col++) {
            if (currentPiece[row][col] === 1) {
                board[pieceRow + row][pieceCol + col] = pieceColor;
            }
        }
    }
    removeCompletedRows();
    checkGameOver();
}

function removeCompletedRows() {
    let rowsCleared = 0;
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every((cell) => cell !== "")) {
            board.splice(row, 1);
            board.unshift(Array.from({ length: COLS }, () => ""));
            rowsCleared++;
        }
    }
    score += rowsCleared * 100;
}

function checkGameOver() {
    if (!canMoveDown() && pieceRow === 0) {
        stopGame();
        alert("Game Over!");
    }
}

function rotatePiece() {
    const rotatedPiece = [];
    for (let col = 0; col < currentPiece[0].length; col++) {
        const newRow = currentPiece.map((row) => row[col]).reverse();
        rotatedPiece.push(newRow);
    }
    currentPiece = rotatedPiece;
}

document.addEventListener("keydown", function (event) {
    if (event.code === "ArrowRight") {
        movePieceRight();
    } else if (event.code === "ArrowLeft") {
        movePieceLeft();
    } else if (event.code === "ArrowDown") {
        movePieceDown();
    } else if (event.code === "ArrowUp") {
        rotatePiece();
    }
});

function startGame() {
    intervalId = setInterval(() => {
        movePieceDown();
    }, gameSpeed);
}

function stopGame() {
    clearInterval(intervalId);
}

startGame();
draw();
