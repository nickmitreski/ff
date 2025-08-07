import { AABB } from './utils.js';
import { Collectible } from './collectible.js';
import { Enemy } from './enemy.js'; // Ensure Enemy class is imported
import { BouncerEnemy } from './bouncer_enemy.js'; // Import BouncerEnemy
import { MetalEnemy } from './metal_enemy.js'; // Import MetalEnemy

export class Terrain {
    constructor(tileSize, canvasWidth, canvasHeight, assetManager, soundManager, onNewCollectibleCallback, onNewEnemyCallback) {
        this.tileSize = tileSize;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.assetManager = assetManager;
        this.soundManager = soundManager; // Added soundManager
        this.onNewCollectibleCallback = onNewCollectibleCallback;
        this.onNewEnemyCallback = onNewEnemyCallback; // Callback to add new enemies to game

        this.rows = Math.floor(this.canvasHeight / this.tileSize);
        this.map = []; // 2D array representing the terrain grid
        this.currentMaxCol = 0; // Tracks the highest column index generated so far

        // Tile types: 0 = air, 1 = solid ground, 2 = breakable rock

        this.FLOATING_GOLD_CHANCE = 0.03; // Chance for gold to appear floating in air tiles
        this.BANANDIUM_GEM_CHANCE = 0.003; // Chance for Banandium Gem to appear (much rarer)
        this.FLOATING_BLOCK_CHANCE = 0.15; // Increased chance for floating blocks to appear
        this.WALKER_ENEMY_SPAWN_CHANCE = 0.08; // Chance for a walking enemy to spawn on a suitable tile
        this.BOUNCER_ENEMY_SPAWN_CHANCE = 0.03; // Chance for a bouncing enemy to spawn, slightly less than walkers
        this.METAL_ENEMY_SPAWN_CHANCE = 0.02; // New: Chance for a metal enemy to spawn
    }

    initializeMap() {
        // Generate an initial section of the map, e.g., 2 screens wide
        const initialCols = Math.floor(this.canvasWidth / this.tileSize) * 2;
        this.generateNewSection(initialCols, true); // Pass true to prevent enemy/collectible spawn in initial section

        // Add some specific initial platforms and breakable sections
        // Platform 1
        for (let c = 3; c < 8; c++) {
            this.map[this.rows - 5][c] = 1;
        }
        this.map[this.rows - 5][4] = 2; // breakable

        // Platform 2
        for (let c = 10; c < 15; c++) {
            this.map[this.rows - 8][c] = 1;
        }
        this.map[this.rows - 8][11] = 2; // breakable
        this.map[this.rows - 8][13] = 2; // breakable

        // Vertical pillar of breakable blocks
        for (let r = this.rows - 7; r > this.rows - 11; r--) {
            this.map[r][20] = 2;
        }
        this.map[this.rows - 11][20] = 1; // Top of pillar

        // Small floating platform
        this.map[this.rows - 10][5] = 1;
        this.map[this.rows - 10][6] = 2;

        console.log("Initial terrain map generated up to column:", this.currentMaxCol);
    }

