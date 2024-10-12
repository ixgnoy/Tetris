const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

const COLORS = ["green", "red", "cyan", "yellow", "orange", "blue", "purple"];

// Define the shapes and their rotations
const SHAPES = {
    S: [
        [['.', '.', '0', '0', '.'],
         ['.', '0', '0', '.', '.']],
        [['.', '0', '.', '.'],
         ['.', '0', '0', '.'],
         ['.', '.', '0', '.']]
    ],
    Z: [
        [['0', '0', '.', '.'],
         ['.', '0', '0', '.']],
        [['.', '0', '.', '.'],
         ['0', '0', '.', '.'],
         ['0', '.', '.', '.']]
    ],
    T: [
        [['.', '0', '.', '.'],
         ['0', '0', '0', '.']],
        [['0', '.', '.'],
         ['0', '0', '.'],
         ['0', '.', '.']],
        [['0', '0', '0'],
         ['.', '0', '.']],
        [['.', '0', '.'],
         ['0', '0', '.'],
         ['.', '0', '.']]
    ],
};

// Helper functions
function createGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Class for Tetris pieces
class Piece {
    constructor(shape, color) {
        this.shape = shape;
        this.color = color;
        this.x = Math.floor(COLS / 2) - 1;
        this.y = 0;
        this.rotation = 0;
    }

    draw() {
        this.shape[this.rotation].forEach((row, i) => {
            row.forEach((block, j) => {
                if (block === '0') {
                    drawBlock(this.x + j, this.y + i, this.color);
                }
            });
        });
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    rotate() {
        this.rotation = (this.rotation + 1) % this.shape.length;
    }
}

let grid = createGrid();
let currentPiece = new Piece(SHAPES.S, COLORS[0]);

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    currentPiece.draw();
    requestAnimationFrame(gameLoop);
}

// Draw the game grid
function drawGrid() {
    ctx.strokeStyle = 'gray';
    for (let i = 0; i <= ROWS; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * BLOCK_SIZE);
        ctx.lineTo(COLS * BLOCK_SIZE, i * BLOCK_SIZE);
        ctx.stroke();
    }
    for (let j = 0; j <= COLS; j++) {
        ctx.beginPath();
        ctx.moveTo(j * BLOCK_SIZE, 0);
        ctx.lineTo(j * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        ctx.stroke();
    }
}

// Event listener for user input
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        currentPiece.move(-1, 0);
    } else if (event.key === 'ArrowRight') {
        currentPiece.move(1, 0);
    } else if (event.key === 'ArrowDown') {
        currentPiece.move(0, 1);
    } else if (event.key === 'ArrowUp') {
        currentPiece.rotate();
    }
});

// Start the game loop
gameLoop();
