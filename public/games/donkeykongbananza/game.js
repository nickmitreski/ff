import { Player } from './player.js';
import { Terrain } from './terrain.js';
import { Chunk } from './chunk.js';
import { Collectible } from './collectible.js';
import { Enemy } from './enemy.js'; // Import Enemy
import { BouncerEnemy } from './bouncer_enemy.js'; // Import BouncerEnemy
import { MetalEnemy } from './metal_enemy.js'; // New: Import MetalEnemy
import { AssetManager } from './assets.js';
import { InputHandler } from './controls.js';
import { SoundManager } from './soundManager.js';
import { AABB } from './utils.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.TILE_SIZE = 32; // Size of a single tile in pixels
        this.canvas.width = 25 * this.TILE_SIZE; // 800px
        this.canvas.height = 15 * this.TILE_SIZE; // 480px

        this.assetManager = new AssetManager();
        this.soundManager = new SoundManager();

        this.player = null;
        this.terrain = null;
        this.chunks = []; // Array of active chunks (thrown or on ground)
        this.collectibles = []; // Array of active collectibles
        this.enemies = []; // Array of active enemies (can contain both Enemy and BouncerEnemy)

        this.goldScore = 0; // Player score for gold
        this.banandiumScore = 0; // Player score for Banandium Gems
        this.enemiesDefeated = 0; // New: Counter for defeated enemies
        this.blocksDestroyed = 0; // New: Counter for destroyed blocks

        this.goldScoreDisplay = document.getElementById('gold-score');
        this.banandiumScoreDisplay = document.getElementById('banandium-score');
        this.healthContainer = document.getElementById('health-container'); // New: Health container

        this.input = new InputHandler();
        this.gravity = 0.5; // pixels/frame^2

        this.lastTime = 0;
        this.deltaTime = 0; // Time in seconds
        this.gameStarted = false;
        this.gameOverFlag = false; // New: Flag to indicate game over

        this.cameraX = 0; // Camera's horizontal position (world units)

        this.GOLD_DROP_CHANCE = 0.4; // Increased chance for gold to drop from a broken block
    }

    // New method to preload assets without starting the game loop
    async preloadAssets() {
        console.log("Preloading assets...");

        // Queue images
        this.assetManager.queueImage('dk_idle', 'dk_idle.png');
        this.assetManager.queueImage('dk_run1', 'dk_run1.png');
        this.assetManager.queueImage('dk_run2', 'dk_run2.png');
        this.assetManager.queueImage('dk_jump', 'dk_jump.png');
        this.assetManager.queueImage('dk_punch', 'dk_punch.png');
        this.assetManager.queueImage('dk_hold', 'dk_hold.png');
        this.assetManager.queueImage('dk_throw', 'dk_throw.png');
        this.assetManager.queueImage('mine_ground', 'mine_ground.png');
        this.assetManager.queueImage('mine_breakable', 'mine_breakable.png');
        this.assetManager.queueImage('chunk', 'chunk.png');
        this.assetManager.queueImage('gold', 'gold.png');
        this.assetManager.queueImage('banandium_gem', 'banandium_gem.png');
        this.assetManager.queueImage('bg_mine', 'bg_mine.png');
        this.assetManager.queueImage('favicon', 'favicon.png');
        this.assetManager.queueImage('game_logo', 'bananzawebsimed.png'); // Add game logo
        this.assetManager.queueImage('enemy_walk1', 'enemy_walk1.png'); // New enemy assets
        this.assetManager.queueImage('enemy_walk2', 'enemy_walk2.png'); // New enemy assets
        this.assetManager.queueImage('bouncer_enemy', 'bouncer_enemy.png'); // New bouncing enemy asset
        this.assetManager.queueImage('metal_enemy_walk1', 'metal_enemy_walk1.png'); // New metal enemy assets
        this.assetManager.queueImage('metal_enemy_walk2', 'metal_enemy_walk2.png'); // New metal enemy assets
        this.assetManager.queueImage('heart_full', 'heart_full.png'); // New health assets
        this.assetManager.queueImage('heart_empty', 'heart_empty.png'); // New health assets

        // Load sounds
        await this.soundManager.loadSound('punch', 'punch.mp3');
        await this.soundManager.loadSound('break', 'break.mp3');
        await this.soundManager.loadSound('pickup', 'pickup.mp3');
        await this.soundManager.loadSound('throw', 'throw.mp3');
        await this.soundManager.loadSound('jump', 'jump.mp3');
        await this.soundManager.loadSound('oh_banana', 'oh_banana.mp3');
        await this.soundManager.loadSound('gold_pickup', 'gold_pickup.mp3');
        await this.soundManager.loadSound('enemy_defeat', 'enemy_defeat.mp3'); // New sound for enemy defeat
        await this.soundManager.loadSound('metal_hit', 'metal_hit.mp3'); // New sound for metal hit

        // assetManager.onDone callback is set in index.html, it will update the start screen once images are done.
    }

    // init now focuses on starting the game logic, assuming assets are preloaded
    init() {
        console.log("All assets loaded. Starting game.");
        // Reset all scores and counts for a new game
        this.goldScore = 0;
        this.banandiumScore = 0;
        this.enemiesDefeated = 0;
        this.blocksDestroyed = 0;
        this.enemies = []; // Clear enemy list from previous game

        this.player = new Player(
            this.TILE_SIZE * 2, // Initial X position
            this.canvas.height - (this.TILE_SIZE * 3), // Initial Y position
            this.TILE_SIZE, // Player width (approx)
            this.TILE_SIZE * 1.5, // Player height (approx)
            this.assetManager,
            this.input,
            this.soundManager,
            this.TILE_SIZE,
            this // Pass the Game instance to the Player
        );
        // Pass a callback to Terrain for creating new collectibles AND enemies
        this.terrain = new Terrain(
            this.TILE_SIZE,
            this.canvas.width,
            this.canvas.height,
            this.assetManager,
            this.soundManager, // Pass SoundManager for enemies
            (x, y, type) => { // Callback for collectibles
                this.collectibles.push(new Collectible(x, y, type, this.assetManager, this.TILE_SIZE));
            },
            (x, y, enemyType) => { // Callback for enemies, now with enemyType
                if (enemyType === 'walker') {
                    this.enemies.push(new Enemy(x, y, this.TILE_SIZE, this.TILE_SIZE, this.assetManager, this.terrain, this.soundManager, this.TILE_SIZE, this));
                } else if (enemyType === 'bouncer') {
                    this.enemies.push(new BouncerEnemy(x, y, this.TILE_SIZE, this.TILE_SIZE, this.assetManager, this.terrain, this.soundManager, this.TILE_SIZE, this));
                } else if (enemyType === 'metal') { // New: Metal Enemy
                    this.enemies.push(new MetalEnemy(x, y, this.TILE_SIZE, this.TILE_SIZE, this.assetManager, this.terrain, this.soundManager, this.TILE_SIZE, this));
                }
            }
        );
        this.terrain.initializeMap(); // Initialize the first part of the mine map

        this.updateScoreDisplay(); // Initial display of scores and health
        this.gameStarted = true;
        this.gameOverFlag = false; // Reset game over flag
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    gameLoop(timestamp) {
        if (!this.gameStarted || this.gameOverFlag) return; // Stop loop if game is over

        this.deltaTime = (timestamp - this.lastTime) / 1000; // Time in seconds
        this.lastTime = timestamp;

        this.update();
        this.draw();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update() {
        // Update player
        // Pass enemies to player's update so it can handle interaction logic there
        this.player.update(this.deltaTime, this.gravity, this.terrain, this.enemies);

        // Update held chunk position if player is holding one
        if (this.player.holdingChunk && this.player.heldChunk) {
            this.player.heldChunk.x = this.player.x + (this.player.facing === 'right' ? this.player.width * 0.75 : -this.TILE_SIZE * 0.25);
            this.player.heldChunk.y = this.player.y + this.player.height * 0.5 - this.player.heldChunk.height / 2;
        }

        // Filter out inactive chunks and update active ones (excluding the one potentially held by player)
        this.chunks = this.chunks.filter(chunk => chunk.active || chunk.held);
        this.chunks.forEach(chunk => {
            // Only update chunks that are not currently held by the player
            if (chunk !== this.player.heldChunk) {
                chunk.update(this.deltaTime, this.gravity, this.terrain);
            }
        });

        // Update enemies (both types)
        this.enemies.forEach(enemy => {
            enemy.update(this.deltaTime, this.gravity);
        });
        // Filter out inactive enemies
        this.enemies = this.enemies.filter(enemy => enemy.active);

        // Check for player collision with collectibles
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const collectible = this.collectibles[i];
            if (collectible.active && AABB(this.player.x, this.player.y, this.player.width, this.player.height, collectible.x, collectible.y, collectible.width, collectible.height)) {
                collectible.active = false; // Mark for removal
                if (collectible.type === 'gold') {
                    this.goldScore += 1;
                    this.soundManager.playSound('gold_pickup'); // Play new sound for Gold pickup
                } else if (collectible.type === 'banandium_gem') {
                    this.banandiumScore += 1; // Banandium gems are counted separately, not added to general score
                    this.soundManager.playSound('oh_banana'); // Play existing sound for Banandium Gem
                }
                this.updateScoreDisplay();
            }
        }

        // Check for chunk collision with enemies
        for (let i = this.chunks.length - 1; i >= 0; i--) {
            const chunk = this.chunks[i];
            if (!chunk.active || chunk.held) continue; // Skip inactive or held chunks

            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                // Check if the enemy is active and a collision occurs
                if (enemy.active && AABB(chunk.x, chunk.y, chunk.width, chunk.height, enemy.x, enemy.y, enemy.width, enemy.height)) {
                    // Call takeHit with 'chunk' type, letting the enemy decide its fate
                    enemy.takeHit('chunk');
                    chunk.active = false; // Chunk becomes inactive/destroyed after hitting enemy
                    break; // Chunk hits only one enemy
                }
            }
        }

        // Filter out inactive collectibles
        this.collectibles = this.collectibles.filter(collectible => collectible.active);

        // Update camera position based on player's X
        // The camera tries to keep the player roughly in the left third of the screen
        const targetCameraX = Math.max(0, this.player.x - this.canvas.width / 3);
        this.cameraX = targetCameraX; // Simple snap for now

        // Check if new terrain needs to be generated
        const playerGlobalGridX = Math.floor(this.player.x / this.TILE_SIZE);
        // Generate a new section when the player is within 5 tiles of the currently generated rightmost column
        const generationThreshold = this.terrain.currentMaxCol - 5;
        if (playerGlobalGridX >= generationThreshold) {
            this.terrain.generateNewSection(Math.floor(this.canvas.width / this.TILE_SIZE)); // Generate roughly one screen width of new columns
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background (fixed relative to canvas, does not scroll with foreground)
        const bg = this.assetManager.getImage('bg_mine');
        if (bg) {
            this.ctx.drawImage(bg, 0, 0, this.canvas.width, this.canvas.height);
        }

        this.ctx.save();
        this.ctx.translate(-this.cameraX, 0); // Apply camera offset for all game elements

        // Draw terrain
        this.terrain.draw(this.ctx, this.cameraX);

        // Draw player
        this.player.draw(this.ctx);

        // Draw active chunks
        this.chunks.forEach(chunk => chunk.draw(this.ctx));

        // Draw active collectibles
        this.collectibles.forEach(collectible => collectible.draw(this.ctx));

        // Draw enemies (both types)
        this.enemies.forEach(enemy => enemy.draw(this.ctx));

        this.ctx.restore(); // Restore context to its original state (no camera translation)
    }

    // Callback from Player when a block is broken
    onBlockBroken(gridX, gridY, actionType) {
        const worldX = gridX * this.TILE_SIZE;
        const worldY = gridY * this.TILE_SIZE;

        this.blocksDestroyed++; // Increment blocks destroyed counter
        console.log(`Block destroyed: ${this.blocksDestroyed}`);

        // Chance to spawn gold
        if (Math.random() < this.GOLD_DROP_CHANCE) {
            const gold = new Collectible(worldX, worldY, 'gold', this.assetManager, this.TILE_SIZE);
            this.collectibles.push(gold);
        }

        // If it was a 'tear' action, create and return a new chunk to be held by the player
        if (actionType === 'tear') {
            const chunk = new Chunk(worldX, worldY, this.TILE_SIZE, this.assetManager);
            chunk.hold(); // Mark as held
            this.chunks.push(chunk); // Add to game's general chunk list
            return chunk; // Return the chunk for the player to hold
        }
        return null; // No chunk to return for 'punch' action
    }

    incrementEnemiesDefeated() {
        this.enemiesDefeated++;
        console.log(`Enemies defeated: ${this.enemiesDefeated}`);
    }

    updateScoreDisplay() {
        if (this.goldScoreDisplay) {
            this.goldScoreDisplay.textContent = `Gold: ${this.goldScore}`;
        }
        if (this.banandiumScoreDisplay) {
            this.banandiumScoreDisplay.textContent = `Banandium Gems: ${this.banandiumScore}`;
        }
        
        // Update health display with hearts
        if (this.healthContainer && this.player) {
            this.healthContainer.innerHTML = ''; // Clear existing hearts
            const maxHealth = 3; // Assuming max health is 3 as per Player class
            for (let i = 0; i < maxHealth; i++) {
                const heartImg = document.createElement('img');
                heartImg.src = i < this.player.health ? this.assetManager.getImage('heart_full').src : this.assetManager.getImage('heart_empty').src;
                heartImg.alt = `Heart ${i + 1}`;
                this.healthContainer.appendChild(heartImg);
            }
        }
    }

    gameOver() {
        this.gameOverFlag = true;
        console.log("Game Over!");
        
        let gameOverScreen = document.getElementById('game-over-screen');
        if (!gameOverScreen) {
            const mainGameArea = document.getElementById('main-game-area');
            gameOverScreen = document.createElement('div');
            gameOverScreen.id = 'game-over-screen';
            if (mainGameArea) {
                mainGameArea.appendChild(gameOverScreen);
            } else {
                document.body.appendChild(gameOverScreen); // Fallback
            }
        }

        gameOverScreen.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.85);
            color: white;
            font-size: 4em;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            z-index: 1001;
        `;
        gameOverScreen.innerHTML = `
            <p>GAME OVER!</p>
            <div id="final-scores" style="font-size: 0.4em; margin-top: 20px; text-align: left;">
                <p>Gold Collected: <span style="color: #FFD700;">${this.goldScore}</span></p>
                <p>Banandium Gems Collected: <span style="color: #00FF00;">${this.banandiumScore}</span></p>
                <p>Enemies Defeated: <span style="color: #FF6347;">${this.enemiesDefeated}</span></p>
                <p>Blocks Destroyed: <span style="color: #ADD8E6;">${this.blocksDestroyed}</span></p>
            </div>
            <button id="play-again-button" style="
                background-color: #FFD700; /* Gold */
                color: black;
                font-size: 0.5em;
                padding: 15px 30px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                margin-top: 30px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                transition: background-color 0.3s ease;
            ">Play Again</button>
        `;
        // Ensure the screen is visible
        gameOverScreen.style.display = 'flex';


        const playAgainButton = document.getElementById('play-again-button');
        if (playAgainButton) {
            playAgainButton.addEventListener('click', () => {
                location.reload(); // Reload the page to restart the game
            });
            // Add hover effect
            playAgainButton.addEventListener('mouseover', () => {
                playAgainButton.style.backgroundColor = '#FFEB80'; // Lighter gold on hover
            });
            playAgainButton.addEventListener('mouseout', () => {
                playAgainButton.style.backgroundColor = '#FFD700'; // Original gold
            });
        }
    }
}