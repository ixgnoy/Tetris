import { init, draw, update } from "pygame.js"; // Import Pygame.js functions

function main() {
    // Initialize Pygame.js
    let screen = init(800, 600, "gameCanvas");

    // Game loop function
    function gameLoop() {
        update(); // Update game state
        draw(screen); // Render the game onto the canvas
        requestAnimationFrame(gameLoop); // Loop the game
    }

    requestAnimationFrame(gameLoop); // Start the loop
}

main();  // Run the main function
