const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Global Variables
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const colors = ["red", "green", "blue", "yellow", "purple", "cyan", "orange"];

const shapes = [
    // S Shape
    [
        ['.....', '.....', '..00.', '.00..', '.....'],
        ['.....', '..0..', '..00.', '...0.', '.....']
    ],
    // Z Shape
    [
        ['.....', '.....', '.00..', '..00.', '.....'],
        ['.....', '..0..', '.00..', '.0...', '.....']
    ],
    // I Shape
    [
        ['..0..', '..0..', '..0..', '..0..', '.....'],
        ['.....', '0000.', '.....', '.....', '.....']
    ],
    // O Shape
    [['.....', '.....', '.00..', '.00..', '.....']],
    // J Shape
    [
        ['.....', '.0...', '.000.', '.....', '.....'],
        ['.....', '..00.', '..0..', '..0..', '.....']
    ]
];

let grid = createGrid();
let currentPiece = getRandomPiece();
let nextPiece = getRandomPiece();
let fallTime = 0;
let fallSpeed = 1000; // fall every second
let lastTime = 0;

// Create empty grid
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
function drawPiece(piece) {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === '0') {
                ctx.fillStyle = piece.color;
                ctx.fillRect(
                    (piece.x + x) * BLOCK_SIZE,
                    (piece.y + y) * BLOCK_SIZE,
                    BLOCK_SIZE,
                    BLOCK_SIZE
                );
                ctx.strokeStyle = 'black';
                ctx.strokeRect(
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
        shape: shape,
        x: Math.floor(COLS / 2) - 2,
        y: 0,
        color: colors[Math.floor(Math.random() * colors.length)]
    };
}

// Check if the piece is within the grid and not overlapping locked positions
function validMove(piece, grid, dx, dy) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x] !== '0') continue;

            let newX = piece.x + x + dx;
            let newY = piece.y + y + dy;

            if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && grid[newY][newX] !== '')) {
                return false;
            }
        }
    }
    return true;
}

// Lock the piece into the grid when it touches the bottom
function lockPiece(piece, grid) {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === '0') {
                grid[piece.y + y][piece.x + x] = piece.color;
            }
        });
    });
}

// Clear filled rows
function clearRows() {
    for (let y = ROWS - 1; y >= 0; y--) {
        if (grid[y].every(cell => cell !== '')) {
            grid.splice(y, 1);
            grid.unshift(Array(COLS).fill(''));
        }
    }
}

// Game loop
function gameLoop(time = 0) {
    let deltaTime = time - lastTime;
    lastTime = time;

    fallTime += deltaTime;
    if (fallTime >= fallSpeed) {
        fallTime = 0;
        movePieceDown();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawPiece(currentPiece);
    drawPiece(nextPiece); // Draw next piece if needed

    requestAnimationFrame(gameLoop);
}

// Move the piece down
function movePieceDown() {
    if (validMove(currentPiece, grid, 0, 1)) {
        currentPiece.y++;
    } else {
        lockPiece(currentPiece, grid);
        clearRows();
        currentPiece = nextPiece;
        nextPiece = getRandomPiece();

        // Check if game is over (piece reached the top)
        if (!validMove(currentPiece, grid, 0, 0)) {
            alert("Game Over");
            grid = createGrid(); // Reset grid
        }
    }
}

// Handle user input
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && validMove(currentPiece, grid, -1, 0)) {
        currentPiece.x--;
    }
    if (event.key === 'ArrowRight' && validMove(currentPiece, grid, 1, 0)) {
        currentPiece.x++;
    }
    if (event.key === 'ArrowDown') {
        movePieceDown();
    }
});

// Start the game loop
gameLoop();
