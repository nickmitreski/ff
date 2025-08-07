import { getDistance, AABB } from './utils.js';

export class Player {
    constructor(x, y, width, height, assetManager, input, soundManager, tileSize, game) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velX = 0;
        this.velY = 0;
        this.speed = 200; // pixels per second
        this.jumpStrength = 12; // Increased jump strength
        this.onGround = false;
        this.assetManager = assetManager;
        this.input = input;
        this.soundManager = soundManager;
        this.tileSize = tileSize;
        this.game = game; // Reference to the Game instance

        this.health = 3; // New: Player health
        this.invulnerable = false; // New: For temporary invulnerability after hit
        this.invulnerabilityDuration = 1.5; // seconds
        this.invulnerabilityTimer = 0;
        this.flickerTimer = 0; // For visual invulnerability feedback
        this.flickerInterval = 0.1; // How fast the player sprite flickers

        this.state = 'idle'; // idle, running, jumping, punching, holding_chunk, throwing_chunk
        this.facing = 'right'; // right, left

        this.holdingChunk = false;
        this.heldChunk = null; // Reference to the Chunk object being held

        this.punching = false;
        this.punchDuration = 0.2; // seconds
        this.punchTimer = 0;

        this.runAnimationTimer = 0;
        this.runAnimationFrame = 1; // 1 or 2
        this.runAnimationSpeed = 0.1; // seconds per frame

