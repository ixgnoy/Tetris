const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Grid configuration
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

// Colors for different shapes
const colors = ["red", "green", "blue", "yellow", "purple", "cyan", "orange"];

// Shapes definition
const shapes = [
    // S shape
    [
        ['.....', '.....', '..00.', '.00..', '.....'],
        ['.....', '..0..', '..00.', '...0.', '.....']
    ],
    // Z shape
    [
        ['.....', '.....', '.00..', '..00.', '.....'],
        ['.....', '..0..', '.00..', '.0...', '.....']
    ],
    // I shape
    [
        ['..0..', '..0..', '..0..', '..0..', '.....'],
        ['.....', '0000.', '.....', '.....', '.....']
    ],
    // O shape
    [['.....', '.....', '.00..', '.00..', '.....']],
    // J shape
    [
        ['.....', '.0...', '.000.', '.....', '.....'],
        ['.....', '..00.', '..0..', '..0..', '.....']
    ]
];

// Game variables
let grid = createGrid();
let currentPiece = getRandomPiece();
let nextPiece = getRandomPiece();
let lastTime = 0;
let fallTime = 0;
const fallSpeed = 1000; // 1 second

// Create an empty grid
function createGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(''));
}

// Draw the grid on the canvas
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
        shape: shape[0],  // First rotation of the shape
        x: Math.floor(COLS / 2) - 2,  // Center the piece
        y: 0,  // Start at the top
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

// Lock the piece in place and add it to the grid
function lockPiece(piece) {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === '0') {
                grid[piece.y + y][piece.x + x] = piece.color;
            }
        });
    });
}

// Clear full rows
function clearRows() {
    for (let y = ROWS - 1; y >= 0; y--) {
        if (grid[y].every(cell => cell !== '')) {
            grid.splice(y, 1);  // Remove the row
            grid.unshift(Array(COLS).fill(''));  // Add an empty row at the top
        }
    }
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
            clearRows();
            currentPiece = nextPiece;
            nextPiece = getRandomPiece();

            if (!validMove(currentPiece, 0, 0)) {
                alert('Game Over');
                grid = createGrid();  // Reset the grid
            }
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
    drawGrid();
    drawPiece(currentPiece);

    requestAnimationFrame(gameLoop);
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

// Start the game loop
gameLoop();