    generateNewSection(numColsToAdd, isInitialSection = false) {
        const startCol = this.currentMaxCol;
        const endCol = this.currentMaxCol + numColsToAdd;

        for (let r = 0; r < this.rows; r++) {
            // Ensure the row array exists for new columns
            if (!this.map[r]) {
                this.map[r] = [];
            }
            for (let c = startCol; c < endCol; c++) {
                // Generate some basic ground
                if (r >= this.rows - 2) { // Bottom two rows are always solid ground
                    this.map[r][c] = 1;
                }
                // Add some randomness for platforms and breakables
                else if (r > this.rows - 10 && Math.random() < this.FLOATING_BLOCK_CHANCE && c > startCol + 2) { // Chance for floating blocks
                    // Add a small platform or a single block
                    const blockType = (Math.random() < 0.7) ? 2 : 1; // More likely to be breakable
                    this.map[r][c] = blockType;
                    // Optionally, make it a small platform
                    if (Math.random() < 0.3 && c + 1 < endCol) {
                        this.map[r][c + 1] = blockType;
                    }
                    if (Math.random() < 0.1 && c + 2 < endCol) {
                        this.map[r][c + 2] = blockType;
                    }
                }
                else {
                    this.map[r][c] = 0; // Default to air
                }
            }
        }
        this.currentMaxCol = endCol;
        console.log(`Generated new terrain section. Current max column: ${this.currentMaxCol}`);

        // If this is the initial section, do not spawn enemies or collectibles randomly.
        // They are placed manually in initializeMap for the first section, and we want to avoid enemies near player start.
        if (isInitialSection) return;

        // Iterate through the *newly generated* columns to place floating collectibles and enemies
        for (let c = startCol; c < endCol; c++) {
            for (let r = 0; r < this.rows; r++) {
                // Place floating gold only if the tile is air, not on the very bottom rows,
                // and not too close to the left edge of the newly generated section to avoid immediate spawn.
                if (this.map[r][c] === 0 && r < this.rows - 3 && c > startCol + 5 && Math.random() < this.FLOATING_GOLD_CHANCE) {
                    const worldX = c * this.tileSize;
                    const worldY = r * this.tileSize;
                    this.onNewCollectibleCallback(worldX, worldY, 'gold');
                }
                // Place floating Banandium Gems only if the tile is air, higher up (r < this.rows - 8 for "difficult to reach"),
                // and not too close to the left edge, with a much lower chance.
                else if (this.map[r][c] === 0 && r < this.rows - 8 && c > startCol + 5 && Math.random() < this.BANANDIUM_GEM_CHANCE) {
                    const worldX = c * this.tileSize;
                    const worldY = r * this.tileSize;
                    this.onNewCollectibleCallback(worldX, worldY, 'banandium_gem');
                }

                // Spawn enemies: Check if the current tile is ground and the tile above is air
                // Don't spawn too close to the player's current position (c > startCol + 10)
                if (this.onNewEnemyCallback && c > startCol + 10) {
                    // Check for Walker Enemy spawn condition
                    if (Math.random() < this.WALKER_ENEMY_SPAWN_CHANCE) {
                        // Needs ground, and 2 air tiles above it (for a 1-tile tall enemy + some buffer for jump clearance)
                        if ((this.map[r]?.[c] === 1 || this.map[r]?.[c] === 2) && 
                            this.map[r - 1]?.[c] === 0 && this.map[r - 2]?.[c] === 0) {
                            const enemyX = c * this.tileSize;
                            const enemyY = (r - 1) * this.tileSize; // Place enemy one tile above the ground tile
                            this.onNewEnemyCallback(enemyX, enemyY, 'walker');
                        }
                    }

                    // Check for Bouncer Enemy spawn condition
                    if (Math.random() < this.BOUNCER_ENEMY_SPAWN_CHANCE) {
                        // Needs air block to start bouncing, prefer open space (e.g., at least 3-4 tiles of air vertically)
                        // And either ground beneath, or a sufficiently high air pocket
                        if (this.map[r]?.[c] === 0 && this.map[r + 1]?.[c] === 0 && // current and below are air
                            this.map[r - 1]?.[c] === 0 && this.map[r - 2]?.[c] === 0 && // above are air
                            (this.map[r + 2]?.[c] === 1 || this.map[r + 2]?.[c] === 2 || // 2 tiles below is ground
                             this.map[r + 3]?.[c] === 1 || this.map[r + 3]?.[c] === 2)) // 3 tiles below is ground
                        {
                            const enemyX = c * this.tileSize;
                            const enemyY = r * this.tileSize; // Place bouncer in an air tile
                            this.onNewEnemyCallback(enemyX, enemyY, 'bouncer');
                        }
                    }

                    // Check for Metal Enemy spawn condition
                    if (Math.random() < this.METAL_ENEMY_SPAWN_CHANCE) {
                        // Similar to walker, needs ground and space above
                        if ((this.map[r]?.[c] === 1 || this.map[r]?.[c] === 2) && 
                            this.map[r - 1]?.[c] === 0 && this.map[r - 2]?.[c] === 0) {
                            const enemyX = c * this.tileSize;
                            const enemyY = (r - 1) * this.tileSize; // Place enemy one tile above the ground tile
                            this.onNewEnemyCallback(enemyX, enemyY, 'metal');
                        }
                    }
                }
            }
        }
    }

    getTile(worldX, worldY) {
        const gridX = Math.floor(worldX / this.tileSize);
        const gridY = Math.floor(worldY / this.tileSize);

        if (gridY >= 0 && gridY < this.rows && gridX >= 0 && gridX < this.currentMaxCol) {
            return this.map[gridY]?.[gridX]; // Added optional chaining for safety
        }
        return 0; // Return air if outside bounds of generated map or above/below
    }

    removeBlock(gridX, gridY) {
        if (gridX >= 0 && gridX < this.currentMaxCol && gridY >= 0 && gridY < this.rows && this.map[gridY]) { // Check if row exists
            this.map[gridY][gridX] = 0; // Set to air
            console.log(`Block removed at grid: (${gridX}, ${gridY})`);
        }
    }

    draw(ctx, cameraX) {
        const groundImage = this.assetManager.getImage('mine_ground');
        const breakableImage = this.assetManager.getImage('mine_breakable');

        // Calculate the range of columns visible on screen based on camera position
        const startCol = Math.max(0, Math.floor(cameraX / this.tileSize));
        const endCol = Math.min(this.currentMaxCol, Math.ceil((cameraX + this.canvasWidth) / this.tileSize));

        for (let r = 0; r < this.rows; r++) {
            for (let c = startCol; c < endCol; c++) {
                // Ensure tile data exists for this column (important for sparse or dynamically growing maps)
                if (this.map[r] && this.map[r][c] !== undefined) {
                    const tileType = this.map[r][c];
                    const x = c * this.tileSize;
                    const y = r * this.tileSize;

                    if (tileType === 1 && groundImage) {
                        ctx.drawImage(groundImage, x, y, this.tileSize, this.tileSize);
                    } else if (tileType === 2 && breakableImage) {
                        ctx.drawImage(breakableImage, x, y, this.tileSize, this.tileSize);
                    }
                }
            }
        }
    }
}