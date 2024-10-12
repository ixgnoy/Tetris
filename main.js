const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Global Variables
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
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
    ]
];

let grid = createGrid();
let currentPiece = getRandomPiece();
let nextPiece = getRandomPiece();

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
        color: 'red'
    };
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawPiece(currentPiece);
    requestAnimationFrame(gameLoop);
}

// Handle user input
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') currentPiece.x--;
    if (event.key === 'ArrowRight') currentPiece.x++;
    if (event.key === 'ArrowDown') currentPiece.y++;
});

// Start the game loop
gameLoop();