        this.throwCooldown = 0.5; // seconds
        this.throwTimer = 0; // for preventing spamming throw
    }

    update(deltaTime, gravity, terrain, enemies) {
        // Reset horizontal velocity
        this.velX = 0;

        // Apply punch cooldown
        if (this.punching) {
            this.punchTimer += deltaTime;
            if (this.punchTimer >= this.punchDuration) {
                this.punching = false;
                // State will be updated below based on onGround and movement
            }
        }
        
        // Apply throw cooldown
        if (this.throwTimer > 0) {
            this.throwTimer -= deltaTime;
        }

        // Handle invulnerability timer
        if (this.invulnerable) {
            this.invulnerabilityTimer += deltaTime;
            this.flickerTimer += deltaTime;
            if (this.invulnerabilityTimer >= this.invulnerabilityDuration) {
                this.invulnerable = false;
                this.invulnerabilityTimer = 0;
                this.flickerTimer = 0; // Reset flicker timer too
            }
        }

        // Handle movement input
        if (this.input.isKeyDown('a')) {
            this.velX = -this.speed;
            this.facing = 'left';
        }
        if (this.input.isKeyDown('d')) {
            this.velX = this.speed;
            this.facing = 'right';
        }

        // Handle jumping
        if (this.input.isKeyPressed('w') && this.onGround) {
            this.velY = -this.jumpStrength;
            this.onGround = false;
            this.state = 'jumping';
            this.soundManager.playSound('jump');
        }

        // Handle punching
        if (this.input.isKeyPressed('k') && !this.punching && !this.holdingChunk) {
            this.punching = true;
            this.punchTimer = 0;
            this.state = 'punching';
            this.soundManager.playSound('punch');
            // Perform punch action against terrain and enemies
            this.performPunch(terrain, enemies);
        }

        // Handle tearing/throwing chunk
        if (this.input.isKeyPressed('l') && this.throwTimer <= 0) {
            if (this.holdingChunk) {
                this.performThrow();
            } else {
                const brokenTileInfo = this.performTear(terrain);
                if (brokenTileInfo) {
                    const newChunk = this.game.onBlockBroken(brokenTileInfo.gridX, brokenTileInfo.gridY, 'tear');
                    if (newChunk) {
                        this.heldChunk = newChunk;
                        this.holdingChunk = true;
                        this.state = 'holding_chunk';
                        this.soundManager.playSound('pickup');
                    }
                }
            }
            this.throwTimer = this.throwCooldown;
        }

        // Apply gravity
        this.velY += gravity;

        // Calculate potential new position
        let newX = this.x + this.velX * deltaTime;
        let newY = this.y + this.velY;

        // Horizontal collision
        this.x = newX;
        let collidedTileX = this.checkCollisionX(terrain);
        if (collidedTileX) {
            const tileX = collidedTileX[0] * this.tileSize;
            if (this.velX > 0) { // Moving right
                this.x = tileX - this.width;
            } else if (this.velX < 0) { // Moving left
                this.x = tileX + this.tileSize;
            }
            this.velX = 0;
        }

        // Vertical collision
        // Assume not on ground unless a clear ground collision is detected or confirmed
        this.onGround = false; 
        this.y = newY; // Move to new potential Y position for collision check

        let collidedTileY = this.checkCollisionY(terrain);
        if (collidedTileY) {
            const tileY = collidedTileY[1] * this.tileSize;
            if (this.velY > 0) { // Falling and hit ground
                // Snap player to the top of the collided tile
                this.y = tileY - this.height;
                this.velY = 0;
                this.onGround = true; // Player has landed on solid ground
            } else if (this.velY < 0) { // Moving up and hit ceiling
                this.y = tileY + this.tileSize; // Snap to bottom of tile
                this.velY = 0;
            }
        }
        
        // If vertical velocity is zero, perform a more robust check for 'onGround' status.
        // This helps prevent "floating" just above ground due to floating point inaccuracies or edge cases.
        if (this.velY === 0) { 
            // Check 1 pixel below the player's bottom-left and bottom-right points
            const pixelBelowY = this.y + this.height + 1; 
            const tileBelowLeft = terrain.getTile(this.x + 1, pixelBelowY); 
            const tileBelowRight = terrain.getTile(this.x + this.width - 2, pixelBelowY); 
            
            if (tileBelowLeft === 1 || tileBelowLeft === 2 || tileBelowRight === 1 || tileBelowRight === 2) {
                this.onGround = true;
            } else {
                this.onGround = false; 
            }
        } else {
            this.onGround = false;
        }

        // Check for player-enemy collision for damage
        if (!this.invulnerable) {
            for (let i = enemies.length - 1; i >= 0; i--) {
                const enemy = enemies[i];
                if (enemy.active && AABB(this.x, this.y, this.width, this.height, enemy.x, enemy.y, enemy.width, enemy.height)) {
                    this.takeDamage();
                    // Enemy is defeated after hitting player, regardless of type
                    enemy.active = false;
                    break; // Player can only be hit by one enemy at a time
                }
            }
        }

        // Update state based on onGround after all collisions and final ground checks
        // Only change state if not currently performing a special action
        if (!this.punching && !this.holdingChunk && this.state !== 'throwing_chunk') {
            if (this.onGround) {
                this.state = (this.input.isKeyDown('a') || this.input.isKeyDown('d')) ? 'running' : 'idle';
            } else {
                this.state = 'jumping'; // Player is in the air
            }
        }

        // Update held chunk position
        if (this.holdingChunk && this.heldChunk) {
            this.heldChunk.x = this.x + (this.facing === 'right' ? this.width * 0.75 : -this.tileSize * 0.25);
            this.heldChunk.y = this.y + this.height * 0.5 - this.heldChunk.height / 2;
        }

        // Update run animation timer
        if (this.state === 'running') {
            this.runAnimationTimer += deltaTime;
            if (this.runAnimationTimer >= this.runAnimationSpeed) {
                this.runAnimationFrame = this.runAnimationFrame === 1 ? 2 : 1;
                this.runAnimationTimer = 0;
            }
        } else {
            this.runAnimationFrame = 1; // Reset to first frame when not running
        }

        this.input.update(); // Clear pressed keys for the next frame
    }

    checkCollisionX(terrain) {
        const playerLeft = this.x;
        const playerRight = this.x + this.width;
        const playerTop = this.y;
        const playerBottom = this.y + this.height;

        // Convert player's bounding box to terrain grid coordinates
        const startCol = Math.floor(playerLeft / this.tileSize);
        const endCol = Math.ceil(playerRight / this.tileSize) - 1;
        const startRow = Math.floor(playerTop / this.tileSize);
        const endRow = Math.ceil(playerBottom / this.tileSize) - 1;

        for (let row = Math.max(0, startRow); row <= Math.min(terrain.map.length - 1, endRow); row++) {
            for (let col = Math.max(0, startCol); col <= Math.min(terrain.map[0].length - 1, endCol); col++) {
                const tileType = terrain.map[row]?.[col]; // Added optional chaining for safety
                if (tileType === 1 || tileType === 2) { // Solid or breakable block
                    const tileX = col * this.tileSize;
                    const tileY = row * this.tileSize;
                    if (AABB(playerLeft, playerTop, this.width, this.height, tileX, tileY, this.tileSize, this.tileSize)) {
                        return [col, row]; // Return the grid coordinates of the colliding tile
                    }
                }
            }
        }
        return null; // No collision found
    }

    checkCollisionY(terrain) {
        const playerLeft = this.x;
        const playerRight = this.x + this.width;
        const playerTop = this.y;
        const playerBottom = this.y + this.height;

        const startCol = Math.floor(playerLeft / this.tileSize);
        const endCol = Math.ceil(playerRight / this.tileSize) - 1;
        const startRow = Math.floor(playerTop / this.tileSize);
        const endRow = Math.ceil(playerBottom / this.tileSize) - 1;

        for (let row = Math.max(0, startRow); row <= Math.min(terrain.map.length - 1, endRow); row++) {
            for (let col = Math.max(0, startCol); col <= Math.min(terrain.map[0].length - 1, endCol); col++) {
                const tileType = terrain.map[row]?.[col]; // Added optional chaining for safety
                if (tileType === 1 || tileType === 2) { // Solid or breakable block
                    const tileX = col * this.tileSize;
                    const tileY = row * this.tileSize;
                    if (AABB(playerLeft, playerTop, this.width, this.height, tileX, tileY, this.tileSize, this.tileSize)) {
                        return [col, row]; // Return the grid coordinates of the colliding tile
                    }
                }
            }
        }
        return null; // No collision found
    }

    performPunch(terrain, enemies) {
        // Determine punch area relative to player's facing direction
        let punchX = this.x;
        let punchY = this.y + this.height / 4;
        let punchWidth = this.tileSize / 2;
        let punchHeight = this.height / 2;

        if (this.facing === 'right') {
            punchX = this.x + this.width - 5; // Little overlap
        } else {
            punchX = this.x - punchWidth + 5; // Little overlap
        }

        // Check for enemy hit first
        let enemyHit = false;
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            if (enemy.active && AABB(punchX, punchY, punchWidth, punchHeight, enemy.x, enemy.y, enemy.width, enemy.height)) {
                // Call takeHit with 'punch' type, let the enemy decide if it's defeated
                const wasDefeated = enemy.takeHit('punch');
                if (wasDefeated) {
                    enemyHit = true;
                }
                // Even if not defeated, we count it as a "hit" for player's action
                break; // Only hit one enemy per punch
            }
        }
        
        // If an enemy was defeated by the punch, do not also hit a terrain block for this punch
        if (enemyHit) return;

        // If no enemy defeated, proceed to check terrain
        // Convert punch area to grid coordinates
        const startCol = Math.floor(punchX / this.tileSize);
        const endCol = Math.ceil((punchX + punchWidth) / this.tileSize) - 1;
        const startRow = Math.floor(punchY / this.tileSize);
        const endRow = Math.ceil((punchY + punchHeight) / this.tileSize) - 1;

        for (let r = Math.max(0, startRow); r <= Math.min(terrain.map.length - 1, endRow); r++) {
            for (let c = Math.max(0, startCol); c <= Math.min(terrain.map[0].length - 1, endCol); c++) {
                // Check if it's a solid (1) or breakable (2) block
                if (terrain.map[r]?.[c] === 1 || terrain.map[r]?.[c] === 2) { // Added optional chaining
                    terrain.removeBlock(c, r);
                    this.soundManager.playSound('break');
                    this.game.onBlockBroken(c, r, 'punch'); // Notify game of broken block
                    return; // Only break one block per punch
                }
            }
        }
    }

    performTear(terrain) {
        // First, check for blocks directly below the player
        const playerFeetX = this.x + this.width / 2; // Center of player's feet
        const playerFeetY = this.y + this.height + 1; // Just below player's feet

        const gridXBelow = Math.floor(playerFeetX / this.tileSize);
        const gridYBelow = Math.floor(playerFeetY / this.tileSize);

        if (gridYBelow >= 0 && gridYBelow < terrain.rows && gridXBelow >= 0 && gridXBelow < terrain.currentMaxCol) {
            const tileTypeBelow = terrain.map[gridYBelow]?.[gridXBelow];
            if (tileTypeBelow === 1 || tileTypeBelow === 2) { // Solid or breakable block
                terrain.removeBlock(gridXBelow, gridYBelow);
                return { gridX: gridXBelow, gridY: gridYBelow }; // Return info about broken block
            }
        }

        // If no block found directly below, check for blocks in front (original functionality)
        let tearX = this.x;
        let tearY = this.y + this.height / 4;
        let tearWidth = this.tileSize / 2;
        let tearHeight = this.height / 2;

        if (this.facing === 'right') {
            tearX = this.x + this.width - 5;
        } else {
            tearX = this.x - tearWidth + 5;
        }

        const startCol = Math.floor(tearX / this.tileSize);
        const endCol = Math.ceil((tearX + tearWidth) / this.tileSize) - 1;
        const startRow = Math.floor(tearY / this.tileSize);
        const endRow = Math.ceil((tearY + tearHeight) / this.tileSize) - 1;

        for (let r = Math.max(0, startRow); r <= Math.min(terrain.map.length - 1, endRow); r++) {
            for (let c = Math.max(0, startCol); c <= Math.min(terrain.map[0].length - 1, endCol); c++) {
                // Check if it's a solid (1) or breakable (2) block
                if (terrain.map[r]?.[c] === 1 || terrain.map[r]?.[c] === 2) {
                    terrain.removeBlock(c, r);
                    return { gridX: c, gridY: r }; // Return info about broken block
                }
            }
        }
        return null; // No block broken
    }

    performThrow() {
        if (this.heldChunk) {
            // Player's throw velocity calculation
            const throwVelXMagnitude = 500;
            const throwVelYInitial = -8; // Give an initial upward velocity for the arc (negative means up)

            let throwVelX = this.facing === 'right' ? throwVelXMagnitude : -throwVelXMagnitude;
            let throwVelY = throwVelYInitial; 
            
            this.heldChunk.release(throwVelX, throwVelY);
            this.holdingChunk = false;
            this.heldChunk = null; // Clear reference
            this.state = 'throwing_chunk';
            this.soundManager.playSound('throw');
        }
    }

    takeDamage() {
        if (this.invulnerable) return; // Cannot take damage if invulnerable

        this.health -= 1;
        this.game.updateScoreDisplay(); // Update health display
        console.log(`Player hit! Health: ${this.health}`);

        if (this.health <= 0) {
            this.game.gameOver();
        } else {
            // Become temporarily invulnerable
            this.invulnerable = true;
            this.invulnerabilityTimer = 0;
            this.flickerTimer = 0;
            // Play a sound effect for being hit, if available
        }
    }

    draw(ctx) {
        let image;
        let scaleX = 1;
        let translateX = this.x; // Default translation for facing right

        switch (this.state) {
            case 'idle':
                image = this.assetManager.getImage('dk_idle');
                break;
            case 'running':
                image = this.assetManager.getImage(`dk_run${this.runAnimationFrame}`);
                break;
            case 'jumping':
                image = this.assetManager.getImage('dk_jump');
                break;
            case 'punching':
                image = this.assetManager.getImage('dk_punch');
                break;
            case 'holding_chunk':
                image = this.assetManager.getImage('dk_hold');
                break;
            case 'throwing_chunk':
                image = this.assetManager.getImage('dk_throw');
                break;
            default:
                image = this.assetManager.getImage('dk_idle');
                break;
        }

        if (image) {
            ctx.save();
            if (this.facing === 'left') {
                scaleX = -1;
                translateX = this.x + this.width; // Translate to the right edge of the player's bounding box for flipping
            } 

            // Apply translation to position the sprite (and origin for scaling)
            ctx.translate(translateX, this.y);
            // Apply scaling for horizontal flip
            ctx.scale(scaleX, 1);

            // Apply flickering effect if invulnerable
            if (this.invulnerable && Math.floor(this.flickerTimer / this.flickerInterval) % 2 !== 0) {
                // Skip drawing this frame to create a flicker effect
                ctx.restore();
                return;
            }

            // Draw the image at (0,0) relative to the translated and scaled origin
            // The image will be drawn with its original width and height, but horizontally flipped if scaleX is -1
            ctx.drawImage(image, 0, 0, this.width, this.height);
            ctx.restore();
        } else {
            // Fallback: draw a colored rectangle if image not loaded
            ctx.fillStyle = 'brown';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        // Draw bounding box for debugging
        // ctx.strokeStyle = 'red';
        // ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}