const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const nextCanvas = document.getElementById("nextPieceCanvas");
const nextCtx = nextCanvas.getContext("2d");

// Grid configuration
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const colors = ["red", "green", "blue", "yellow", "purple", "cyan", "orange"];

// Define shapes
const shapes = [
    [
        ['.....', '.....', '..00.', '.00..', '.....'],
        ['.....', '..0..', '..00.', '...0.', '.....']
    ],
    [
        ['.....', '.....', '.00..', '..00.', '.....'],
        ['.....', '..0..', '.00..', '.0...', '.....']
    ],
    [
        ['..0..', '..0..', '..0..', '..0..', '.....'],
        ['.....', '0000.', '.....', '.....', '.....']
    ],
    [['.....', '.....', '.00..', '.00..', '.....']],
    [
        ['.....', '.0...', '.000.', '.....', '.....'],
        ['.....', '..00.', '..0..', '..0..', '.....']
    ]
];

let grid = createGrid();
let currentPiece = getRandomPiece();
let nextPiece = getRandomPiece();
let score = 0;
let level = 1;
let fallSpeed = 1000;  // Initial fall speed
let lastTime = 0;
let fallTime = 0;

// Create an empty grid
function createGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(''));
}

// Draw the grid
function drawGrid() {
    ctx.strokeStyle = 'gray';
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
}

// Draw a piece on the canvas
function drawPiece(piece, context) {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === '0') {
                context.fillStyle = piece.color;
                context.fillRect(
                    (piece.x + x) * BLOCK_SIZE,
                    (piece.y + y) * BLOCK_SIZE,
                    BLOCK_SIZE,
                    BLOCK_SIZE
                );
                context.strokeStyle = 'black';
                context.strokeRect(
                    (piece.x + x) * BLOCK_SIZE,
                    (piece.y + y) * BLOCK_SIZE,
                    BLOCK_SIZE,
                    BLOCK_SIZE
                );
            }
        });
    });
}

// Get a random piece
function getRandomPiece() {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    return {
        shape: shape[0],
        x: Math.floor(COLS / 2) - 2,
        y: 0,
        color: colors[Math.floor(Math.random() * colors.length)]
    };
}

// Check if the piece can move
function validMove(piece, dx, dy) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x] === '0') {
                let newX = piece.x + x + dx;
                let newY = piece.y + y + dy;

                if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && grid[newY][newX] !== '')) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Lock the piece into the grid
function lockPiece(piece) {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === '0') {
                grid[piece.y + y][piece.x + x] = piece.color;
            }
        });
    });
    clearRows();
}

// Clear full rows
function clearRows() {
    for (let y = ROWS - 1; y >= 0; y--) {
        if (grid[y].every(cell => cell !== '')) {
            grid.splice(y, 1);
            grid.unshift(Array(COLS).fill(''));
            updateScore(100);
        }
    }
}

// Update the score and level
function updateScore(points) {
    score += points;
    document.getElementById('score').innerText = `Score: ${score}`;
    updateLevel();
}

// Update the level and adjust fall speed
function updateLevel() {
    level = Math.floor(score / 500) + 1;
    fallSpeed = Math.max(100, 1000 - (level * 100));
}

// Game loop
function gameLoop(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    fallTime += deltaTime;

    if (fallTime >= fallSpeed) {
        fallTime = 0;
        if (validMove(currentPiece, 0, 1)) {
            currentPiece.y++;
        } else {
            lockPiece(currentPiece);
            currentPiece = nextPiece;
            nextPiece = getRandomPiece();
            if (!validMove(currentPiece, 0, 0)) {
                gameOver();
                return;
            }
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawPiece(currentPiece, ctx);
    drawNextPiece();
    requestAnimationFrame(gameLoop);
}

// Draw the next piece
function drawNextPiece() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    drawPiece(nextPiece, nextCtx);
}

// Handle user input
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && validMove(currentPiece, -1, 0)) {
        currentPiece.x--;
    }
    if (event.key === 'ArrowRight' && validMove(currentPiece, 1, 0)) {
        currentPiece.x++;
    }
    if (event.key === 'ArrowDown') {
        if (validMove(currentPiece, 0, 1)) currentPiece.y++;
    }
    if (event.key === 'ArrowUp') {
        currentPiece.shape = rotatePiece(currentPiece.shape);
    }
});

// Rotate the piece
function rotatePiece(shape) {
    return shape[0].map((_, index) =>
        shape.map(row => row[index]).reverse()
    );
}

// Game over function
function gameOver() {
    document.getElementById('gameOver').style.display = 'block';
}

// Start the game loop
gameLoop();
